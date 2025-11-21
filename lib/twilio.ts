import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

// Initialize client only if all credentials are available
let client: ReturnType<typeof twilio> | null = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
  console.log("Twilio client initialized successfully");
} else {
  console.warn("Twilio credentials missing - WhatsApp notifications will not work");
  console.warn("Missing:", {
    accountSid: !accountSid,
    authToken: !authToken,
    fromWhatsAppNumber: !fromWhatsAppNumber
  });
}

/**
 * sendWhatsApp - sends a WhatsApp message using Twilio
 * @param to E.164 phone number without 'whatsapp:' prefix (e.g. +919876543210)
 * @param body string message to send
 */
export async function sendWhatsApp(to: string, body: string) {
  if (!to) throw new Error("Missing 'to' phone number");
  
  if (!client || !fromWhatsAppNumber) {
    throw new Error("Twilio not configured. Missing environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_WHATSAPP_NUMBER");
  }
  
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

console.log("Twilio module loaded. Account SID:", accountSid?.slice(0, 10));


