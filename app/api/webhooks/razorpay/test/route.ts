import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Check if webhook secret is configured
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'RAZORPAY_WEBHOOK_SECRET not configured in environment variables'
      }, { status: 500 });
    }

    // Check if app URL is configured for production
    if (!process.env.NEXT_PUBLIC_APP_URL && process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        success: false,
        error: 'NEXT_PUBLIC_APP_URL not configured in production'
      }, { status: 500 });
    }

    const { event, payload, webhookUrl: customWebhookUrl } = await request.json();
    
    // Create test webhook payload with more realistic data
    const timestamp = Math.floor(Date.now() / 1000);
    const testPayload = {
      event: event || 'payment.captured',
      payload: payload || {
        payment: {
          entity: {
            id: 'pay_test_' + Date.now(),
            order_id: 'order_test_' + Date.now(),
            amount: 1000000, // 10000 INR in paise
            currency: 'INR',
            status: 'captured',
            method: 'card',
            card_id: 'card_test123',
            bank: null,
            wallet: null,
            vpa: null,
            email: 'test@example.com',
            contact: '+919999999999',
            notes: {
              messageId: '65a1b2c3d4e5f67890123456',
              userId: 'user_test_123',
              vendorId: 'vendor_test_456'
            },
            created_at: timestamp,
            captured_at: timestamp
          }
        }
      },
      created_at: timestamp
    };

    const body = JSON.stringify(testPayload);
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    console.log('Sending test webhook:', {
      event: testPayload.event,
      paymentId: testPayload.payload.payment.entity.id,
      orderId: testPayload.payload.payment.entity.order_id,
      amount: testPayload.payload.payment.entity.amount,
      signature: signature.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    });

    // Use custom webhook URL if provided, otherwise use default
    const targetWebhookUrl = customWebhookUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/razorpay`;
    
    console.log('Target webhook URL:', targetWebhookUrl);

    // Send test webhook to yourself with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(targetWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': signature,
          'user-agent': 'Razorpay-Webhook-Test/1.0'
        },
        body: body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = { text: await response.text() };
      }

      console.log('Webhook test response:', {
        status: response.status,
        statusText: response.statusText,
        response: result
      });

      return NextResponse.json({
        success: response.status === 200,
        statusCode: response.status,
        testPayload: {
          event: testPayload.event,
          paymentId: testPayload.payload.payment.entity.id,
          orderId: testPayload.payload.payment.entity.order_id,
          amount: testPayload.payload.payment.entity.amount
        },
        webhookResponse: result,
        signatureValid: true,
        targetUrl: targetWebhookUrl
      });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          error: 'Webhook request timed out after 10 seconds',
          targetUrl: targetWebhookUrl
        }, { status: 408 });
      }
      
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
    }, { status: 500 });
  }
}

// Also allow GET for quick testing
export async function GET(request: NextRequest) {
  const secretConfigured = !!process.env.RAZORPAY_WEBHOOK_SECRET;
  const appUrlConfigured = !!process.env.NEXT_PUBLIC_APP_URL;
  
  // Get base URL for this request
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  return NextResponse.json({
    message: 'Webhook test endpoint is ready',
    environment: process.env.NODE_ENV,
    configurations: {
      secretConfigured,
      secretLength: secretConfigured ? process.env.RAZORPAY_WEBHOOK_SECRET!.length : 0,
      appUrlConfigured,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'Not configured',
      currentBaseUrl: baseUrl
    },
    usage: {
      get: 'GET /api/webhooks/razorpay/test - Check configuration',
      post: 'POST /api/webhooks/razorpay/test - Send test webhook',
      postBody: {
        event: 'payment.captured (optional)',
        payload: 'Custom payload (optional)',
        webhookUrl: 'Custom target URL (optional)'
      },
      examples: {
        payment_captured: {
          event: 'payment.captured',
          payload: { /* payment data */ }
        },
        payment_failed: {
          event: 'payment.failed', 
          payload: { /* failed payment data */ }
        },
        refund_created: {
          event: 'refund.created',
          payload: { /* refund data */ }
        }
      }
    },
    endpoints: {
      mainWebhook: `${baseUrl}/api/webhooks/razorpay`,
      thisTestEndpoint: `${baseUrl}/api/webhooks/razorpay/test`
    }
  });
}

// Add OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}