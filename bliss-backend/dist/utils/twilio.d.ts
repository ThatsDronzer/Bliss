import twilio from 'twilio';
declare let client: ReturnType<typeof twilio> | null;
/**
 * sendWhatsApp - sends a WhatsApp message using Twilio
 * @param to E.164 phone number without 'whatsapp:' prefix (e.g. +919876543210)
 * @param body string message to send
 */
export declare function sendWhatsApp(to: string, body: string): Promise<{
    success: boolean;
    sid: string;
}>;
export default client;
//# sourceMappingURL=twilio.d.ts.map