/**
 * Backward Compatibility Validation Script
 *
 * This script validates that the refactored architecture maintains backward compatibility
 * by testing:
 * 1. API endpoints maintain same request/response format
 * 2. Authentication and authorization still work
 * 3. Error responses match expected format
 * 4. No breaking changes for frontend
 */
declare class BackwardCompatibilityValidator {
    private results;
    private baseUrl;
    private testToken?;
    private adminToken?;
    private vendorToken?;
    constructor(baseUrl?: string);
    /**
     * Run all validation tests
     */
    validate(): Promise<void>;
    /**
     * Test 1: Validate response formats match expected structure
     */
    private validateResponseFormats;
    /**
     * Test 2: Validate authentication mechanisms
     */
    private validateAuthentication;
    /**
     * Test 3: Validate authorization (role-based access)
     */
    private validateAuthorization;
    /**
     * Test 4: Validate error response formats
     */
    private validateErrorFormats;
    /**
     * Test 5: Validate all endpoints are available
     */
    private validateEndpointAvailability;
    /**
     * Validate success response structure
     */
    private validateSuccessResponseStructure;
    /**
     * Validate error response structure
     */
    private validateErrorResponseStructure;
    /**
     * Add a validation result
     */
    private addResult;
    /**
     * Print summary of results
     */
    private printResults;
}
export { BackwardCompatibilityValidator };
//# sourceMappingURL=validate-backward-compatibility.d.ts.map