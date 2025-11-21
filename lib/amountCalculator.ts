export interface AmountBreakdown {
  total: number;           // Total paid by user (in rupees)
  totalInPaise: number;    // Total paid by user (in paise for Razorpay)
  platformFee: number;     // 6% commission (in rupees)
  vendorAmount: number;    // 94% of total (vendor's share in rupees)
  advanceAmount: number;   // 15% of vendorAmount (advance in rupees)
  remainingAmount: number; // 85% of vendorAmount (after service in rupees)
}

export const calculateAmounts = (totalPrice: number): AmountBreakdown => {
  const platformFeePercentage = 6;   // 6% platform commission
  const advancePercentage = 15;      // 15% advance to vendor
  
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
};

/**
 * Example usage and test
 */
export const testAmountCalculation = (totalPrice: number) => {
  const amounts = calculateAmounts(totalPrice);
  
  console.log(`Total Price: ₹${totalPrice}`);
  console.log(`Platform Fee (6%): ₹${amounts.platformFee}`);
  console.log(`Vendor Total Share (94%): ₹${amounts.vendorAmount}`);
  console.log(`Vendor Advance (15% of vendor share): ₹${amounts.advanceAmount}`);
  console.log(`Vendor Remaining (85% of vendor share): ₹${amounts.remainingAmount}`);
  console.log(`Verification - Sum: ₹${amounts.platformFee + amounts.vendorAmount}`);
  
  return amounts;
};