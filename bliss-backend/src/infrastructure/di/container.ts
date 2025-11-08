import TYPES from '../types.js';
import 'reflect-metadata';
import { container } from 'tsyringe';

// Register external service implementations
// Only services for external integrations (AWS, Email, Payment gateways, etc.) are registered
// Controllers call repositories directly for data operations

// Note: Service registrations can be added here as needed for external integrations
// Example:
// container.register(TYPES.IAwsService, { useClass: AwsService });
// container.register(TYPES.IEmailService, { useClass: EmailService });

export { container as diContainer };
export { TYPES };

