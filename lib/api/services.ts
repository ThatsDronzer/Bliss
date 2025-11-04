import apiClient from './client';

/**
 * API Service functions for different modules
 * All endpoints point to the backend API server
 */

// User API
export const userApi = {
  getUser: (id: string) => apiClient.get(`/api/user/${id}`),
  updateUser: (id: string, data: any) => apiClient.put(`/api/user/${id}`, data),
  createUser: (data: any) => apiClient.post('/api/user/create', data),
};

// Vendor API
export const vendorApi = {
  getVendorByClerkId: (id: string) => apiClient.get(`/api/vendor/${id}`),
  updateVendorByClerkId: (id: string, data: any) =>
    apiClient.put(`/api/vendor/${id}`, data),
  getVendorById: (id: string) => apiClient.get(`/api/vendors/${id}`),
  getVendorServices: (id: string) => apiClient.get(`/api/vendors/${id}/services`),
  getVendorVerification: (clerkId: string) =>
    apiClient.get(`/api/vendor-verification?clerkId=${clerkId}`),
  submitVendorVerification: (data: any) =>
    apiClient.post('/api/vendor-verification', data),
  getVendorServicesForExplore: () => apiClient.get('/api/vendor-services'),
};

// Listing API
export const listingApi = {
  getListings: () => apiClient.get('/api/listing'),
  getListingById: (id: string) => apiClient.get(`/api/listing/${id}`),
  createListing: (data: any) => apiClient.post('/api/listing', data),
  updateListing: (data: any) => apiClient.put('/api/listing', data),
  deleteListing: (listingId: string) =>
    apiClient.delete('/api/listing', { listingId }),
  toggleListingStatus: (id: string) =>
    apiClient.patch(`/api/listing/${id}/status`),
  addImages: (listingId: string, images: File[]) => {
    const formData = new FormData();
    formData.append('listingId', listingId);
    images.forEach((image) => {
      formData.append('images', image);
    });
    return apiClient.upload('/api/listing/add-images', formData);
  },
  getListingReviews: (listingId: string) =>
    apiClient.get(`/api/listing/reviews?listingId=${listingId}`),
};

// Review API
export const reviewApi = {
  createReview: (data: any) => apiClient.post('/api/review', data),
  getReviews: (targetId: string, targetType: 'service' | 'vendor') =>
    apiClient.get(`/api/review?targetId=${targetId}&targetType=${targetType}`),
  deleteReview: (reviewId: string) =>
    apiClient.delete(`/api/review?id=${reviewId}`),
  createListingReview: (data: any) => apiClient.post('/api/reviews', data),
  deleteListingReview: (reviewId: string) =>
    apiClient.delete('/api/reviews', { body: JSON.stringify({ reviewId }) }),
};

// Booking & Messaging API
export const bookingApi = {
  getBookingStatus: (serviceId: string) =>
    apiClient.get(`/api/booking-status?serviceId=${serviceId}`),
  cancelBooking: (requestId: string, status: string) =>
    apiClient.patch(`/api/booking-status/${requestId}`, { status }),
  createBookingMessage: (data: any) =>
    apiClient.post('/api/message/create', data),
  getVendorBookingRequests: (params?: {
    status?: string;
    limit?: number;
    page?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    return apiClient.get(
      `/api/vendor/booking-requests?${queryParams.toString()}`
    );
  },
  updateVendorBookingRequestStatus: (requestId: string, status: string) =>
    apiClient.patch(`/api/vendor/booking-requests/${requestId}`, { status }),
};

// Payment API
export const paymentApi = {
  createPayment: (messageId: string) =>
    apiClient.post('/api/payments/create', { messageId }),
  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => apiClient.post('/api/payments/verify', data),
};

// Search & Services API
export const searchApi = {
  searchVendors: (query?: string, location?: string) => {
    const queryParams = new URLSearchParams();
    if (query) queryParams.append('query', query);
    if (location) queryParams.append('location', location);
    return apiClient.get(`/api/search/vendors?${queryParams.toString()}`);
  },
  getServiceById: (serviceId: string) =>
    apiClient.get(`/api/services/${serviceId}`),
  getRentalItems: (params?: {
    category?: string;
    search?: string;
    date?: string;
    minPrice?: string;
    maxPrice?: string;
    vendorRating?: string;
    sortBy?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.date) queryParams.append('date', params.date);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params?.vendorRating)
      queryParams.append('vendorRating', params.vendorRating);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    return apiClient.get(`/api/rental?${queryParams.toString()}`);
  },
};

// Admin API
export const adminApi = {
  getAdminPayments: () => apiClient.get('/api/admin/payments'),
  processAdvancePayment: (paymentId: string) =>
    apiClient.post('/api/admin/payments/advance', { paymentId }),
};

// Notification API
export const notificationApi = {
  notifyCustomer: (data: {
    requestId: string;
    customerPhone: string;
    vendorName: string;
    status: string;
    customerName?: string;
  }) => apiClient.post('/api/notify/customer', data),
  notifyVendor: (data: { customerName: string; requestId: string }) =>
    apiClient.post('/api/notify/vendor', data),
};

// Image API
export const imageApi = {
  deleteImage: (publicId: string) =>
    apiClient.delete('/api/delete-image', { publicId }),
  deleteImages: (publicIds: string[]) =>
    apiClient.post('/api/cleanup-images', { imageIds: publicIds }),
};

