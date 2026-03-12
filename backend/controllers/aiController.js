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

module.exports = {
    chatWithAI
};
