const { MessagingResponse } = require('twilio').twiml;
const pool = require('../config/db');

const handleIncomingMessage = async (req, res) => {
    const twiml = new MessagingResponse();
    const incomingMessage = req.body.Body ? req.body.Body.toLowerCase().trim() : '';
    const fromPhone = req.body.From; // format: "whatsapp:+1234567890"

    console.log(`[WhatsApp Bot] Incoming from ${fromPhone}: "${incomingMessage}"`);

    try {
        // 1. Identify the Parent by extracting email logic (Mocking phone lookup since we use email mostly)
        const { rows: parents } = await pool.query('SELECT id, student_id, parent_name FROM parents LIMIT 1');
        
        if (parents.length === 0) {
            twiml.message("Sorry, I couldn't find a registered parent record associated with this number.");
            res.type('text/xml').send(twiml.toString());
            return;
        }

        const parentId = parents[0].id;
        const studentId = parents[0].student_id;
        const parentName = parents[0].parent_name;

        // 2. State Machine Routing based on Keywords
        if (incomingMessage.includes('receipt') || incomingMessage.includes('paid')) {
            const { rows: receipts } = await pool.query(
                'SELECT * FROM receipts WHERE parent_name = $1 ORDER BY issue_date DESC LIMIT 1',
                [parentName]
            );

            if (receipts.length > 0) {
                const r = receipts[0];
                const msg = `🧾 *Direct Access Syndicate*\n\n*Receipt No:* ${r.receipt_no}\n*Student:* ${r.student_name}\n*Amount:* SLL ${Number(r.amount).toLocaleString()}\n*Date:* ${new Date(r.issue_date).toLocaleDateString()}\n*Level:* ${r.level}\n\nThank you for your payment!`;
                twiml.message(msg);
            } else {
                twiml.message("I could not find any recent receipts tied to your account. Please contact the Financial Manager.");
            }

        } else if (incomingMessage.includes('feedback') || incomingMessage.includes('report') || incomingMessage.includes('credibility')) {
            const { rows: feedbacks } = await pool.query(
                'SELECT * FROM student_feedbacks WHERE student_id = $1 ORDER BY created_at DESC LIMIT 1',
                [studentId]
            );

            if (feedbacks.length > 0) {
                const f = feedbacks[0];
                const typeEmoji = '🌟'; // Simplified as feedback_type column might not exist or differs
                const msg = `${typeEmoji} *Recent Feedback Report*\n\n*Subject:* ${f.subject}\n*Message:* "${f.feedback_text}"\n*Date:* ${new Date(f.created_at).toLocaleDateString()}\n\nReply 'Menu' for more options.`;
                twiml.message(msg);
            } else {
                twiml.message("There are no recent teacher feedbacks or credibility reports for your child.");
            }

        } else if (incomingMessage.includes('hello') || incomingMessage.includes('hi') || incomingMessage.includes('menu')) {
             twiml.message("👋 Welcome to the *Direct Access Syndicate* Automated Assistant!\n\nHow can I help you today? Reply with a keyword:\n\n1. Type *Receipt* to get your latest payment invoice.\n2. Type *Report* to see your child's latest teacher feedback.\n3. Type *Support* to get our hotline numbers.");
        } else if (incomingMessage.includes('support')) {
             twiml.message("📞 *Direct Access Syndicate Support*\n\nProprietor: 078003333\nFinancial Manager: 073573032\n\nMain Campus: Syke street at arthodox school near flaming church.");
        } else {
             twiml.message("I didn't quite understand that. Reply with *Menu* to see what I can do for you!");
        }

    } catch (error) {
        console.error('[WhatsApp Bot Error]', error);
        twiml.message("Sorry, our database system is currently offline. Please try again later.");
    }

    res.type('text/xml').send(twiml.toString());
};

module.exports = {
    handleIncomingMessage
};
