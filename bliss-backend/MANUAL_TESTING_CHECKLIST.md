# Manual Testing Checklist for Backward Compatibility

## Overview

This checklist provides a comprehensive manual testing guide to validate backward compatibility after the backend architecture refactoring. Use this checklist to ensure all functionality works as expected before deploying to production.

## Prerequisites

- [ ] Backend server is running (`npm run dev`)
- [ ] Database is connected and accessible
- [ ] Environment variables are properly configured
- [ ] Test user accounts created (user, vendor, admin)
- [ ] Valid authentication tokens available

## Test Environment Setup

### 1. Start the Backend Server

```bash
cd bliss-backend
npm run dev
```

Expected output:
```
🚀 Backend server running on port 8787
📡 CORS enabled for: http://localhost:3000
🌍 Environment: development
```

### 2. Verify Health Endpoint

```bash
curl http://localhost:8787/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-08T...",
  "service": "bliss-backend-api"
}
```

## Authentication & Authorization Tests

### Test 1: Unauthenticated Access to Protected Endpoint

**Endpoint**: `GET /api/user/booking-requests`

```bash
curl -X GET http://localhost:8787/api/user/booking-requests
```

**Expected Result**:
- Status: 401 Unauthorized
- Response format:
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

**Status**: [ ] Pass [ ] Fail

---

### Test 2: Invalid Token

**Endpoint**: `GET /api/listing`

```bash
curl -X GET http://localhost:8787/api/listing \
  -H "Authorization: Bearer invalid_token"
```

**Expected Result**:
- Status: 401 Unauthorized
- Response format:
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**Status**: [ ] Pass [ ] Fail

---

### Test 3: Valid Authentication

**Endpoint**: `GET /api/user/booking-requests`

```bash
curl -X GET http://localhost:8787/api/user/booking-requests \
  -H "Authorization: Bearer YOUR_VALID_TOKEN"
```

**Expected Result**:
- Status: 200 OK
- Response format:
```json
{
  "status": "success",
  "statusCode": 200,
  "data": [...],
  "error": null,
  "message": "..."
}
```

**Status**: [ ] Pass [ ] Fail

---

### Test 4: Role-Based Access (Vendor Role Required)

**Endpoint**: `POST /api/listing`

```bash
curl -X POST http://localhost:8787/api/listing \
  -H "Authorization: Bearer USER_TOKEN_WITHOUT_VENDOR_ROLE" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Result**:
- Status: 403 Forbidden
- Response format:
```json
{
  "error": "Forbidden",
  "message": "Access denied. Required role: vendor"
}
```

**Status**: [ ] Pass [ ] Fail

---

### Test 5: Role-Based Access (Admin Role Required)

**Endpoint**: `GET /api/admin/payments`

```bash
curl -X GET http://localhost:8787/api/admin/payments \
  -H "Authorization: Bearer USER_TOKEN_WITHOUT_ADMIN_ROLE"
```

**Expected Result**:
- Status: 403 Forbidden
- Response format:
```json
{
  "error": "Forbidden",
  "message": "Access denied. Required role: admin"
}
```

**Status**: [ ] Pass [ ] Fail

## User Domain Tests

### Test 6: Get User by ID (Public)

**Endpoint**: `GET /api/user/:id`

```bash
curl -X GET http://localhost:8787/api/user/USER_ID
```

**Expected Result**:
- Status: 200 OK
- Response contains user data
- Response format matches success structure

**Status**: [ ] Pass [ ] Fail

---

### Test 7: Update User (Authenticated)

**Endpoint**: `PUT /api/user/:id`

```bash
curl -X PUT http://localhost:8787/api/user/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response contains updated user data
- updatedAt timestamp is updated

**Status**: [ ] Pass [ ] Fail

---

### Test 8: Create User (Authenticated)

**Endpoint**: `POST /api/user/create`

```bash
curl -X POST http://localhost:8787/api/user/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clerkId": "clerk_user_id",
    "email": "newuser@example.com",
    "name": "New User"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response contains created user data
- User is created in database

**Status**: [ ] Pass [ ] Fail

## Vendor Domain Tests

### Test 9: Get Vendor by ID (Public)

**Endpoint**: `GET /api/vendor/:id`

```bash
curl -X GET http://localhost:8787/api/vendor/VENDOR_CLERK_ID
```

**Expected Result**:
- Status: 200 OK
- Response contains vendor data
- Response format matches success structure

**Status**: [ ] Pass [ ] Fail

---

### Test 10: Update Vendor (Authenticated)

**Endpoint**: `PUT /api/vendor/:id`

```bash
curl -X PUT http://localhost:8787/api/vendor/VENDOR_CLERK_ID \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Updated Business Name",
    "description": "Updated description"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response contains updated vendor data
- updatedAt timestamp is updated

**Status**: [ ] Pass [ ] Fail

## Listing Domain Tests

### Test 11: Get Vendor Listings (Authenticated)

**Endpoint**: `GET /api/listing`

```bash
curl -X GET http://localhost:8787/api/listing \
  -H "Authorization: Bearer VENDOR_TOKEN"
```

**Expected Result**:
- Status: 200 OK
- Response contains array of listings
- Response format matches success structure

**Status**: [ ] Pass [ ] Fail

---

### Test 12: Create Listing (Vendor Role)

**Endpoint**: `POST /api/listing`

```bash
curl -X POST http://localhost:8787/api/listing \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Listing",
    "description": "Test description",
    "price": 1000,
    "category": "photography"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response contains created listing data
- Listing is created in database

**Status**: [ ] Pass [ ] Fail

---

### Test 13: Update Listing (Vendor Role)

**Endpoint**: `PUT /api/listing`

```bash
curl -X PUT http://localhost:8787/api/listing \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "LISTING_ID",
    "title": "Updated Listing",
    "price": 1500
  }'
```

**Expected Result**:
- Status: 200 OK
- Response contains updated listing data
- updatedAt timestamp is updated

**Status**: [ ] Pass [ ] Fail

---

### Test 14: Delete Listing (Vendor Role)

**Endpoint**: `DELETE /api/listing`

```bash
curl -X DELETE http://localhost:8787/api/listing \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "LISTING_ID"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response confirms deletion
- Listing is removed from database

**Status**: [ ] Pass [ ] Fail

## Payment Domain Tests

### Test 15: Create Payment (Public)

**Endpoint**: `POST /api/payments/create`

```bash
curl -X POST http://localhost:8787/api/payments/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "INR",
    "bookingId": "BOOKING_ID"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response contains payment order details
- Razorpay order is created

**Status**: [ ] Pass [ ] Fail

---

### Test 16: Verify Payment (Public)

**Endpoint**: `POST /api/payments/verify`

```bash
curl -X POST http://localhost:8787/api/payments/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "ORDER_ID",
    "razorpay_payment_id": "PAYMENT_ID",
    "razorpay_signature": "SIGNATURE"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response confirms payment verification
- Payment status is updated in database

**Status**: [ ] Pass [ ] Fail

## Review Domain Tests

### Test 17: Create Review (Authenticated)

**Endpoint**: `POST /api/review`

```bash
curl -X POST http://localhost:8787/api/review \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetId": "VENDOR_ID",
    "targetType": "vendor",
    "rating": 5,
    "comment": "Great service!"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response contains created review data
- Review is created in database

**Status**: [ ] Pass [ ] Fail

---

### Test 18: Get Reviews (Public)

**Endpoint**: `GET /api/review?targetId=VENDOR_ID&targetType=vendor`

```bash
curl -X GET "http://localhost:8787/api/review?targetId=VENDOR_ID&targetType=vendor"
```

**Expected Result**:
- Status: 200 OK
- Response contains array of reviews
- Response format matches success structure

**Status**: [ ] Pass [ ] Fail

---

### Test 19: Delete Review (Authenticated)

**Endpoint**: `DELETE /api/review`

```bash
curl -X DELETE http://localhost:8787/api/review \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reviewId": "REVIEW_ID"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response confirms deletion
- Review is removed from database

**Status**: [ ] Pass [ ] Fail

## Message Domain Tests

### Test 20: Create Booking Message (Authenticated)

**Endpoint**: `POST /api/message/create`

```bash
curl -X POST http://localhost:8787/api/message/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorId": "VENDOR_ID",
    "message": "I would like to book your service",
    "eventDate": "2025-12-01"
  }'
```

**Expected Result**:
- Status: 200 OK
- Response contains created message data
- Message is created in database

**Status**: [ ] Pass [ ] Fail

---

### Test 21: Get Vendor Messages (Vendor Role)

**Endpoint**: `GET /api/message/vendor`

```bash
curl -X GET http://localhost:8787/api/message/vendor \
  -H "Authorization: Bearer VENDOR_TOKEN"
```

**Expected Result**:
- Status: 200 OK
- Response contains array of messages
- Response format matches success structure

**Status**: [ ] Pass [ ] Fail

## Search Domain Tests

### Test 22: Search Vendors (Public)

**Endpoint**: `GET /api/search/vendors?query=photographer&location=Mumbai`

```bash
curl -X GET "http://localhost:8787/api/search/vendors?query=photographer&location=Mumbai"
```

**Expected Result**:
- Status: 200 OK
- Response contains array of matching vendors
- Search filters are applied correctly

**Status**: [ ] Pass [ ] Fail

---

### Test 23: Get Service by ID (Public)

**Endpoint**: `GET /api/search/services/:serviceId`

```bash
curl -X GET http://localhost:8787/api/search/services/SERVICE_ID
```

**Expected Result**:
- Status: 200 OK
- Response contains service data
- Response format matches success structure

**Status**: [ ] Pass [ ] Fail

## Admin Domain Tests

### Test 24: Get Admin Payments (Admin Role)

**Endpoint**: `GET /api/admin/payments`

```bash
curl -X GET http://localhost:8787/api/admin/payments \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Result**:
- Status: 200 OK
- Response contains array of payments
- Response format matches success structure

**Status**: [ ] Pass [ ] Fail

## Webhook Domain Tests

### Test 25: Clerk Webhook (Public)

**Endpoint**: `POST /api/webhooks/clerk`

```bash
curl -X POST http://localhost:8787/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test" \
  -H "svix-timestamp: 1234567890" \
  -H "svix-signature: v1,test_signature" \
  -d '{
    "type": "user.created",
    "data": {}
  }'
```

**Expected Result**:
- Status: 200 OK
- Webhook is processed correctly
- User is created/updated in database

**Status**: [ ] Pass [ ] Fail

---

### Test 26: Razorpay Webhook (Public)

**Endpoint**: `POST /api/webhooks/razorpay`

```bash
curl -X POST http://localhost:8787/api/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -H "X-Razorpay-Signature: test_signature" \
  -d '{
    "event": "payment.captured",
    "payload": {}
  }'
```

**Expected Result**:
- Status: 200 OK
- Webhook is processed correctly
- Payment status is updated in database

**Status**: [ ] Pass [ ] Fail

## Error Response Tests

### Test 27: 404 Not Found

**Endpoint**: `GET /api/nonexistent-endpoint`

```bash
curl -X GET http://localhost:8787/api/nonexistent-endpoint
```

**Expected Result**:
- Status: 404 Not Found
- Response format:
```json
{
  "error": "Not Found",
  "message": "Cannot GET /api/nonexistent-endpoint"
}
```

**Status**: [ ] Pass [ ] Fail

---

### Test 28: Bad Request Error

**Endpoint**: `POST /api/listing` (with invalid data)

```bash
curl -X POST http://localhost:8787/api/listing \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Result**:
- Status: 400 Bad Request
- Response format:
```json
{
  "status": "error",
  "statusCode": 400,
  "data": null,
  "error": {
    "message": "...",
    "errorCode": "BAD_REQUEST"
  },
  "message": "..."
}
```

**Status**: [ ] Pass [ ] Fail

---

### Test 29: Database Connection Error

**Test**: Stop database and attempt operation

**Expected Result**:
- Status: 500 Internal Server Error
- Response format:
```json
{
  "status": "error",
  "statusCode": 500,
  "data": null,
  "error": {
    "message": "Database Connection Error",
    "errorCode": "DB_CONNECTION_ERROR"
  },
  "message": "Database Connection Error"
}
```

**Status**: [ ] Pass [ ] Fail

## External Services Tests

### Test 30: AWS S3 Upload

**Test**: Upload an image to a listing

**Expected Result**:
- Image is uploaded to S3
- Image URL is returned
- Image is accessible

**Status**: [ ] Pass [ ] Fail

---

### Test 31: Email Service

**Test**: Trigger an email notification

**Expected Result**:
- Email is sent successfully
- Email is received by recipient
- Email content is correct

**Status**: [ ] Pass [ ] Fail

---

### Test 32: Razorpay Integration

**Test**: Create and verify a payment

**Expected Result**:
- Payment order is created in Razorpay
- Payment can be verified
- Payment status is updated

**Status**: [ ] Pass [ ] Fail

## Summary

### Test Results

- Total Tests: 32
- Passed: ___
- Failed: ___
- Success Rate: ___%

### Failed Tests

List any failed tests and their details:

1. 
2. 
3. 

### Notes

Add any additional observations or issues:

---

### Sign-off

- [ ] All critical tests passed
- [ ] No breaking changes detected
- [ ] Frontend integration verified
- [ ] External services working
- [ ] Ready for deployment

**Tested By**: _______________
**Date**: _______________
**Signature**: _______________
