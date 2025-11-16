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

  // Bidding System Templates

  newBidOrderNotify: ({
    orderTitle,
    orderType,
    eventDate,
    biddingDeadline
  }: {
    orderTitle: string;
    orderType: string;
    eventDate: string;
    biddingDeadline: string;
  }) =>
    `🆕 *New Bidding Opportunity!*\n\nA new order is now open for bidding:\n\n📦 *Order:* ${orderTitle}\n📋 *Type:* ${orderType}\n📅 *Event Date:* ${eventDate}\n⏰ *Bidding Deadline:* ${biddingDeadline}\n\n💰 Submit your best quote and win the order!\n\n🔗 View & Bid: https://bliss-blush-chi.vercel.app/vendor-dashboard/bid-opportunities\n\nGood luck! 🍀`,

  bidSubmittedAdminNotify: ({
    vendorName,
    orderTitle,
    bidAmount,
    totalBids
  }: {
    vendorName: string;
    orderTitle: string;
    bidAmount: string;
    totalBids: number;
  }) =>
    `📊 *New Bid Received*\n\n*${vendorName}* has submitted a bid:\n\n📦 Order: ${orderTitle}\n💰 Bid Amount: ₹${bidAmount}\n📈 Total Bids: ${totalBids}\n\n🔗 Review Bids: https://bliss-blush-chi.vercel.app/admin-dashboard/bid-orders`,

  bidWonNotify: ({
    orderTitle,
    orderType,
    eventDate,
    bidAmount
  }: {
    orderTitle: string;
    orderType: string;
    eventDate: string;
    bidAmount: string;
  }) =>
    `🎉 *Congratulations! You Won the Bid!*\n\nYour bid has been selected as the winner:\n\n📦 *Order:* ${orderTitle}\n📋 *Type:* ${orderType}\n📅 *Event Date:* ${eventDate}\n💰 *Your Bid:* ₹${bidAmount}\n\n⏭️ *Next Steps:*\n• Admin will review and assign the order\n• Check your dashboard for order details\n• Prepare for order fulfillment\n\n🔗 Dashboard: https://bliss-blush-chi.vercel.app/vendor-dashboard/won-orders\n\nThank you for your competitive pricing! 💼`,

  bidLostNotify: ({
    orderTitle,
    yourBid,
    winningBid
  }: {
    orderTitle: string;
    yourBid: string;
    winningBid: string;
  }) =>
    `📉 *Bid Update*\n\nUnfortunately, your bid was not selected for:\n\n📦 *Order:* ${orderTitle}\n💰 *Your Bid:* ₹${yourBid}\n🏆 *Winning Bid:* ₹${winningBid}\n\nDon't worry! More opportunities are coming:\n• Check for new bid orders\n• Review your pricing strategy\n• Keep competing for better chances\n\n🔗 New Opportunities: https://bliss-blush-chi.vercel.app/vendor-dashboard/bid-opportunities\n\nKeep bidding! 🚀`,

  orderAssignedNotify: ({
    orderTitle,
    eventDate,
    location,
    prebookingAmount
  }: {
    orderTitle: string;
    eventDate: string;
    location: string;
    prebookingAmount?: string;
  }) => {
    const prebookingMsg = prebookingAmount
      ? `\n💵 *Prebooking Amount:* ₹${prebookingAmount} (to be paid by you to secure the order)`
      : '';

    return `✅ *Order Officially Assigned!*\n\nThe admin has confirmed your order assignment:\n\n📦 *Order:* ${orderTitle}\n📅 *Event Date:* ${eventDate}\n📍 *Location:* ${location}${prebookingMsg}\n\n📋 *Action Required:*\n• Review complete order details\n• Contact admin if prebooking is required\n• Start preparation for service delivery\n\n🔗 Order Details: https://bliss-blush-chi.vercel.app/vendor-dashboard/assigned-orders\n\nLet's deliver excellence! 🌟`;
  },

  biddingClosedNotify: ({
    orderTitle,
    totalBids
  }: {
    orderTitle: string;
    totalBids: number;
  }) =>
    `⏰ *Bidding Closed*\n\nBidding has ended for:\n\n📦 *Order:* ${orderTitle}\n📊 *Total Bids Received:* ${totalBids}\n\n🔄 Winner selection is in progress. You will be notified shortly!\n\n🔗 Track Status: https://bliss-blush-chi.vercel.app/vendor-dashboard/my-bids`,

  kycApprovedNotify: ({ vendorName }: { vendorName: string }) =>
    `✅ *KYC Approved!*\n\nHello ${vendorName},\n\nYour KYC verification has been approved by our admin team.\n\n🎉 You can now participate in bidding!\n\n📋 *Next Steps:*\n• Create prebuilt packages (optional)\n• Browse available bid opportunities\n• Submit competitive quotes\n• Win orders and grow your business\n\n🔗 Start Bidding: https://bliss-blush-chi.vercel.app/vendor-dashboard/bid-opportunities\n\nWelcome to the bidding platform! 💼`,

  kycRejectedNotify: ({ vendorName, reason }: { vendorName: string; reason: string }) =>
    `❌ *KYC Verification Failed*\n\nHello ${vendorName},\n\nYour KYC verification could not be approved.\n\n📝 *Reason:* ${reason}\n\n🔄 *What to do next:*\n• Review the reason above\n• Update your KYC documents\n• Resubmit for verification\n\n🔗 Update KYC: https://bliss-blush-chi.vercel.app/vendor-dashboard/onboarding/kyc\n\nNeed help? Contact support! 💬`,
};
