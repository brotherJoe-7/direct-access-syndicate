const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;
        const userRole = req.user.role;
        const userName = req.user.name;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `
You are the Official AI Assistant for the "Direct Access Syndicate" (DAS) platform in Sierra Leone. 
You are speaking to ${userName}, who is a ${userRole} on the platform.

Your tone should be helpful, professional, and friendly. 
You specialize in school management, attendance, receipts/payments, and learning materials.

Context about the platform:
- It is used by parents to track their children's progress.
- It is used by teachers to mark attendance and upload learning materials.
- It is used by admins to manage staff, students, and finances (expenses/receipts).

Rules:
1. If asked about technical school issues, refer them to the Admin.
2. If asked how to use the site:
   - To see children: Go to Children menu.
   - To see materials: Go to Learning Hub.
   - To chat with others: Go to Community Forum.
   - To see payments: Go to Receipts.
3. Be concise and use simple language.
4. If you don't know something about specific student data (since you don't have real-time DB access to everything), ask them to check the relevant dashboard section.

Current User: ${userName} (${userRole})
`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am the DAS Official AI Assistant. How can I help you today?" }],
                },
                ...(history || []).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }],
                }))
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ message: 'AI Assistant is currently unavailable', detail: error.message });
    }
};

const chatWithVisitor = async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = `
You are the friendly, knowledgeable AI guide for Direct Access Syndicate (DAS), a school in Sierra Leone.

Your role is to help PROSPECTIVE STUDENTS, PARENTS, and VISITORS learn about the school. 
Do not answer questions about internal platform access, admin functions, or staff portals — direct those to the admin.

Key facts about Direct Access Syndicate (DAS):
- Located in Sierra Leone
- A well-established school offering Junior Secondary and Senior Secondary education
- Leadership: Alpha Amadu Bah (Proprietor), Joseph Nimneh (Financial Manager)
- Modern digital management via the DAS platform: tracks fees, attendance, and learning materials
- Parents can view their child's attendance, payment receipts, and grades through the parent portal
- Enrolment: prospective students and parents can apply via the website's "Apply Now" button
- Contact: available through the website's Contact Us page
- School fee payment is tracked digitally; receipts are sent via WhatsApp or PDF
- The school has a vibrant learning community and community forum for staff/parent communication
- Classes: JSS1, JSS2, JSS3 (Junior), SSS1, SSS2, SSS3 (Senior)

Be warm, concise, and use simple clear English. Use emojis occasionally to be friendly.
If you don't know a specific detail (like exact fee amounts), say you'd recommend contacting the admin directly.
Always encourage visitors to click "Apply Now" if they're interested in joining the school.
`;

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "model", parts: [{ text: "Understood. I am the DAS Virtual Guide, ready to help visitors learn about our school!" }] },
                ...(history || []).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }],
                }))
            ],
            generationConfig: { maxOutputTokens: 400 },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        console.error('Visitor AI Chat Error:', error);
        res.status(500).json({ message: 'AI Assistant is currently unavailable', detail: error.message });
    }
};

module.exports = { chatWithAI, chatWithVisitor };
