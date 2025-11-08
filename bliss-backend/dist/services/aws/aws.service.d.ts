import type { IBulkEmail } from '@models/email/email.modal';
export declare function sendUsersEmail(payload: {
    recipients: string[];
    subject: string;
    body: string;
}): Promise<{
    message: string;
}>;
export declare function sendBulkEmail(payload: IBulkEmail[]): Promise<unknown>;
//# sourceMappingURL=aws.service.d.ts.map