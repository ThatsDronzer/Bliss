# Frontend API Migration Guide

This document outlines the migration of frontend API calls from Next.js API routes to the separated backend server.

## Overview

All API calls in the frontend have been updated to point to the backend server running at:
- **Development**: `http://localhost:5000`
- **Production**: Set via `NEXT_PUBLIC_API_URL` environment variable

## API Client Architecture

### Base API Client (`lib/api/client.ts`)
- Core API client with base URL configuration
- Handles request/response formatting
- Error handling
- Does NOT automatically add auth tokens (components should handle this)

### Auth-Enabled Client Hook (`lib/api/client-with-auth.ts`)
- React hook that uses `useAuth` from Clerk
- Automatically includes Bearer token in requests
- Use this in client components that need authentication

### API Services (`lib/api/services.ts`)
- Organized service functions for each module:
  - `userApi` - User operations
  - `vendorApi` - Vendor operations
  - `listingApi` - Listing/Service operations
  - `reviewApi` - Review operations
  - `bookingApi` - Booking & messaging
  - `paymentApi` - Payment processing
  - `searchApi` - Search & discovery
  - `adminApi` - Admin operations
  - `notificationApi` - Notifications

## Updated Files

### Core API Infrastructure
- ✅ `lib/api/client.ts` - Base API client
- ✅ `lib/api/client-with-auth.ts` - Auth-enabled hook
- ✅ `lib/api/services.ts` - Service functions

### Updated Components
- ✅ `app/services/[serviceId]/page.tsx` - Service details & booking
- ✅ `components/review-form.tsx` - Review submission
- ✅ `components/vendor-search.tsx` - Vendor search
- ✅ `app/explore-services/page.tsx` - Service listing
- ✅ `hooks/useRazorpay.ts` - Payment processing

## Remaining Files to Update

The following files still need to be updated:

### Vendor Dashboard
- `app/vendor-dashboard/listings/page.tsx`
- `app/vendor-dashboard/listings/new/page.tsx`
- `app/vendor-dashboard/listings/[id]/edit/page.tsx`
- `app/vendor-dashboard/listings/[id]/view/page.tsx`
- `app/vendor-dashboard/messages/page.tsx`
- `app/vendor-dashboard/profile/page.tsx`
- `app/vendor-dashboard/verification/page.tsx`
- `components/add-images-modal.tsx`
- `components/vendor-dashboard/sidebar.tsx`

### User Dashboard
- `app/dashboard/profile/page.tsx`
- `app/dashboard/messages/page.tsx`

### Other Pages
- `app/vendors/[id]/page.tsx`

## Environment Configuration

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, set it to your backend URL:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Migration Pattern

### Before (Next.js API Route):
```typescript
const response = await fetch('/api/listing', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});
const data = await response.json();
```

### After (Backend API):
```typescript
import { listingApi } from '@/lib/api/services';

const data = await listingApi.getListings();
```

### For Authenticated Requests:
```typescript
import { useApiClient } from '@/lib/api/client-with-auth';

function MyComponent() {
  const api = useApiClient();
  
  const handleSubmit = async () => {
    const data = await api.post('/api/listing', listingData);
  };
}
```

## Common Endpoint Mappings

| Old Endpoint | New Endpoint | Service Method |
|-------------|-------------|----------------|
| `/api/user/[id]` | `/api/user/[id]` | `userApi.getUser(id)` |
| `/api/vendor/[id]` | `/api/vendor/[id]` | `vendorApi.getVendorByClerkId(id)` |
| `/api/listing` | `/api/listing` | `listingApi.getListings()` |
| `/api/review` | `/api/review` | `reviewApi.createReview(data)` |
| `/api/message-create` | `/api/message/create` | `bookingApi.createBookingMessage(data)` |
| `/api/payments/create` | `/api/payments/create` | `paymentApi.createPayment(messageId)` |
| `/api/search-vendors` | `/api/search/vendors` | `searchApi.searchVendors(query, location)` |
| `/api/vendor-services` | `/api/vendor-services` | `vendorApi.getVendorServicesForExplore()` |

## Next Steps

1. Update remaining vendor dashboard pages
2. Update user dashboard pages
3. Test all API calls with backend running
4. Update environment variables for production
5. Test end-to-end workflows

## Notes

- The backend runs on port 5000 by default (configured in `bliss-backend/src/server.ts`)
- CORS is configured to allow requests from the frontend
- Authentication tokens are extracted from `Authorization: Bearer <token>` headers
- All error responses follow a consistent format: `{ error: string, message?: string }`

