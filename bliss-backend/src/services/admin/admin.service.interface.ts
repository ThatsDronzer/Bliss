export interface IAdminService {
	getAdminPayments(): Promise<any>;
	processAdvancePayment(paymentId: string): Promise<any>;
	processFullPayment(paymentId: string): Promise<any>;
}

