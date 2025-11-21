import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface UseRazorpayReturn {
  loading: boolean;
  initiatePayment: (messageId: string, userData: any, listingTitle?: string) => Promise<void>;
}

export const useRazorpay = (): UseRazorpayReturn => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (messageId: string, userData: any, listingTitle?: string) => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create payment order
      const orderResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Your Platform Name',
        description: `Booking for: ${listingTitle || 'Service'}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verificationResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verificationData = await verificationResponse.json();

            if (verificationData.success) {
              // Payment successful - show breakdown
              alert(`Payment successful!\n
Total: ₹${verificationData.amount}
Advance to Vendor: ₹${verificationData.advancePaid}
Platform Fee: ₹${orderData.amountBreakdown.platformFee}
Remaining to Vendor after service: ₹${orderData.amountBreakdown.remainingAmount}`);
              
              // Redirect or update UI
              window.location.reload();
            } else {
              alert(`Payment failed: ${verificationData.error}`);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userData.name || '',
          email: userData.email || '',
          contact: userData.phone || '',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function() {
            alert('Payment cancelled by user');
          },
        },
        notes: {
          messageId: messageId,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return { loading, initiatePayment };
};