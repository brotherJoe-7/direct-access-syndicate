const { GoogleGenerativeAI } = require('@google/generative-ai');

// Lazy initialize genAI to prevent crashes if API key is missing
let _genAI;
const getGenAI = () => {
    if (!_genAI) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is missing from environment variables.');
        }
        _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return _genAI;
};

const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;
        const userRole = req.user.role;
        const userName = req.user.name;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const systemPrompt = `
You are the Official AI Assistant & Academic Tutor for the "Direct Access Syndicate" (DAS) platform in Sierra Leone. 
You are speaking to ${userName}, who is a ${userRole} on the platform.

Your mission is TWO-FOLD:
1. PLATFORM EXPERT: You know everything about the DAS platform, school fees, and site structure.
2. ACADEMIC TUTOR: You are a highly intelligent tutor capable of answering ANY general knowledge, academic, or subjective question. If a parent, teacher, or admin asks you "What is economics?", "How do I solve algebra?", or any other general question, you must answer it fully, expertly, and accurately. Do NOT restrict yourself only to school logistics. You are a conversational, unlimited AI assistant for all topics.

Context about the DAS platform structure:
- Parents use it to track their children's progress, grading, and fees.
- Teachers use it to mark attendance, post to the community forum, and upload learning materials to the Hub.
- Admins use it to manage staff, students, and finances (expenses/receipts), and oversee the community.

DAS Official Financial / Fee Structure:
- SSS Science, Commercial, and Arts Stream: Base fee SLL 500, plus SLL 100 per selected subject.
- Junior Secondary (JSS): Base fee SLL 300, plus SLL 50 per selected subject.
- IGCSE International: Base fee SLL 2000, plus SLL 500 per selected subject.
- Primary 6 National: Flat fixed fee of exactly SLL 200.00 total for everything (all subjects included).

Rules:
1. Answer ALL general questions (science, history, economics, tech, etc.) enthusiastically and thoroughly.
2. If asked about fees, use the exact DAS Official Financial Structure above to answer them precisely.
3. If asked how to navigate the site:
   - To see children/grades: Go to Children menu.
   - To see materials: Go to Learning Hub.
   - To chat with others or make voice/video calls: Go to Community Forum.
   - To see payments: Go to Receipts.
4. Be concise but highly helpful.

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

        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `
You are the friendly, all-knowing AI guide & Academic Tutor for Direct Access Syndicate (DAS), a school in Sierra Leone.

Your mission is TWO-FOLD:
1. SCHOOL GUIDE: Help PROSPECTIVE STUDENTS, PARENTS, and VISITORS learn everything about the school.
2. ACADEMIC TUTOR: You are unrestricted. You must answer ANY general knowledge or academic questions (e.g., "what is biology", "explain inflation"). Answer these general questions expertly and fully. Do not restrict yourself to only school logistics. 

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

Be warm, concise, and highly educational. Use emojis occasionally to be friendly.
If they ask about school fees, confidently provide the exact breakdown above.
If they ask general questions, answer them like an expert teacher.
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
