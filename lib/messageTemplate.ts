// lib/messageTemplates.ts
export const templates = {
  vendorNotify: ({ customerName, requestId }: { customerName: string; requestId: string }) =>
    `📥 New request from *${customerName}*\nRequest ID: ${requestId}\nOpen your vendor dashboard to view details.`,

  customerNotify: ({ vendorName, status }: { vendorName: string; status: string }) =>
    `✅ Your request was *${status.toUpperCase()}* by ${vendorName}.\nThank you for using our service!`,
};
