# Clerk Authentication Setup - Role-Based Access Control

## Overview

This project uses Clerk for authentication with role-based access control (RBAC) for three user types:
- **Users**: Regular customers who can browse services, make bookings, and manage their events
- **Vendors**: Service providers who can list services, manage bookings, and access vendor dashboard
- **Admins**: Platform administrators with full access to manage users, vendors, and platform settings

## Authentication Flow

### 1. User Registration Flow
```
User visits /sign-up?role=user or /sign-up?role=vendor
↓
Clerk handles signup process
↓
User is redirected to /role-handler?role={role}
↓
Role handler updates user metadata and creates MongoDB record
↓
User is redirected to appropriate dashboard
```

### 2. User Login Flow
```
User visits /sign-in?role=user or /sign-in?role=vendor
↓
Clerk handles authentication
↓
User is redirected to appropriate dashboard based on their role
```

### 3. Role-Based Access Control
- **User Dashboard** (`/dashboard`): Only accessible to users with `role: "user"`
- **Vendor Dashboard** (`/vendor-dashboard`): Only accessible to users with `role: "vendor"`
- **Admin Dashboard** (`/admin-dashboard`): Only accessible to users with `role: "admin"`

## Key Components

### 1. Role Handler (`/app/role-handler/page.tsx`)
- Updates user metadata in Clerk with the selected role
- Creates corresponding record in MongoDB (User or Vendor model)
- Redirects to appropriate dashboard

### 2. Custom Hook (`/hooks/use-role-auth.ts`)
- Provides consistent role-based authentication across the app
- Handles loading states and redirects
- Returns authentication status and user information

### 3. Dashboard Layouts
- **User Dashboard**: Protected with `useRoleAuth("user")`
- **Vendor Dashboard**: Protected with `useRoleAuth("vendor")`
- **Admin Dashboard**: Protected with `useRoleAuth("admin")`

### 4. Webhook Handler (`/app/api/webhooks/clerk/route.ts`)
- Handles Clerk webhook events (user.created, user.updated, user.deleted)
- Creates/updates MongoDB records when users are created or updated
- Maintains data consistency between Clerk and MongoDB

## Security Features

### 1. Role-Based Route Protection
- All dashboard routes are protected by role-based authentication
- Users are automatically redirected to their appropriate dashboard
- Unauthorized access attempts are prevented

### 2. Client-Side Role Validation
- User roles are checked on every dashboard access
- Loading states prevent unauthorized content from being displayed
- Automatic redirects based on user role

### 3. Server-Side Role Validation
- API routes can access user roles through Clerk's server-side auth
- Webhook handlers ensure data consistency
- MongoDB records are created with proper role information

## Testing

### Test Page (`/test-auth`)
A comprehensive test page is available at `/test-auth` that allows you to:
- View current authentication status
- Test user, vendor, and admin authentication flows
- Verify role-based access control
- Test dashboard access restrictions

### Testing Instructions

1. **Test User Authentication:**
   - Visit `/test-auth`
   - Click "Test User Signup"
   - Complete the signup process
   - Verify redirection to user dashboard
   - Try accessing vendor/admin dashboards (should be redirected)

2. **Test Vendor Authentication:**
   - Sign out and click "Test Vendor Signup"
   - Complete the vendor signup process
   - Verify redirection to vendor dashboard
   - Try accessing user/admin dashboards (should be redirected)

3. **Test Admin Authentication:**
   - Click "Test Admin Login"
   - Use admin credentials: `admin@blissmet.in` / `blissmet@admin2024`
   - Verify redirection to admin dashboard
   - Try accessing user/vendor dashboards (should be redirected)

## Environment Variables

Ensure these environment variables are set:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
MONGODB_URI=your_mongodb_connection_string
```

## Clerk Dashboard Configuration

### 1. Webhook Setup
Configure the following webhook endpoint in your Clerk dashboard:
- **URL**: `https://your-domain.com/api/webhooks/clerk`
- **Events**: `user.created`, `user.updated`, `user.deleted`
- **Secret**: Use the same value as `CLERK_WEBHOOK_SECRET`

### 2. User Metadata
The application uses Clerk's `unsafeMetadata` to store user roles:
```json
{
  "role": "user" | "vendor" | "admin"
}
```

### 3. Sign-in/Sign-up Pages
Configure Clerk to use the custom sign-in and sign-up pages:
- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up`
- **After sign-in URL**: `/`
- **After sign-up URL**: `/role-handler`

## Troubleshooting

### Common Issues

1. **User not redirected to correct dashboard:**
   - Check if user metadata contains the correct role
   - Verify the role handler is working correctly
   - Check browser console for errors

2. **Webhook not creating MongoDB records:**
   - Verify webhook secret is correct
   - Check webhook endpoint is accessible
   - Monitor webhook logs in Clerk dashboard

3. **Role-based access not working:**
   - Ensure `useRoleAuth` hook is used in dashboard layouts
   - Check if user metadata is being read correctly
   - Verify redirect logic in the hook

### Debug Steps

1. Visit `/test-auth` to check authentication status
2. Check browser console for any errors
3. Verify user metadata in Clerk dashboard
4. Check MongoDB for user/vendor records
5. Monitor webhook events in Clerk dashboard

## Best Practices

1. **Always use the `useRoleAuth` hook** for protected routes
2. **Test all authentication flows** before deployment
3. **Monitor webhook events** for data consistency
4. **Use proper loading states** to prevent unauthorized access
5. **Implement proper error handling** for authentication failures
6. **Regularly audit user roles** and permissions

## Security Considerations

1. **Role validation** happens both client-side and server-side
2. **Webhook verification** ensures data integrity
3. **Automatic redirects** prevent unauthorized access
4. **Loading states** prevent content flashing
5. **Proper error handling** for authentication failures

This setup provides a robust, secure, and scalable authentication system with proper role-based access control for your event management platform. 