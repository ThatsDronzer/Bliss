# Requirements Document

## Introduction

This document outlines the requirements for refactoring the bliss-backend architecture to follow proper layered architecture principles. The current implementation has controllers calling services which then call repositories, but services should be reserved exclusively for external integrations (AWS, email, payment gateways, etc.). Controllers should call repositories directly for data operations, and routes should follow a standardized pattern with consistent error handling.

## Glossary

- **Controller**: The layer that handles HTTP request/response logic, validates input, calls repositories for data operations, and formats responses
- **Repository**: The data access layer that interacts with the database and handles all CRUD operations
- **Service**: A layer reserved exclusively for external service integrations (AWS S3, email providers, payment gateways, SMS services, etc.)
- **Route**: The Express router configuration that maps HTTP endpoints to controller functions
- **Error Handler**: Centralized middleware that catches and formats errors consistently across the application
- **BadRequestError**: Custom error class for 400-level client errors
- **DBConnectionError**: Custom error class for database connection failures
- **NotFoundError**: Custom error class for 404 resource not found errors

## Requirements

### Requirement 1

**User Story:** As a backend developer, I want controllers to call repositories directly for data operations, so that the architecture follows proper separation of concerns

#### Acceptance Criteria

1. WHEN a controller needs to perform a data operation, THE Controller SHALL call the repository directly
2. THE Controller SHALL NOT call service classes for database operations
3. THE Controller SHALL handle business logic and validation before calling repositories
4. THE Controller SHALL format repository responses appropriately for HTTP responses
5. THE Controller SHALL catch and handle errors from repository calls using proper error classes

### Requirement 2

**User Story:** As a backend developer, I want services to be used only for external integrations, so that the codebase has clear boundaries between data access and external service calls

#### Acceptance Criteria

1. THE Service Layer SHALL be used exclusively for external service integrations
2. WHERE external services include AWS S3, email providers, payment gateways, or SMS services, THE Service Layer SHALL handle those integrations
3. THE Service Layer SHALL NOT contain database access logic
4. THE Service Layer SHALL NOT be called by controllers for data operations
5. THE Service Layer SHALL provide clear interfaces for external service operations

### Requirement 3

**User Story:** As a backend developer, I want routes to follow a consistent pattern with proper error handling, so that all endpoints behave predictably

#### Acceptance Criteria

1. THE Route Handler SHALL use async/await for asynchronous operations
2. THE Route Handler SHALL wrap operations in try-catch blocks
3. WHEN an error occurs, THE Route Handler SHALL check if the error is an instance of known error classes
4. IF the error is a BadRequestError or DBConnectionError, THEN THE Route Handler SHALL return the error using getErrorApiResponse
5. THE Route Handler SHALL log unexpected errors with error message, stack trace, and context data
6. THE Route Handler SHALL return success responses using getSuccessApiResponse with message and data
7. THE Route Handler SHALL validate required parameters before processing requests

### Requirement 4

**User Story:** As a backend developer, I want to remove unnecessary service layer files that only pass through to repositories, so that the codebase is simpler and more maintainable

#### Acceptance Criteria

1. WHERE a service class only calls repository functions without adding external service logic, THE System SHALL remove that service class
2. THE System SHALL update all controller imports to reference repositories instead of removed services
3. THE System SHALL preserve service classes that handle external integrations
4. THE System SHALL maintain service interfaces for external service integrations
5. THE System SHALL update dependency injection configuration to reflect the new architecture

### Requirement 5

**User Story:** As a backend developer, I want consistent error handling across all routes, so that API consumers receive predictable error responses

#### Acceptance Criteria

1. THE Route Handler SHALL use the error middleware for centralized error handling
2. THE Route Handler SHALL throw custom error classes (BadRequestError, NotFoundError, DBConnectionError) for known error conditions
3. THE Route Handler SHALL pass errors to the next() middleware function
4. THE Error Middleware SHALL format all errors consistently with status codes and messages
5. THE Error Middleware SHALL log errors with appropriate context for debugging

### Requirement 6

**User Story:** As a backend developer, I want repositories to handle all database operations, so that data access logic is centralized

#### Acceptance Criteria

1. THE Repository SHALL contain all database query logic
2. THE Repository SHALL use the dbConnect utility to establish database connections
3. THE Repository SHALL throw DBConnectionError when database operations fail
4. THE Repository SHALL return structured data objects with success status and data
5. THE Repository SHALL handle Mongoose model operations and populate relationships as needed

### Requirement 7

**User Story:** As a backend developer, I want to maintain backward compatibility during the refactor, so that existing functionality continues to work

#### Acceptance Criteria

1. THE Refactored Code SHALL maintain the same API endpoints and request/response formats
2. THE Refactored Code SHALL preserve all existing business logic
3. THE Refactored Code SHALL maintain the same authentication and authorization checks
4. THE Refactored Code SHALL keep the same error response structures
5. THE Refactored Code SHALL not break existing frontend integrations
