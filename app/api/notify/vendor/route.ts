import { NextResponse } from "next/server";
import twilio from "twilio";
import { templates } from "@/lib/messageTemplate";

// Initialize Twilio client using env vars
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);


export async function POST(request: Request) {
  console.log("SID:", process.env.TWILIO_ACCOUNT_SID);
  console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN);
  console.log("NUMBER:", process.env.TWILIO_WHATSAPP_NUMBER);

  try {
    const { customerName, requestId } = await request.json();

    if (!customerName || !requestId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create message text using your template
    const messageBody = templates.vendorNotify({ customerName, requestId });

    // Send WhatsApp message via Twilio
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.VENDOR_WHATSAPP_NUMBER!,
      body: messageBody,
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error: any) {
    console.error("Error sending WhatsApp message:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
