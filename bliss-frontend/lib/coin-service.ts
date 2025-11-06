import type { CoinTransaction, UserCoinBalance, CoinRewardRules } from './types';

// Default coin reward rules
const defaultRules: CoinRewardRules = {
  earnPercentage: 5,
  maxRedeemPercentage: 20,
  expiryMonths: 6,
  conversionRate: 1,
};

// Mock database for demo purposes
let coinTransactions: CoinTransaction[] = [];
let userBalances: UserCoinBalance[] = [];

export const CoinService = {
  // Get user's current coin balance
  getUserBalance: async (userId: string): Promise<number> => {
    const userBalance = userBalances.find(b => b.userId === userId);
    return userBalance?.balance || 0;
  },

  // Get user's transaction history
  getUserTransactions: async (userId: string): Promise<CoinTransaction[]> => {
    return coinTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  // Award coins for a booking
  awardCoinsForBooking: async (
    userId: string,
    bookingId: string,
    bookingAmount: number
  ): Promise<CoinTransaction> => {
    const coinsToAward = Math.round((bookingAmount * defaultRules.earnPercentage) / 100);
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + defaultRules.expiryMonths);

    const transaction: CoinTransaction = {
      id: `ct-${Date.now()}`,
      userId,
      amount: coinsToAward,
      type: 'earn',
      relatedBookingId: bookingId,
      description: `Earned from booking #${bookingId}`,
      timestamp: new Date(),
      expiryDate,
    };

    coinTransactions.push(transaction);
    
    // Update user balance
    const existingBalance = userBalances.find(b => b.userId === userId);
    if (existingBalance) {
      existingBalance.balance += coinsToAward;
      existingBalance.lastUpdated = new Date();
    } else {
      userBalances.push({
        userId,
        balance: coinsToAward,
        lastUpdated: new Date(),
      });
    }

    return transaction;
  },

  // Apply coins to a booking
  applyCoinsToBooking: async (
    userId: string,
    bookingId: string,
    bookingAmount: number,
    coinsToApply: number
  ): Promise<{ 
    success: boolean;
    message?: string;
    discountAmount?: number;
    remainingBalance?: number;
  }> => {
    const userBalance = await CoinService.getUserBalance(userId);
    
    if (coinsToApply > userBalance) {
      return {
        success: false,
        message: 'Insufficient coin balance',
      };
    }

    const maxAllowedCoins = Math.floor(bookingAmount * defaultRules.maxRedeemPercentage / 100);
    if (coinsToApply > maxAllowedCoins) {
      return {
        success: false,
        message: `You can only use up to ${maxAllowedCoins} coins for this booking`,
      };
    }

    // Create transaction for coin usage
    const transaction: CoinTransaction = {
      id: `ct-${Date.now()}`,
      userId,
      amount: -coinsToApply,
      type: 'spend',
      relatedBookingId: bookingId,
      description: `Used for booking #${bookingId}`,
      timestamp: new Date(),
    };

    coinTransactions.push(transaction);

    // Update user balance
    const userBalanceRecord = userBalances.find(b => b.userId === userId);
    if (userBalanceRecord) {
      userBalanceRecord.balance -= coinsToApply;
      userBalanceRecord.lastUpdated = new Date();
    }

    return {
      success: true,
      discountAmount: coinsToApply * defaultRules.conversionRate,
      remainingBalance: userBalanceRecord?.balance || 0,
    };
  },

  // Handle coin expiry
  handleCoinExpiry: async (userId: string): Promise<void> => {
    const now = new Date();
    const expiredTransactions = coinTransactions.filter(t => 
      t.userId === userId && 
      t.type === 'earn' && 
      t.expiryDate && 
      t.expiryDate < now
    );

    for (const transaction of expiredTransactions) {
      const expiryTransaction: CoinTransaction = {
        id: `ct-${Date.now()}`,
        userId,
        amount: -transaction.amount,
        type: 'expire',
        description: `Expired coins from transaction ${transaction.id}`,
        timestamp: now,
      };

      coinTransactions.push(expiryTransaction);

      // Update user balance
      const userBalance = userBalances.find(b => b.userId === userId);
      if (userBalance) {
        userBalance.balance -= transaction.amount;
        userBalance.lastUpdated = now;
      }
    }
  },
}; 