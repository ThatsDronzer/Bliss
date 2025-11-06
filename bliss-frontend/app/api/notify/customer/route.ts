import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsApp } from '../../../../lib/twilio';
import { templates } from '../../../../lib/messageTemplate';

/**
 * POST /api/notify/customer
 * Expected JSON body: { requestId, customerPhone, vendorName, status, customerName? }
 * status should be a string like 'accepted' or 'rejected'
 */
export async function POST(req: NextRequest) {
	try {
		console.log('=== Customer Notification API Called ===');
		const body = await req.json();
		console.log('Request body:', body);
		
		const { requestId, customerPhone, vendorName, status, customerName } = body as {
			requestId?: string;
			customerPhone?: string;
			vendorName?: string;
			status?: string;
			customerName?: string;
		};

		if (!requestId || !customerPhone || !vendorName || !status) {
			console.log('Missing fields:', { requestId, customerPhone, vendorName, status });
			return NextResponse.json({ error: 'Missing required fields: requestId, customerPhone, vendorName, status' }, { status: 400 });
		}

		console.log('Building message template...');
		// Build message using template
		const message = templates.customerNotify({ vendorName, status });
		console.log('Message created, length:', message.length);

		console.log('Sending WhatsApp to:', customerPhone);
		// Send via Twilio helper (expects E.164 number like +919876543210)
		const result = await sendWhatsApp(customerPhone, message);
		console.log('WhatsApp sent successfully:', result);

		return NextResponse.json({ success: true, result });
	} catch (error) {
		console.error('notify/customer error:', error);
		console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
		return NextResponse.json({ error: (error as Error).message || String(error) }, { status: 500 });
	}
}