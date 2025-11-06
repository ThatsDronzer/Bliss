export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'spend' | 'expire';
  relatedBookingId?: string;
  description: string;
  timestamp: Date;
  expiryDate?: Date;
}

export interface UserCoinBalance {
  userId: string;
  balance: number;
  lastUpdated: Date;
}

export interface CoinRewardRules {
  earnPercentage: number; // 5% by default
  maxRedeemPercentage: number; // 20% by default
  expiryMonths: number; // 6 months by default
  conversionRate: number; // 1 coin = ₹1 by default
} 