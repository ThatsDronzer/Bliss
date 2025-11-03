// lib/messageTemplates.ts
export const templates = {
  vendorNotify: ({ customerName, vendorName , serviceName }: { customerName: string; vendorName: string; serviceName: string }) =>
    `📥 Hello ${vendorName},\n\nYou have a *new service request* for *${serviceName}* from *${customerName}*.\n\nClick below to view and manage the request:\n🔗 https://bliss-blush-chi.vercel.app/vendor-dashboard/messages`,

  customerNotify: ({ vendorName, status }: { vendorName: string; status: string }) => {
    const isAccepted = status.toLowerCase() === 'accepted';
    const emoji = isAccepted ? '✅' : '❌';
    const message = isAccepted 
      ? `🎉 *Great News!*\n\nYour booking request has been *ACCEPTED* by *${vendorName}*!\n\n📋 Next Steps:\n• Review the booking details\n• Complete the payment\n• Check vendor contact information\n\n🔗 View Details: https://bliss-blush-chi.vercel.app/dashboard/messages\n\nThank you for choosing Bliss! 💜`
      : `${emoji} *Booking Update*\n\nYour booking request has been *DECLINED* by *${vendorName}*.\n\nDon't worry! You can:\n• Browse other vendors\n• Modify your request\n• Contact support for assistance\n\n🔗 Dashboard: https://bliss-blush-chi.vercel.app/dashboard/messages\n\nWe're here to help! 💜`;
    
    return message;
  },
};
