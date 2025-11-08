/**
 * Verification script to ensure all external services are preserved and functional
 * This script checks that external service integrations remain intact after refactoring
 */
import * as fs from 'fs';
import * as path from 'path';
const verificationResults = [];
/**
 * Check if a file exists and contains expected function exports
 */
function verifyServiceFile(serviceName, filePath, expectedFunctions) {
    try {
        const fullPath = path.join(process.cwd(), 'src', filePath);
        // Check if file exists
        if (!fs.existsSync(fullPath)) {
            return {
                serviceName,
                status: 'MISSING',
                filePath,
                expectedFunctions,
                foundFunctions: [],
                error: 'File not found',
            };
        }
        // Read file content
        const content = fs.readFileSync(fullPath, 'utf-8');
        // Check for expected functions/classes
        const foundFunctions = [];
        for (const func of expectedFunctions) {
            // Check for function declarations, exports, or class definitions
            const patterns = [
                new RegExp(`export\\s+async\\s+function\\s+${func}`, 'g'),
                new RegExp(`export\\s+function\\s+${func}`, 'g'),
                new RegExp(`export\\s+class\\s+${func}`, 'g'),
                new RegExp(`function\\s+${func}`, 'g'),
                new RegExp(`class\\s+${func}`, 'g'),
            ];
            if (patterns.some(pattern => pattern.test(content))) {
                foundFunctions.push(func);
            }
        }
        // Check if all expected functions were found
        if (foundFunctions.length === expectedFunctions.length) {
            return {
                serviceName,
                status: 'OK',
                filePath,
                expectedFunctions,
                foundFunctions,
            };
        }
        else {
            const missing = expectedFunctions.filter(f => !foundFunctions.includes(f));
            return {
                serviceName,
                status: 'ERROR',
                filePath,
                expectedFunctions,
                foundFunctions,
                error: `Missing functions: ${missing.join(', ')}`,
            };
        }
    }
    catch (error) {
        return {
            serviceName,
            status: 'ERROR',
            filePath,
            expectedFunctions,
            foundFunctions: [],
            error: error.message,
        };
    }
}
/**
 * Run all verifications
 */
function runVerification() {
    console.log('='.repeat(60));
    console.log('EXTERNAL SERVICES VERIFICATION');
    console.log('='.repeat(60));
    console.log();
    // Verify AWS Service (SES Email Integration)
    verificationResults.push(verifyServiceFile('AWS Service (SES)', 'services/aws/aws.service.ts', ['sendUsersEmail', 'sendBulkEmail']));
    // Verify Email Service (Resend Integration)
    verificationResults.push(verifyServiceFile('Email Service (Resend)', 'services/email/email.service.ts', ['sendEmail']));
    // Verify Invoice Service (PDF Generation)
    verificationResults.push(verifyServiceFile('Invoice Service', 'services/invoice/invoice.ts', ['createInvoicePDF', 'sendEmailInvoice']));
    // Verify Storage/Upload Service
    verificationResults.push(verifyServiceFile('Storage/Upload Service', 'services/storage/uploadAsset.ts', ['uploadAsset']));
    // Verify Razorpay Payment Gateway Service
    verificationResults.push(verifyServiceFile('Razorpay Payment Gateway', 'services/payment/razorpay-gateway.service.ts', ['RazorpayGatewayService']));
    // Print results
    verificationResults.forEach((result) => {
        const statusSymbol = result.status === 'OK' ? '✓' : '✗';
        const statusColor = result.status === 'OK' ? '\x1b[32m' : '\x1b[31m';
        const resetColor = '\x1b[0m';
        console.log(`${statusColor}${statusSymbol}${resetColor} ${result.serviceName}`);
        console.log(`  Path: ${result.filePath}`);
        if (result.status === 'OK') {
            console.log(`  Functions: ${result.foundFunctions.join(', ')}`);
        }
        else {
            console.log(`  Error: ${result.error}`);
            if (result.foundFunctions.length > 0) {
                console.log(`  Found: ${result.foundFunctions.join(', ')}`);
            }
        }
        console.log();
    });
    // Summary
    const okCount = verificationResults.filter(r => r.status === 'OK').length;
    const totalCount = verificationResults.length;
    console.log('='.repeat(60));
    console.log(`SUMMARY: ${okCount}/${totalCount} services verified successfully`);
    console.log('='.repeat(60));
    // Exit with error code if any service failed
    if (okCount < totalCount) {
        process.exit(1);
    }
}
// Run verification
runVerification();
//# sourceMappingURL=verify-external-services.js.map