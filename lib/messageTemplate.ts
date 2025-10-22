// lib/messageTemplates.ts
export const templates = {
vendorNotify: ({ customerName, vendorName }: { customerName: string; vendorName: string }) =>
    `📥 Hello ${vendorName},\n\nYou have a *new service request* from *${customerName}*.\n\nClick below to view and manage the request:\n🔗 https://bliss-blush-chi.vercel.app/vendor-dashboard/messages`
,

customerNotify: ({ vendorName, status }: { vendorName: string; status: string }) =>
    `✅ Your request was *${status.toUpperCase()}* by ${vendorName}.\nThank you for using our service!`,
};
