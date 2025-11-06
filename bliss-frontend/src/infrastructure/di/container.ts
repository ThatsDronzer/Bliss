import 'reflect-metadata';
import { container } from 'tsyringe';
import TYPES from './types';
import type { IUserService } from '@domain/service/userInterface';
import { UserService } from '@data/service/selectors/userServiceImpls';
import type { IVendorService } from '@domain/service/vendorInterface';
import { VendorService } from '@data/service/selectors/vendorServiceImpls';

// Service interfaces (to be created in src/domain/service)
// and implementations (to be created in src/data/service/selectors)
// We'll register concrete implementations in later todos.

export { container as diContainer, TYPES };

// Registrations
container.registerSingleton<IUserService>(TYPES.IUserService, UserService);
container.registerSingleton<IVendorService>(TYPES.IVendorService, VendorService);


