import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER!; 

if (!accountSid || !authToken || !fromWhatsAppNumber) {
  throw new Error("Missing Twilio environment variables. Check .env.local");
}

const client = twilio(accountSid, authToken);

/**
 * sendWhatsApp - sends a WhatsApp message using Twilio
 * @param to E.164 phone number without 'whatsapp:' prefix (e.g. +919876543210)
 * @param body string message to send
 */
export async function sendWhatsApp(to: string, body: string) {
  if (!to) throw new Error("Missing 'to' phone number");
  try {
    
    const toWhatsApp = `whatsapp:${to}`;
    const res = await client.messages.create({
      from: fromWhatsAppNumber,
      to: toWhatsApp,
      body,
    });
    console.log("Twilio sendWhatsApp success:", res.sid);
    return { success: true, sid: res.sid };
  } catch (error) {
    console.error("Twilio sendWhatsApp error:", error);
    throw error;
  }

}
console.log("loaded twilio sid: ",process.env.TWILIO_ACCOUNT_SID?.slice(0, 10));

