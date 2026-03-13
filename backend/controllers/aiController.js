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
You can answer general knowledge questions, but your main priority is answering everything about the DAS Syndicate, especially financials and school services.

Context about the platform:
- It is used by parents to track their children's progress.
- It is used by teachers to mark attendance and upload learning materials.
- It is used by admins to manage staff, students, and finances (expenses/receipts).

DAS Official Financial / Fee Structure:
- SSS Science, Commercial, and Arts Stream: Base fee SLL 500, plus SLL 100 per selected subject.
- Junior Secondary (JSS): Base fee SLL 300, plus SLL 50 per selected subject.
- IGCSE International: Base fee SLL 2000, plus SLL 500 per selected subject.
- Primary 6 National: Flat fixed fee of exactly SLL 200.00 total for everything (all subjects included).

Rules:
1. If asked about fees, use the exact DAS Official Financial Structure above to answer them precisely.
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

Your role is to help PROSPECTIVE STUDENTS, PARENTS, and VISITORS learn about the school and you can answer ANY general questions as well.
Do not answer questions about internal platform access, admin functions, or staff portals — direct those to the admin.

Key facts about Direct Access Syndicate (DAS):
- Located in Sierra Leone
- A well-established school offering Primary, Junior Secondary and Senior Secondary education
- Leadership: Alpha Amadu Bah (Proprietor), Pastor Pratt (Financial Manager), Joseph Nimneh (Lead Web Developer)
- Modern digital management via the DAS platform: tracks fees, attendance, and learning materials
- Parents can view their child's attendance, payment receipts, and grades through the parent portal
- Enrolment: prospective students and parents can apply via the website's "Apply Now" button

DAS Official Financial / Fee Structure:
- SSS Science, Commercial, and Arts: Base fee SLL 500, plus SLL 100 per selected subject.
- Junior Secondary (JSS): Base fee SLL 300, plus SLL 50 per selected subject.
- IGCSE International: Base fee SLL 2000, plus SLL 500 per selected subject.
- Primary 6 National: Flat fixed fee of exactly SLL 200.00 total for everything (no extra subject fees).

Be warm, concise, and use simple clear English. Use emojis occasionally to be friendly.
If they ask about school fees, confidently provide the exact breakdown above.
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
