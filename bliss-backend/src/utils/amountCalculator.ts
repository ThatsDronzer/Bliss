/**
 * Calculate payment amounts with commission structure
 * 
 * Commission Structure:
 * - Platform fee: 6% of total
 * - Vendor amount: 94% of total
 * - Advance amount: 15% of vendor amount (paid upfront)
 * - Remaining amount: 85% of vendor amount (paid after service)
 */
export interface AmountBreakdown {
  total: number; // Total paid by user (in rupees)
  totalInPaise: number; // Total paid by user (in paise for Razorpay)
  platformFee: number; // 6% commission (in rupees)
  vendorAmount: number; // 94% of total (vendor's share in rupees)
  advanceAmount: number; // 15% of vendorAmount (advance in rupees)
  remainingAmount: number; // 85% of vendorAmount (after service in rupees)
}

export function calculateAmounts(totalPrice: number): AmountBreakdown {
  const platformFeePercentage = 6; // 6% platform commission
  const advancePercentage = 15; // 15% advance to vendor

  // Calculate platform commission (6%)
  const platformFee = (totalPrice * platformFeePercentage) / 100;

  // Calculate vendor's total share (94%)
  const vendorAmount = totalPrice - platformFee;

  // Calculate advance payment to vendor (15% of vendor's share)
  const advanceAmount = (vendorAmount * advancePercentage) / 100;

  // Calculate remaining payment to vendor (85% of vendor's share)
  const remainingAmount = vendorAmount - advanceAmount;

  return {
    total: totalPrice, // Keep as rupees for display
    totalInPaise: Math.round(totalPrice * 100), // Convert to paise for Razorpay
    platformFee: platformFee,
    vendorAmount: vendorAmount,
    advanceAmount: advanceAmount,
    remainingAmount: remainingAmount,
  };
}

