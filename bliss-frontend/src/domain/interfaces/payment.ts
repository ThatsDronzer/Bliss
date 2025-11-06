export interface AmountBreakdown {
  total: number;
  totalInPaise: number;
  advanceAmount: number;
  platformFee: number;
  remainingAmount: number;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  amount: AmountBreakdown;
}


