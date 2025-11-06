# Frontend/Backend Separation Migration Guide

## Overview

This guide outlines the strategy for separating the current monolithic Next.js application into two independent services:
1. **Frontend Service**: Next.js 15 (client-side rendering, UI components)
2. **Backend Service**: Node.js API (Express/Fastify/NestJS) - RESTful API

---

## Why Separate?

### Benefits
- ✅ **Independent Deployment**: Deploy frontend and backend separately
- ✅ **Independent Scaling**: Scale frontend and backend based on their respective loads
- ✅ **Technology Flexibility**: Choose different frameworks/versions independently
- ✅ **Team Separation**: Frontend and backend teams can work independently
- ✅ **Security**: API server can be behind firewall, frontend exposed to CDN
- ✅ **Cost Optimization**: Optimize resources for each service
- ✅ **Clear Separation**: Easier to maintain and test

### Current Architecture (Monolithic)
```
┌─────────────────────────────────┐
│      Next.js Application         │
│  ┌──────────┐   ┌─────────────┐  │
│  │ Frontend │──▶│ API Routes  │  │
│  │ (Pages)  │   │ (/app/api)  │  │
│  └──────────┘   └─────────────┘  │
│         │              │          │
│         └──────┬───────┘          │
│                ▼                  │
│         ┌──────────┐              │
│         │ MongoDB  │              │
│         └──────────┘              │
└─────────────────────────────────┘
```

### Target Architecture (Separated)
```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │────────▶│    Backend      │
│   (Next.js)     │  HTTP   │   (Express/     │
│                 │  REST   │   Fastify/      │
│  - Pages        │◀────────│   NestJS)       │
│  - Components   │         │                 │
│  - UI/UX        │         │  - API Routes   │
│  - Static Assets│         │  - Business     │
│                 │         │    Logic        │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                              ┌──────────┐
                              │ MongoDB  │
                              └──────────┘
```

---

## Migration Strategy

### Phase 1: Backend API Setup

#### Step 1: Create Backend Project Structure

```
bliss-backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── user.controller.ts
│   │   ├── vendor.controller.ts
│   │   ├── listing.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── payment.controller.ts
│   │   └── review.controller.ts
│   ├── services/              # Business logic
│   │   ├── user.service.ts
│   │   ├── vendor.service.ts
│   │   └── ...
│   ├── models/                # Mongoose models (moved from /model)
│   │   ├── user.ts
│   │   ├── vendor.ts
│   │   ├── listing.ts
│   │   ├── booking.ts
│   │   └── ...
│   ├── routes/                 # API routes
│   │   ├── user.routes.ts
│   │   ├── vendor.routes.ts
│   │   ├── listing.routes.ts
│   │   └── ...
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/                 # Utility functions
│   │   ├── dbConnect.ts       # Database connection
│   │   └── ...
│   ├── config/                # Configuration
│   │   ├── db.ts
│   │   └── env.ts
│   └── app.ts                 # Express app setup
├── package.json
├── tsconfig.json
└── .env
```

#### Step 2: Choose Backend Framework

**Option A: Express.js** (Recommended for simplicity)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.16.1",
    "cors": "^2.8.5",
    "dotenv": "^17.0.0",
    "@clerk/clerk-sdk-node": "^4.13.23"
  }
}
```

**Option B: Fastify** (Better performance)
```json
{
  "dependencies": {
    "fastify": "^4.24.3",
    "@fastify/cors": "^8.5.0",
    "mongoose": "^8.16.1"
  }
}
```

**Option C: NestJS** (Enterprise-ready, full framework)
```json
{
  "dependencies": {
    "@nestjs/common": "^10.2.0",
    "@nestjs/core": "^10.2.0",
    "@nestjs/mongoose": "^10.0.0"
  }
}
```

#### Step 3: Migrate API Routes

**Current (Next.js API Route):**
```typescript
// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/model/user';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const user = await User.findOne({ clerkId: params.id });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

**New (Express Route):**
```typescript
// src/routes/user.routes.ts
import express from 'express';
import { getUserById } from '../controllers/user.controller';

const router = express.Router();
router.get('/:id', getUserById);
export default router;

// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import dbConnect from '../utils/dbConnect';
import User from '../models/user';

export async function getUserById(req: Request, res: Response) {
  try {
    await dbConnect();
    const user = await User.findOne({ clerkId: req.params.id });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
}
```

#### Step 4: Set Up Environment Variables

```env
# Backend .env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:3000  # Frontend URL
```

### Phase 2: Frontend Migration

#### Step 1: Create API Client Utility

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

#### Step 2: Create API Service Functions

```typescript
// lib/api/user.api.ts
import { apiClient } from './client';

export const userApi = {
  getUser: (id: string) => apiClient.get(`/user/${id}`),
  updateUser: (id: string, data: any) => apiClient.put(`/user/${id}`, data),
  createUser: (data: any) => apiClient.post('/user/create', data),
};

// lib/api/vendor.api.ts
export const vendorApi = {
  getVendor: (id: string) => apiClient.get(`/vendor/${id}`),
  searchVendors: (params: { service?: string; location?: string }) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/vendors/search?${queryString}`);
  },
};

// lib/api/listing.api.ts
export const listingApi = {
  getListing: (id: string) => apiClient.get(`/listing/${id}`),
  createListing: (data: any) => apiClient.post('/listing', data),
  updateListing: (id: string, data: any) => apiClient.put(`/listing/${id}`, data),
  deleteListing: (id: string) => apiClient.delete(`/listing/${id}`),
};
```

#### Step 3: Update Frontend Components

**Before:**
```typescript
// app/vendors/[id]/page.tsx
const response = await fetch(`/api/vendors/${params.id}`);
const data = await response.json();
```

**After:**
```typescript
// app/vendors/[id]/page.tsx
import { vendorApi } from '@/lib/api/vendor.api';

const data = await vendorApi.getVendor(params.id);
```

#### Step 4: Remove Next.js API Routes

1. Delete `/app/api` directory (or keep only Next.js-specific routes like image optimization)
2. Update all fetch calls to use API client
3. Update environment variables

#### Step 5: Environment Variables Update

```env
# Frontend .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
# or for development:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# Remove backend-specific keys (MongoDB_URI, etc.)
```

### Phase 3: Authentication Handling

#### Backend: Clerk Middleware

```typescript
// src/middleware/auth.middleware.ts
import { clerkClient } from '@clerk/clerk-sdk-node';
import { Request, Response, NextFunction } from 'express';

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await clerkClient.verifyToken(token);
    req.user = user; // Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Usage in routes
router.get('/protected', authenticateUser, getProtectedData);
```

#### Frontend: Clerk Token Passing

```typescript
// lib/api/client.ts (update)
async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Get Clerk token
  const { useAuth } = await import('@clerk/nextjs');
  const { getToken } = useAuth();
  const token = await getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // ... rest of the code
}
```

---

## Migration Checklist

### Backend Tasks
- [ ] Create new backend project structure
- [ ] Install backend framework (Express/Fastify/NestJS)
- [ ] Migrate Mongoose models to `/src/models`
- [ ] Migrate database connection logic to `/src/utils/dbConnect.ts`
- [ ] Create controllers for each API endpoint
- [ ] Create routes that map to current API structure
- [ ] Implement authentication middleware (Clerk)
- [ ] Set up CORS for frontend domain
- [ ] Migrate webhook handlers (Clerk, Razorpay)
- [ ] Set up error handling middleware
- [ ] Add request validation (Zod/Joi)
- [ ] Set up logging
- [ ] Write API documentation (Swagger/OpenAPI)
- [ ] Set up CI/CD for backend

### Frontend Tasks
- [ ] Create API client utility (`lib/api/client.ts`)
- [ ] Create API service functions for each resource
- [ ] Update all `fetch('/api/...')` calls to use API client
- [ ] Remove `/app/api` directory (or keep minimal Next.js routes)
- [ ] Update environment variables
- [ ] Update authentication token handling
- [ ] Add API error handling in components
- [ ] Update loading states for API calls
- [ ] Test all API integrations
- [ ] Set up CI/CD for frontend

### Infrastructure Tasks
- [ ] Set up backend deployment (Railway, Render, AWS, etc.)
- [ ] Set up frontend deployment (Vercel, Netlify, etc.)
- [ ] Configure CORS on backend for production
- [ ] Set up environment variables in deployment platforms
- [ ] Configure domain names (api.yourdomain.com, yourdomain.com)
- [ ] Set up SSL certificates
- [ ] Configure monitoring and logging
- [ ] Set up database connection pooling for backend

---

## API Endpoint Mapping

### Current Next.js Routes → New Backend Routes

| Current Route | New Backend Route | Method |
|--------------|------------------|--------|
| `/api/user/[id]` | `/api/user/:id` | GET, PUT |
| `/api/user/create` | `/api/user/create` | POST |
| `/api/vendor/[id]` | `/api/vendor/:id` | GET, PUT |
| `/api/vendors/[id]` | `/api/vendors/:id` | GET |
| `/api/listing` | `/api/listing` | GET, POST |
| `/api/listing/[id]` | `/api/listing/:id` | GET, PUT, DELETE |
| `/api/search-vendors` | `/api/vendors/search` | GET |
| `/api/review` | `/api/review` | POST, DELETE |
| `/api/reviews` | `/api/reviews` | GET |
| `/api/payments/create` | `/api/payments/create` | POST |
| `/api/payments/verify` | `/api/payments/verify` | POST |
| `/api/message-create` | `/api/messages` | POST |
| `/api/booking-status` | `/api/bookings/status` | GET, PUT |
| `/api/webhooks/clerk` | `/api/webhooks/clerk` | POST |
| `/api/webhooks/razorpay` | `/api/webhooks/razorpay` | POST |

---

## Example Backend Setup (Express)

### Basic Express App Structure

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import vendorRoutes from './routes/vendor.routes';
import listingRoutes from './routes/listing.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/listing', listingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
```

### Database Connection

```typescript
// src/utils/dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

---

## Deployment Considerations

### Backend Deployment Options

1. **Railway** (Easiest)
   - Connect GitHub repo
   - Auto-deploy on push
   - Built-in environment variables

2. **Render**
   - Free tier available
   - Easy setup
   - Automatic SSL

3. **AWS EC2/ECS**
   - More control
   - Better for production scale
   - Requires more setup

4. **DigitalOcean App Platform**
   - Simple deployment
   - Good pricing
   - Auto-scaling

### Frontend Deployment

- **Vercel** (Recommended for Next.js)
  - Optimized for Next.js
  - Automatic deployments
  - Edge functions support

- **Netlify**
  - Good alternative
  - Easy setup
  - CDN included

---

## Testing Strategy

### Backend Testing
- Unit tests for services
- Integration tests for API routes
- Use Jest or Vitest
- Test authentication flows

### Frontend Testing
- Component tests
- API client tests
- E2E tests for critical flows

---

## Rollback Plan

If issues arise during migration:

1. Keep Next.js API routes as fallback
2. Use feature flags to switch between old/new API
3. Gradual migration per feature (not all at once)
4. Monitor error rates and performance

---

## Timeline Recommendation

- **Week 1-2**: Backend setup and initial route migration
- **Week 3**: Frontend API client setup
- **Week 4**: Migrate high-priority routes
- **Week 5**: Migrate remaining routes
- **Week 6**: Testing and bug fixes
- **Week 7**: Deployment and monitoring

---

## Next Steps

1. **Review this guide** with your team
2. **Choose backend framework** (Express recommended for simplicity)
3. **Set up backend project structure**
4. **Start with one route** as proof of concept
5. **Gradually migrate** routes one by one
6. **Test thoroughly** before full deployment

---

**Need Help?** Refer to the main `CLAUDE.md` for coding patterns and conventions.

