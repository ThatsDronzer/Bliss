# Bliss Codebase Documentation

This document outlines the base structure, patterns, rules, and conventions followed in the Bliss codebase.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Architecture Patterns](#architecture-patterns)
4. [Naming Conventions](#naming-conventions)
5. [File Organization](#file-organization)
6. [Authentication & Authorization](#authentication--authorization)
7. [Database Patterns](#database-patterns)
8. [API Route Patterns](#api-route-patterns)
9. [Component Patterns](#component-patterns)
10. [Styling Conventions](#styling-conventions)
11. [TypeScript Patterns](#typescript-patterns)
12. [Code Quality Rules](#code-quality-rules)

---

## Tech Stack

### Core Framework
- **Next.js**: `15.2.4` (App Router)
- **React**: `19.x`
- **TypeScript**: `5.9.3` (Strict mode enabled)
- **Node.js**: ESM modules (`"type": "module"`)

### Authentication
- **Clerk**: `@clerk/nextjs` v6.25.0
- Role-based access control (user, vendor, admin)
- OAuth integration (Google)

### Database
- **MongoDB Atlas**: Cloud-hosted database
- **Mongoose**: `8.16.1` - ODM for MongoDB
- Connection pooling and caching

### Styling & UI
- **Tailwind CSS**: `3.4.17`
- **shadcn/ui**: Component library built on Radix UI
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **next-themes**: Dark mode support

### Payment & Services
- **Razorpay**: Payment gateway integration
- **Cloudinary**: Image upload and management
- **Twilio**: SMS/Communication services

### State Management
- **Zustand**: Client-side state management
- **React Hook Form**: Form state management
- **Zod**: Schema validation

---

## Project Structure

### Current Structure (Monolithic - to be migrated)

**Note**: The codebase currently has frontend and backend merged. See `MIGRATION_GUIDE.md` for separation strategy.

```
Bliss/ (Frontend + Backend merged)
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Auth routes group
│   ├── api/                 # API route handlers (BACKEND - to be separated)
│   ├── dashboard/           # User dashboard
│   ├── vendor-dashboard/    # Vendor dashboard
│   ├── admin-dashboard/     # Admin dashboard
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components (FRONTEND)
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard-specific components
│   ├── vendor/              # Vendor-specific components
│   └── admin-dashboard/     # Admin-specific components
├── hooks/                   # Custom React hooks (FRONTEND)
├── lib/                     # Utility functions & configs
│   ├── config/              # Configuration files
│   ├── types/               # TypeScript type definitions
│   └── stores/              # Zustand stores (FRONTEND)
├── model/                   # Mongoose schema models (BACKEND - to be moved)
├── middleware.ts            # Next.js middleware
├── public/                  # Static assets (FRONTEND)
└── styles/                  # Global styles (FRONTEND)
```

### Recommended Structure (Separated)

```
Bliss-Frontend/ (Next.js)
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Auth routes group
│   ├── dashboard/           # User dashboard
│   ├── vendor-dashboard/    # Vendor dashboard
│   ├── admin-dashboard/     # Admin dashboard
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard-specific components
│   ├── vendor/              # Vendor-specific components
│   └── admin-dashboard/     # Admin-specific components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions & configs
│   ├── api/                 # API client and service functions
│   │   ├── client.ts        # API client utility
│   │   ├── user.api.ts      # User API calls
│   │   ├── vendor.api.ts    # Vendor API calls
│   │   └── ...
│   ├── types/               # TypeScript type definitions
│   └── stores/              # Zustand stores
├── public/                  # Static assets
└── styles/                  # Global styles

Bliss-Backend/ (Express/Fastify/NestJS)
├── src/
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   │   └── dbConnect.ts    # Database connection
│   ├── config/              # Configuration
│   └── app.ts               # Express app setup
├── package.json
└── .env
```

---

## Architecture Patterns

### Architecture Decision: Frontend/Backend Separation

**Current State**: Monolithic Next.js application with API routes in `/app/api`

**Recommended**: Separate into two independent services
- **Frontend**: Next.js 15 (UI, components, pages)
- **Backend**: Node.js API (Express/Fastify/NestJS)

**Benefits**: Independent deployment, scaling, team separation, technology flexibility

**Migration**: See `MIGRATION_GUIDE.md` for complete migration strategy.

**Note**: Until migration is complete, current patterns below apply to the monolithic structure.

### 1. App Router (Next.js 15)
- **Server Components by Default**: All pages start as Server Components unless marked with `"use client"`
- **Route Groups**: Use parentheses `(auth)` for organizing routes without affecting URLs
- **Dynamic Routes**: Use brackets `[id]` for dynamic segments
- **Layouts**: Nested layouts for shared UI across route groups
- **Loading States**: `loading.tsx` files for loading UI
- **Error Boundaries**: `error.tsx` files for error handling

### 1a. API Architecture (After Separation)

**Frontend**: 
- Uses API client utility (`lib/api/client.ts`) to communicate with backend
- All API calls go through service functions (`lib/api/*.api.ts`)
- No direct `fetch('/api/...')` calls in components

**Backend**:
- RESTful API endpoints
- Controller → Service → Model pattern
- Middleware for authentication, validation, error handling

### 2. Server vs Client Components
- **Server Components** (default):
  - Data fetching
  - Database queries
  - API route handlers
  - Secure operations (API keys, tokens)
  
- **Client Components** (explicit `"use client"`):
  - Interactive components (hooks, event handlers)
  - Browser APIs (localStorage, window)
  - State management (useState, useEffect)
  - Real-time updates

### 3. API Routes
- Location: `/app/api/[route]/route.ts`
- HTTP methods exported: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- Always return `NextResponse` from `next/server`
- Use async/await for database operations

---

## Naming Conventions

### Files & Directories

#### Routes (App Router)
- **Pages**: `page.tsx` (lowercase)
- **Layouts**: `layout.tsx` (lowercase)
- **Loading**: `loading.tsx` (lowercase)
- **Error**: `error.tsx` (lowercase)
- **Dynamic routes**: `[id]` or `[slug]`
- **Route groups**: `(group-name)`
- **Catch-all**: `[[...rest]]`

#### Components
- **File names**: PascalCase (e.g., `UserProfile.tsx`)
- **Component names**: PascalCase matching file name
- **Default export**: Preferred for single component files
- **Named exports**: For utility components or hooks

#### API Routes
- **File names**: `route.ts` (always lowercase)
- **Directories**: kebab-case (e.g., `user-create/route.ts`)
- **Dynamic segments**: `[id]/route.ts`

#### Utilities & Models
- **File names**: camelCase or kebab-case
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with `I` prefix for interfaces (optional)

### Code Naming

```typescript
// Variables & Functions: camelCase
const userName = "John";
function getUserData() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = "https://api.example.com";

// Types/Interfaces: PascalCase
interface UserProfile {}
type ApiResponse = {};

// Components: PascalCase
export default function UserProfile() {}

// Hooks: camelCase with "use" prefix
export function useRoleAuth() {}

// Models: PascalCase (matches Mongoose convention)
export interface IUser extends Document {}
const User = model<IUser>('User', userSchema);
```

---

## File Organization

### Component Organization

```
components/
├── ui/                    # shadcn/ui base components (reusable)
├── [feature]/            # Feature-specific components
│   ├── [ComponentName].tsx
│   └── [sub-component].tsx
└── [ComponentName].tsx   # Shared components
```

**Rules:**
- One component per file (when possible)
- Co-locate related components in feature folders
- UI components in `ui/` folder are shared/shimmable components
- Feature components grouped by domain (dashboard, vendor, etc.)

### Hook Organization

```
hooks/
├── use-[feature].ts      # Feature-specific hooks
└── use-[utility].ts      # Utility hooks
```

**Rules:**
- Always prefixed with `use`
- One hook per file
- Export custom hooks for reuse

### Model Organization

```
model/
├── [ModelName].ts        # Singular, PascalCase
```

**Rules:**
- One model per file
- File name matches model name (singular)
- Export both interface and model
- Use Mongoose Document interface

---

## Authentication & Authorization

### Authentication Provider
- **Clerk** is the primary authentication provider
- Wraps entire app in `ClerkProvider` in root layout
- Uses Clerk middleware for route protection

### Role-Based Access Control (RBAC)

#### Roles
1. **user**: Regular end-user
2. **vendor**: Service provider
3. **admin**: Platform administrator

#### Role Storage
- Stored in Clerk `unsafeMetadata.role`
- Synced with MongoDB User/Vendor models via `clerkId`

#### Access Control Patterns

**1. Layout-Level Protection**
```typescript
// app/dashboard/layout.tsx
"use client"
import { useRoleAuth } from "@/hooks/use-role-auth"

export default function DashboardLayout({ children }) {
  const { isAuthorized, isLoading } = useRoleAuth("user");
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthorized) return null; // Will redirect
  
  return <div>{children}</div>
}
```

**2. Page-Level Protection**
```typescript
"use client"
export default function ProtectedPage() {
  const { isAuthorized, isLoading, userRole } = useRoleAuth("admin");
  
  if (!isAuthorized) return null;
  // Page content
}
```

**3. API Route Protection**
```typescript
// app/api/protected/route.ts
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Protected logic
}
```

### Role-Based Redirects
- **user** → `/dashboard`
- **vendor** → `/vendor-dashboard`
- **admin** → `/admin-dashboard`
- Unauthenticated → `/sign-in` or `/sign-up`

### Custom Hook: `useRoleAuth`
- Location: `hooks/use-role-auth.ts`
- Checks authentication status and role
- Handles redirects automatically
- Returns: `{ isAuthorized, isLoading, userRole, user, isSignedIn }`

---

## Database Patterns

### Connection Management

#### Primary Connection: `lib/dbConnect.ts`
- Uses global connection caching (prevent multiple connections in development)
- Singleton pattern with connection pooling
- Checks existing connection before creating new one

```typescript
// Usage in API routes
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  await dbConnect();
  // Database operations
}
```

#### Alternative Connection: `lib/config/db.ts`
- Similar pattern with state management
- Used in some routes

**Rule**: Use one connection method consistently per route.

### Model Patterns

#### Schema Definition
```typescript
import mongoose, { Schema, Document, model } from 'mongoose';

// 1. Define Interface
export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  // ... other fields
}

// 2. Define Schema
const userSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  // ... field definitions
}, { timestamps: true });

// 3. Export Model (check for existing model to prevent re-compilation)
const User = mongoose.models?.User || model<IUser>('User', userSchema);
export default User;
```

#### Model Rules
- Always extend `Document` from mongoose
- Use TypeScript interfaces for type safety
- Include `timestamps: true` for createdAt/updatedAt
- Use `mongoose.models?.ModelName` pattern to prevent model recompilation
- Field validation at schema level (required, unique, etc.)

### Database Query Patterns

#### Common Patterns
```typescript
// Find one
const user = await User.findOne({ clerkId: userId });

// Find by ID with validation
import { isValidObjectId } from "mongoose";
if (!isValidObjectId(id)) {
  return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
}
const item = await Model.findById(id);

// Create
const newItem = new Model(data);
await newItem.save();

// Update
await Model.findByIdAndUpdate(id, data, { new: true });

// Delete
await Model.findByIdAndDelete(id);
```

#### Error Handling
- Always wrap database operations in try-catch
- Return appropriate HTTP status codes
- Log errors for debugging
- Never expose internal error details to client

---

## API Route Patterns

### Current Structure (Monolithic - Next.js API Routes)

**Note**: These patterns apply to the current merged codebase. After separation, backend will follow different patterns (see MIGRATION_GUIDE.md).

### File Structure
```
app/api/                    # NEXT.JS API ROUTES (to be migrated)
├── [resource]/
│   ├── route.ts           # GET, POST handlers
│   └── [id]/
│       └── route.ts        # GET, PUT, DELETE handlers
└── [action]/
    └── route.ts            # Specific action endpoints
```

### Future Structure (After Separation)

**Backend Routes**:
```
src/routes/
├── user.routes.ts          # User endpoints
├── vendor.routes.ts        # Vendor endpoints
├── listing.routes.ts       # Listing endpoints
└── ...

src/controllers/
├── user.controller.ts      # User request handlers
├── vendor.controller.ts    # Vendor request handlers
└── ...

src/services/
├── user.service.ts         # User business logic
├── vendor.service.ts      # Vendor business logic
└── ...
```

### Handler Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Model from '@/model/model';

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication (if required)
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Database connection
    await dbConnect();

    // 3. Input validation
    const { searchParams } = new URL(req.url);
    const param = searchParams.get('param');

    // 4. Business logic
    const data = await Model.find({});

    // 5. Response
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Database connection
    await dbConnect();

    // 3. Parse and validate request body
    const body = await req.json();
    const { field1, field2 } = body;

    if (!field1 || !field2) {
      return NextResponse.json(
        { error: 'Missing required fields', missingFields: ['field1', 'field2'] },
        { status: 400 }
      );
    }

    // 4. Business logic
    const newItem = new Model({ field1, field2, userId });
    await newItem.save();

    // 5. Response
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
```

### Dynamic Route Parameters

```typescript
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Next.js 15 requires awaiting params
  // Use id
}
```

### API Route Rules

1. **Always authenticate** if route requires user context
2. **Always connect to database** before operations
3. **Validate input** (IDs, required fields, data types)
4. **Handle errors** with try-catch and appropriate status codes
5. **Return consistent response format**
6. **Use proper HTTP methods** (GET, POST, PUT, DELETE)
7. **Set appropriate status codes** (200, 201, 400, 401, 404, 500)
8. **Never expose sensitive data** in error messages

### Response Format Standards

```typescript
// Success
NextResponse.json({ success: true, data: [...] }, { status: 200 });

// Error
NextResponse.json({ error: 'Error message' }, { status: 400 });

// With validation errors
NextResponse.json({ 
  error: 'Validation failed', 
  missingFields: ['field1', 'field2'] 
}, { status: 400 });
```

---

## Component Patterns

### Server Components (Default)

```typescript
// app/page.tsx (Server Component)
import { getData } from '@/lib/data';

export default async function HomePage() {
  const data = await getData(); // Can use async/await directly
  
  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
}
```

### Client Components

```typescript
// components/InteractiveComponent.tsx
"use client"

import { useState } from 'react';

export default function InteractiveComponent() {
  const [state, setState] = useState('');
  
  return (
    <div>
      {/* Interactive JSX */}
    </div>
  );
}
```

### Component Composition

```typescript
// Parent component imports child components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function FeatureComponent() {
  return (
    <Card>
      <Button>Action</Button>
    </Card>
  );
}
```

### Component Rules

1. **Default export** for main component
2. **Named exports** for sub-components or utilities
3. **"use client"** directive only when necessary
4. **Type props** with TypeScript interfaces
5. **Co-locate** related components in feature folders
6. **Reuse** shadcn/ui components from `components/ui/`

---

## Styling Conventions

### Tailwind CSS

#### Configuration
- Location: `tailwind.config.js`
- Uses CSS variables for theming
- Custom colors: `primary` (pink-500), `secondary` (purple-500)
- Dark mode: Class-based (`darkMode: ["class"]`)

#### Utility Classes
- Use Tailwind utilities for styling
- Prefer utility classes over custom CSS
- Use `cn()` utility from `@/lib/utils` for conditional classes

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  "additional-classes"
)}>
```

#### Responsive Design
- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Always consider mobile layout first

### shadcn/ui Components

#### Component Location
- Base components: `components/ui/`
- Install via: `npx shadcn-ui@latest add [component]`

#### Styling
- Components use Tailwind for styling
- Can be customized via CSS variables in `globals.css`
- Follow shadcn/ui patterns for component composition

### Color Scheme

```typescript
// Primary: Pink (#EC4899)
className="bg-pink-600 hover:bg-pink-700 text-white"

// Secondary: Purple (#A855F7)
className="bg-purple-600 hover:bg-purple-700"

// Semantic colors via CSS variables
className="bg-primary text-primary-foreground"
```

---

## TypeScript Patterns

### Configuration

#### tsconfig.json Rules
- **Strict mode**: Enabled
- **Module**: ESNext
- **Module resolution**: Bundler
- **Path aliases**: `@/*` maps to root directory
- **JSX**: Preserve (React 19)

### Type Definitions

#### Interfaces vs Types
```typescript
// Use interfaces for object shapes
export interface User {
  id: string;
  name: string;
}

// Use types for unions, intersections, primitives
export type UserRole = 'user' | 'vendor' | 'admin';
export type ApiResponse<T> = { data: T } | { error: string };
```

#### Model Types
```typescript
// Mongoose Document interface
export interface IUser extends Document {
  clerkId: string;
  name: string;
  // ...
}
```

#### API Response Types
```typescript
// Define response types for API routes
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Type Safety Rules

1. **Always type function parameters and return values**
2. **Use interfaces for complex objects**
3. **Avoid `any` type** (use `unknown` if type is truly unknown)
4. **Type API responses** to catch errors early
5. **Use Zod** for runtime validation when needed

---

## Code Quality Rules

### General Principles

1. **Error Handling**
   - Always use try-catch for async operations
   - Log errors appropriately
   - Return user-friendly error messages
   - Never expose internal error details

2. **Code Organization**
   - One component per file (when possible)
   - Group related code together
   - Separate concerns (data fetching, UI, business logic)

3. **Performance**
   - Use Server Components for data fetching
   - Implement loading states
   - Optimize images with Next.js Image component
   - Use dynamic imports for large components

4. **Security**
   - Always authenticate protected routes
   - Validate user input
   - Sanitize data before database operations
   - Never commit secrets to version control

5. **Accessibility**
   - Use semantic HTML
   - Add ARIA labels when needed
   - Ensure keyboard navigation works
   - Test with screen readers

### Import Organization

```typescript
// 1. React/Next.js imports
import React from 'react';
import { NextResponse } from 'next/server';

// 2. Third-party libraries
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// 3. Internal utilities
import dbConnect from '@/lib/dbConnect';
import { cn } from '@/lib/utils';

// 4. Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 5. Types
import type { User } from '@/lib/types';
```

### Comments & Documentation

- **Use comments** for complex logic
- **Document function parameters** and return types
- **Add JSDoc comments** for public APIs
- **Explain "why" not "what"** in comments

### Git & Version Control

- **Meaningful commit messages**
- **Don't commit**: `.env.local`, `node_modules`, `.next`
- **Use feature branches** for new features
- **Keep commits atomic** (one logical change per commit)

---

## Environment Variables

### Required Variables

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

### Rules
- Never commit `.env.local` to version control
- Use `NEXT_PUBLIC_` prefix for client-accessible variables
- Validate environment variables on application startup
- Document required variables in README

---

## Middleware

### Location: `middleware.ts`

#### Current Implementation
- Uses Clerk middleware for authentication
- Mobile device detection for homepage redirect
- Matches all routes except Next.js internals

#### Pattern
```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  // Custom logic
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

---

## Testing & Development

### Development Scripts

```json
{
  "dev": "next dev",           // Start development server
  "build": "next build",        // Production build
  "start": "next start",        // Start production server
  "lint": "next lint"           // Run ESLint
}
```

### Development Rules

1. **Run linting** before committing
2. **Test on mobile** (responsive design)
3. **Test all user roles** (user, vendor, admin)
4. **Verify database operations** work correctly
5. **Check error handling** for edge cases

---

## Common Patterns & Examples

### Data Fetching Pattern

#### Current Pattern (Monolithic)
```typescript
// Server Component - Direct DB access (will change after separation)
export default async function Page() {
  await dbConnect();
  const data = await Model.find({});
  return <Component data={data} />;
}

// Client Component with API
"use client"
export default function Component() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/data')  // Current: Next.js API route
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return <div>{/* render data */}</div>;
}
```

#### Future Pattern (After Separation)
```typescript
// Server Component - Calls backend API (or use Client Component)
"use client"
import { dataApi } from '@/lib/api/data.api';

export default function Component() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    dataApi.getData()  // Uses API client to call backend
      .then(setData)
      .catch(console.error);
  }, []);
  
  return <div>{/* render data */}</div>;
}

// Or use Server Component with fetch (Server-side API call)
export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data`);
  const data = await res.json();
  return <Component data={data} />;
}
```

### Form Handling Pattern

#### Current Pattern (Monolithic)
```typescript
"use client"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

export default function FormComponent() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const res = await fetch('/api/submit', {  // Current: Next.js API route
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle response
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>;
}
```

#### Future Pattern (After Separation)
```typescript
"use client"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formApi } from '@/lib/api/form.api';  // Use API service

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

export default function FormComponent() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await formApi.submit(data);  // Uses API client
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>;
}
```

---

## Summary Checklist

When adding new code, ensure:

- ✅ Follows naming conventions (files, functions, variables)
- ✅ Uses correct component type (Server vs Client)
- ✅ Implements proper error handling
- ✅ Includes authentication/authorization if needed
- ✅ Connects to database properly
- ✅ Uses TypeScript types correctly
- ✅ Follows Tailwind CSS conventions
- ✅ Is responsive (mobile-first)
- ✅ Handles loading and error states
- ✅ Doesn't expose sensitive data
- ✅ Validates user input
- ✅ Uses consistent response formats in API routes

---

## Architecture Migration

### Current Architecture: Monolithic
- Frontend and backend are merged in a single Next.js application
- API routes are in `/app/api`
- Database models in `/model`
- Everything deployed as one service

### Recommended Architecture: Separated
- **Frontend**: Next.js 15 (UI only)
- **Backend**: Node.js API (Express/Fastify/NestJS)
- Independent deployment and scaling
- Clear separation of concerns

### Migration Guide
See `MIGRATION_GUIDE.md` for:
- Step-by-step migration process
- Backend setup instructions
- Frontend API client patterns
- Deployment strategies
- Complete checklist

**Important**: Follow the migration guide when separating services to maintain code quality and patterns.

---

## Additional Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Fastify Documentation](https://www.fastify.io/)
- [NestJS Documentation](https://docs.nestjs.com/)

---

**Last Updated**: Generated automatically based on codebase analysis
**Maintained By**: Development Team
**Migration Status**: See MIGRATION_GUIDE.md for separation strategy

