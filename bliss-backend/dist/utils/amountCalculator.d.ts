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
    total: number;
    totalInPaise: number;
    platformFee: number;
    vendorAmount: number;
    advanceAmount: number;
    remainingAmount: number;
}
export declare function calculateAmounts(totalPrice: number): AmountBreakdown;
//# sourceMappingURL=amountCalculator.d.ts.map