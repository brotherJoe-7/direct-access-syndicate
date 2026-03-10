/**
 * MOCK TWILIO REQUEST SCRIPT
 * Because we are on localhost, Twilio cannot natively ping our webhook.
 * We must artificially send POST requests to our server to prove the NLP logic.
 */

const axios = require('axios');

async function testWhatsAppBot() {
    console.log("=== INITIATING DIRECT ACCESS SYNDICATE WHATSAPP BOT TEST ===");

    const parentNumber = "whatsapp:+23277000111";
    
    // Simulate what the parent types
    const textPrompts = [
        "Hello", 
        "support", 
        "Show me my receipt",
        "Has the teacher sent any reports or feedback?"
    ];

    for (const prompt of textPrompts) {
        console.log(`\n\n[MOCK] Parent texts: "${prompt}"`);
        
        try {
            const response = await axios.post('http://localhost:5000/api/whatsapp/webhook', {
                From: parentNumber,
                Body: prompt
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("[MOCK] Bot Replies (TwiML XML):");
            console.log(response.data);
            
            // Artificial delay between requests
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error("Test failed: Server returned error", error.message);
        }
    }
}

testWhatsAppBot();
