import { Buffer } from 'node:buffer';
export declare function createInvoicePDF({ clientName, clientEmail, clientPhone, invoiceDate, invoiceNumber, companyName, amount, productName, currency, state, hsnCode }: {
    clientName: any;
    clientEmail: any;
    clientPhone: any;
    invoiceDate: any;
    invoiceNumber: any;
    companyName: any;
    amount: any;
    productName: any;
    currency: any;
    state: any;
    hsnCode: any;
}): Promise<Buffer<any>>;
export declare function sendEmailInvoice(payload: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    invoiceDate: string;
    amount: number;
    productName: string;
    companyName: string;
    currency: string;
    state: string;
    hsnCode: string;
    folderId: string;
    shouldSendEmail?: boolean;
}): Promise<{
    invoiceNumber: any;
    driveLink: string;
} | undefined>;
//# sourceMappingURL=invoice.d.ts.map