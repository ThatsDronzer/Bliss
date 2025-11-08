# Implementation Plan

- [x] 1. Refactor Admin domain
  - Update admin controller to call repository directly
  - Implement business logic and error handling in controller
  - Update admin routes with standardized error handling pattern
  - Remove admin service files (service and interface)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 2. Refactor Review domain
  - Update review controller to call repository directly
  - Implement business logic and error handling in controller
  - Update review routes with standardized error handling pattern
  - Remove review service files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 3. Refactor Search domain
  - Update search controller to call repository directly
  - Implement business logic and error handling in controller
  - Update search routes with standardized error handling pattern
  - Remove search service files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 4. Refactor Notification domain
  - Audit notification service to check for external integrations
  - Update notification controller to call repository directly
  - Implement business logic and error handling in controller
  - Update notification routes with standardized error handling pattern
  - Remove notification service files if no external integrations
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 5. Refactor Message domain
  - Update message controller to call repository directly
  - Implement business logic and error handling in controller
  - Update message routes with standardized error handling pattern
  - Remove message service files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 6. Refactor User domain
  - Update user controller to call repository directly
  - Implement business logic and error handling in controller
  - Update user routes with standardized error handling pattern
  - Remove user service files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [ ] 7. Refactor Vendor domain
  - Update vendor controller to call repository directly
  - Implement business logic and error handling in controller
  - Update vendor routes with standardized error handling pattern
  - Remove vendor service files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 8. Refactor Listing domain
  - Update listing controller to call repository directly
  - Implement business logic and error handling in controller
  - Update listing routes with standardized error handling pattern
  - Remove listing service files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 9. Refactor Booking domain
  - Update booking controller to call repository directly
  - Implement business logic and error handling in controller
  - Update booking routes with standardized error handling pattern
  - Remove booking service files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 10. Refactor Payment domain
  - Audit payment service to check for payment gateway integration
  - Update payment controller to call repository directly for data operations
  - Preserve payment gateway integration logic in service if present
  - Implement business logic and error handling in controller
  - Update payment routes with standardized error handling pattern
  - Remove payment service files only if no external integrations
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 11. Refactor Webhook domain
  - Update webhook controller to call repository directly
  - Implement business logic and error handling in controller
  - Update webhook routes with standardized error handling pattern
  - Remove webhook service files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2_

- [x] 12. Update dependency injection configuration
  - Remove service registrations for deleted services
  - Update container configuration to reflect new architecture
  - Verify all dependencies resolve correctly
  - _Requirements: 4.5_

- [x] 13. Verify external services are preserved
  - Confirm AWS service is intact and functional
  - Confirm email service is intact and functional
  - Confirm invoice service is intact and functional
  - Confirm storage/upload service is intact and functional
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 14. Update repository error handling
  - Audit all repository functions for consistent error handling
  - Ensure all database operations are wrapped in try-catch
  - Verify all errors are logged with message, stack, and data
  - Ensure all database errors throw DBConnectionError
  - Add updatedAt timestamps to all update operations
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 15. Validate backward compatibility
  - Test all API endpoints maintain same request/response format
  - Verify authentication and authorization still work
  - Test error responses match expected format
  - Confirm no breaking changes for frontend
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
