// Domain models for AdminPayment entity
export interface IAdminPayment {
	_id?: string;
	paymentId: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface ICreateAdminPaymentInput {
	paymentId: string;
}

