export function calculateAmounts(totalPrice) {
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
//# sourceMappingURL=amountCalculator.js.map