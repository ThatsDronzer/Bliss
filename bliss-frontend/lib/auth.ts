"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Import vendors at the top
import { vendors } from "@/lib/data"

// Demo user data
export const demoUser = {
  id: "user-1",
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  phone: "+91 98765 43210",
  avatar: "/placeholder.svg?height=200&width=200&text=PS",
  weddingDate: "2023-12-15",
  partner: "Rahul Verma",
  location: "Delhi NCR",
}

// Demo vendor data
export const demoVendor = {
  id: "vendor-1",
  name: "Royal Wedding Palace",
  email: "info@royalweddingpalace.in",
  phone: "+91 98765 12345",
  avatar: "/placeholder.svg?height=200&width=200&text=RWP",
  category: "Venue",
  location: "Delhi NCR",
  description: "Premier wedding venue with world-class amenities",
  established: "2010",
  website: "www.royalweddingpalace.in",
  status: "Verified",
  joinDate: "2022-05-15",
}

// Demo admin data
export const demoAdmin = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@weddingbazaar.in",
  phone: "+91 99999 88888",
  avatar: "/placeholder.svg?height=200&width=200&text=Admin",
  role: "Super Admin",
  permissions: ["all"],
  lastLogin: "2023-11-20T08:30:00",
}

// Types
export type User = typeof demoUser | null
export type Vendor = typeof demoVendor | null
export type Admin = typeof demoAdmin | null

// Mock users data for admin
export const mockUsers = [
  {
    ...demoUser,
    id: "user-1",
    status: "Active",
    joinDate: "2023-08-15",
    lastLogin: "2023-11-19T14:30:00",
    bookingsCount: 4,
    totalSpent: "₹3,75,000",
  },
  {
    id: "user-2",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 87654 32109",
    avatar: "/placeholder.svg?height=200&width=200&text=AK",
    weddingDate: "2023-11-20",
    partner: "Neha Singh",
    location: "Mumbai",
    status: "Active",
    joinDate: "2023-07-10",
    lastLogin: "2023-11-18T10:15:00",
    bookingsCount: 3,
    totalSpent: "₹2,85,000",
  },
  {
    id: "user-3",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "+91 76543 21098",
    avatar: "/placeholder.svg?height=200&width=200&text=VM",
    weddingDate: "2023-12-05",
    partner: "Sonia Gupta",
    location: "Delhi NCR",
    status: "Active",
    joinDate: "2023-09-05",
    lastLogin: "2023-11-17T16:45:00",
    bookingsCount: 2,
    totalSpent: "₹1,50,000",
  },
  {
    id: "user-4",
    name: "Anjali Patel",
    email: "anjali.p@example.com",
    phone: "+91 65432 10987",
    avatar: "/placeholder.svg?height=200&width=200&text=AP",
    weddingDate: "2024-02-14",
    partner: "Rajesh Sharma",
    location: "Bangalore",
    status: "Active",
    joinDate: "2023-10-12",
    lastLogin: "2023-11-19T09:30:00",
    bookingsCount: 1,
    totalSpent: "₹75,000",
  },
  {
    id: "user-5",
    name: "Karan Mehra",
    email: "karan.m@example.com",
    phone: "+91 54321 09876",
    avatar: "/placeholder.svg?height=200&width=200&text=KM",
    weddingDate: "2024-01-20",
    partner: "Preeti Joshi",
    location: "Jaipur",
    status: "Inactive",
    joinDate: "2023-08-30",
    lastLogin: "2023-10-25T11:20:00",
    bookingsCount: 0,
    totalSpent: "₹0",
  },
]

// Mock vendors data for admin
export const mockVendors = [
  {
    ...demoVendor,
    id: "vendor-1",
    status: "Verified",
    joinDate: "2022-05-15",
    lastLogin: "2023-11-19T10:30:00",
    bookingsCount: 24,
    totalRevenue: "₹48,50,000",
    rating: 4.8,
    reviewsCount: 32,
  },
  {
    id: "vendor-2",
    name: "Capture Moments",
    email: "info@capturemoments.in",
    phone: "+91 98765 23456",
    avatar: "/placeholder.svg?height=200&width=200&text=CM",
    category: "Photography",
    location: "Mumbai",
    description: "Professional wedding photography services",
    established: "2015",
    website: "www.capturemoments.in",
    status: "Verified",
    joinDate: "2022-08-10",
    lastLogin: "2023-11-18T14:45:00",
    bookingsCount: 18,
    totalRevenue: "₹12,75,000",
    rating: 4.9,
    reviewsCount: 24,
  },
  {
    id: "vendor-3",
    name: "Glamour Bride",
    email: "contact@glamourbride.in",
    phone: "+91 98765 34567",
    avatar: "/placeholder.svg?height=200&width=200&text=GB",
    category: "Makeup Artist",
    location: "Bangalore",
    description: "Professional bridal makeup services",
    established: "2018",
    website: "www.glamourbride.in",
    status: "Pending",
    joinDate: "2023-10-05",
    lastLogin: "2023-11-17T09:15:00",
    bookingsCount: 5,
    totalRevenue: "₹1,75,000",
    rating: 4.7,
    reviewsCount: 8,
  },
  {
    id: "vendor-4",
    name: "Royal Feast",
    email: "info@royalfeast.in",
    phone: "+91 98765 45678",
    avatar: "/placeholder.svg?height=200&width=200&text=RF",
    category: "Catering",
    location: "Hyderabad",
    description: "Premium catering services for all occasions",
    established: "2012",
    website: "www.royalfeast.in",
    status: "Verified",
    joinDate: "2022-11-20",
    lastLogin: "2023-11-19T16:30:00",
    bookingsCount: 15,
    totalRevenue: "₹9,50,000",
    rating: 4.6,
    reviewsCount: 19,
  },
  {
    id: "vendor-5",
    name: "Artistic Mehndi",
    email: "contact@artisticmehndi.in",
    phone: "+91 98765 56789",
    avatar: "/placeholder.svg?height=200&width=200&text=AM",
    category: "Mehndi Artist",
    location: "Jaipur",
    description: "Traditional and modern mehndi designs",
    established: "2016",
    website: "www.artisticmehndi.in",
    status: "Rejected",
    joinDate: "2023-09-15",
    lastLogin: "2023-10-10T11:45:00",
    bookingsCount: 0,
    totalRevenue: "₹0",
    rating: 0,
    reviewsCount: 0,
  },
]

// Mock platform statistics for admin
export const mockPlatformStats = {
  users: {
    total: 1250,
    active: 1180,
    inactive: 70,
    growth: "+12% this month",
    newThisMonth: 85,
  },
  vendors: {
    total: 320,
    verified: 275,
    pending: 35,
    rejected: 10,
    growth: "+8% this month",
    newThisMonth: 18,
  },
  bookings: {
    total: 3450,
    confirmed: 2980,
    pending: 420,
    cancelled: 50,
    growth: "+15% this month",
    newThisMonth: 210,
  },
  revenue: {
    total: "₹4,25,00,000",
    thisMonth: "₹32,50,000",
    growth: "+18% this month",
    platformFees: "₹42,50,000",
  },
  categories: [
    { name: "Venue", count: 85, percentage: 26 },
    { name: "Photography", count: 65, percentage: 20 },
    { name: "Makeup Artist", count: 45, percentage: 14 },
    { name: "Catering", count: 40, percentage: 13 },
    { name: "Decor", count: 35, percentage: 11 },
    { name: "Others", count: 50, percentage: 16 },
  ],
  monthlyData: [
    { month: "Jan", users: 950, vendors: 240, bookings: 2100, revenue: 2800000 },
    { month: "Feb", users: 980, vendors: 250, bookings: 2200, revenue: 2950000 },
    { month: "Mar", users: 1000, vendors: 260, bookings: 2300, revenue: 3100000 },
    { month: "Apr", users: 1020, vendors: 270, bookings: 2400, revenue: 3250000 },
    { month: "May", users: 1050, vendors: 280, bookings: 2550, revenue: 3400000 },
    { month: "Jun", users: 1080, vendors: 285, bookings: 2700, revenue: 3550000 },
    { month: "Jul", users: 1120, vendors: 290, bookings: 2850, revenue: 3700000 },
    { month: "Aug", users: 1150, vendors: 295, bookings: 3000, revenue: 3850000 },
    { month: "Sep", users: 1180, vendors: 300, bookings: 3150, revenue: 4000000 },
    { month: "Oct", users: 1210, vendors: 305, bookings: 3300, revenue: 4150000 },
    { month: "Nov", users: 1240, vendors: 315, bookings: 3450, revenue: 4250000 },
    { month: "Dec", users: 1250, vendors: 320, bookings: 3450, revenue: 4250000 },
  ],
}

// Mock bookings data
export const mockBookings = [
  {
    id: "booking-1",
    vendorId: "venue-example",
    vendorName: "Royal Wedding Palace",
    vendorCategory: "Venue",
    bookingDate: "2023-12-15",
    status: "Confirmed",
    amount: "₹2,50,000",
    paymentStatus: "Paid",
    image: "/placeholder.svg?height=200&width=300&text=Venue",
    clientName: "Priya & Rahul",
    clientPhone: "+91 98765 43210",
    clientEmail: "priya.sharma@example.com",
    eventDetails: "Wedding ceremony and reception",
    guestCount: 250,
    createdAt: "2023-10-15T10:30:00",
    platformFee: "₹25,000",
  },
  {
    id: "booking-2",
    vendorId: "photographer-1",
    vendorName: "Capture Moments",
    vendorCategory: "Photography",
    bookingDate: "2023-12-15",
    status: "Confirmed",
    amount: "₹75,000",
    paymentStatus: "Paid",
    image: "/placeholder.svg?height=200&width=300&text=Photography",
    clientName: "Priya & Rahul",
    clientPhone: "+91 98765 43210",
    clientEmail: "priya.sharma@example.com",
    eventDetails: "Wedding photography package",
    guestCount: 250,
    createdAt: "2023-10-18T14:45:00",
    platformFee: "₹7,500",
  },
  {
    id: "booking-3",
    vendorId: "makeup-1",
    vendorName: "Glamour Bride",
    vendorCategory: "Makeup Artist",
    bookingDate: "2023-12-15",
    status: "Pending",
    amount: "₹35,000",
    paymentStatus: "Pending",
    image: "/placeholder.svg?height=200&width=300&text=Makeup",
    clientName: "Priya & Rahul",
    clientPhone: "+91 98765 43210",
    clientEmail: "priya.sharma@example.com",
    eventDetails: "Bridal makeup and family",
    guestCount: 250,
    createdAt: "2023-10-20T09:15:00",
    platformFee: "₹3,500",
  },
  {
    id: "booking-4",
    vendorId: "mehndi-1",
    vendorName: "Artistic Mehndi",
    vendorCategory: "Mehndi Artist",
    bookingDate: "2023-12-14",
    status: "Confirmed",
    amount: "₹15,000",
    paymentStatus: "Paid",
    image: "/placeholder.svg?height=200&width=300&text=Mehndi",
    clientName: "Priya & Rahul",
    clientPhone: "+91 98765 43210",
    clientEmail: "priya.sharma@example.com",
    eventDetails: "Bridal mehndi and family",
    guestCount: 250,
    createdAt: "2023-10-22T11:30:00",
    platformFee: "₹1,500",
  },
  {
    id: "booking-5",
    vendorId: "venue-example",
    vendorName: "Royal Wedding Palace",
    vendorCategory: "Venue",
    bookingDate: "2023-11-20",
    status: "Confirmed",
    amount: "₹3,00,000",
    paymentStatus: "Paid",
    image: "/placeholder.svg?height=200&width=300&text=Venue",
    clientName: "Amit & Neha",
    clientPhone: "+91 87654 32109",
    clientEmail: "amit.neha@example.com",
    eventDetails: "Wedding ceremony and reception",
    guestCount: 300,
    createdAt: "2023-09-10T15:20:00",
    platformFee: "₹30,000",
  },
  {
    id: "booking-6",
    vendorId: "venue-example",
    vendorName: "Royal Wedding Palace",
    vendorCategory: "Venue",
    bookingDate: "2023-12-05",
    status: "Pending",
    amount: "₹2,75,000",
    paymentStatus: "Pending",
    image: "/placeholder.svg?height=200&width=300&text=Venue",
    clientName: "Vikram & Sonia",
    clientPhone: "+91 76543 21098",
    clientEmail: "vikram.sonia@example.com",
    eventDetails: "Engagement ceremony",
    guestCount: 200,
    createdAt: "2023-10-25T13:45:00",
    platformFee: "₹27,500",
  },
]

// Mock favorites data
export const mockFavorites = [
  {
    id: "venue-example",
    name: "Royal Wedding Palace",
    category: "Venue",
    location: "Delhi NCR",
    price: "₹2,50,000",
    image: "/placeholder.svg?height=200&width=300&text=Venue",
  },
  {
    id: "catering-1",
    name: "Royal Feast",
    category: "Catering",
    location: "Hyderabad",
    price: "₹1,200",
    image: "/placeholder.svg?height=200&width=300&text=Catering",
  },
  {
    id: "entertainment-1",
    name: "Rhythm Masters",
    category: "Entertainment",
    location: "Mumbai",
    price: "₹85,000",
    image: "/placeholder.svg?height=200&width=300&text=Entertainment",
  },
]

// Mock messages data
export const mockMessages = [
  {
    id: "msg-1",
    vendorId: "venue-example",
    vendorName: "Royal Wedding Palace",
    vendorImage: "/placeholder.svg?height=50&width=50&text=Venue",
    date: "2023-11-10T14:30:00",
    lastMessage: "Thank you for your inquiry. We have availability on your requested date.",
    unread: false,
    clientName: "Priya & Rahul",
    clientId: "user-1",
    clientImage: "/placeholder.svg?height=50&width=50&text=PR",
    conversation: [
      {
        sender: "client",
        message:
          "Hello, I'm interested in booking your venue for my wedding on December 15th. Do you have availability?",
        timestamp: "2023-11-10T14:00:00",
      },
      {
        sender: "vendor",
        message: "Thank you for your inquiry. We have availability on your requested date.",
        timestamp: "2023-11-10T14:30:00",
      },
    ],
  },
  {
    id: "msg-2",
    vendorId: "photographer-1",
    vendorName: "Capture Moments",
    vendorImage: "/placeholder.svg?height=50&width=50&text=Photo",
    date: "2023-11-12T09:15:00",
    lastMessage: "We've sent you our detailed photography packages as requested.",
    unread: true,
    clientName: "Priya & Rahul",
    clientId: "user-1",
    clientImage: "/placeholder.svg?height=50&width=50&text=PR",
    conversation: [
      {
        sender: "client",
        message: "Hi, I'm looking for a photographer for my wedding. Can you share your packages?",
        timestamp: "2023-11-12T09:00:00",
      },
      {
        sender: "vendor",
        message: "We've sent you our detailed photography packages as requested.",
        timestamp: "2023-11-12T09:15:00",
      },
    ],
  },
  {
    id: "msg-3",
    vendorId: "makeup-1",
    vendorName: "Glamour Bride",
    vendorImage: "/placeholder.svg?height=50&width=50&text=Makeup",
    date: "2023-11-13T16:45:00",
    lastMessage: "Would you like to schedule a trial session before your wedding day?",
    unread: true,
    clientName: "Priya & Rahul",
    clientId: "user-1",
    clientImage: "/placeholder.svg?height=50&width=50&text=PR",
    conversation: [
      {
        sender: "client",
        message: "I'm interested in your bridal makeup services for my wedding.",
        timestamp: "2023-11-13T16:30:00",
      },
      {
        sender: "vendor",
        message: "Would you like to schedule a trial session before your wedding day?",
        timestamp: "2023-11-13T16:45:00",
      },
    ],
  },
  {
    id: "msg-4",
    vendorId: "venue-example",
    vendorName: "Royal Wedding Palace",
    vendorImage: "/placeholder.svg?height=50&width=50&text=Venue",
    date: "2023-11-15T10:30:00",
    lastMessage: "Yes, we can accommodate your request for a traditional mandap setup.",
    unread: false,
    clientName: "Amit & Neha",
    clientId: "user-2",
    clientImage: "/placeholder.svg?height=50&width=50&text=AN",
    conversation: [
      {
        sender: "client",
        message: "Can you accommodate a traditional mandap setup for our wedding?",
        timestamp: "2023-11-15T10:15:00",
      },
      {
        sender: "vendor",
        message: "Yes, we can accommodate your request for a traditional mandap setup.",
        timestamp: "2023-11-15T10:30:00",
      },
    ],
  },
  {
    id: "msg-5",
    vendorId: "venue-example",
    vendorName: "Royal Wedding Palace",
    vendorImage: "/placeholder.svg?height=50&width=50&text=Venue",
    date: "2023-11-18T14:00:00",
    lastMessage: "We offer both veg and non-veg catering options. Would you like to schedule a tasting?",
    unread: true,
    clientName: "Vikram & Sonia",
    clientId: "user-3",
    clientImage: "/placeholder.svg?height=50&width=50&text=VS",
    conversation: [
      {
        sender: "client",
        message: "Do you provide catering services? We're looking for both veg and non-veg options.",
        timestamp: "2023-11-18T13:45:00",
      },
      {
        sender: "vendor",
        message: "We offer both veg and non-veg catering options. Would you like to schedule a tasting?",
        timestamp: "2023-11-18T14:00:00",
      },
    ],
  },
]

// Mock checklist data
export const mockChecklist = [
  {
    id: "task-1",
    title: "Book venue",
    description: "Finalize and book the wedding venue",
    completed: true,
    dueDate: "2023-09-15",
    category: "Venue",
  },
  {
    id: "task-2",
    title: "Book photographer",
    description: "Select and book wedding photographer",
    completed: true,
    dueDate: "2023-09-30",
    category: "Photography",
  },
  {
    id: "task-3",
    title: "Book makeup artist",
    description: "Choose makeup artist and schedule trial",
    completed: false,
    dueDate: "2023-10-15",
    category: "Beauty",
  },
  {
    id: "task-4",
    title: "Finalize guest list",
    description: "Complete the final guest list with contact details",
    completed: false,
    dueDate: "2023-10-30",
    category: "Planning",
  },
  {
    id: "task-5",
    title: "Send invitations",
    description: "Send out wedding invitations to all guests",
    completed: false,
    dueDate: "2023-11-15",
    category: "Planning",
  },
  {
    id: "task-6",
    title: "Book catering",
    description: "Finalize menu and book catering service",
    completed: true,
    dueDate: "2023-10-05",
    category: "Food",
  },
  {
    id: "task-7",
    title: "Arrange transportation",
    description: "Book vehicles for wedding day transportation",
    completed: false,
    dueDate: "2023-11-20",
    category: "Logistics",
  },
  {
    id: "task-8",
    title: "Purchase wedding attire",
    description: "Buy wedding outfits for bride and groom",
    completed: false,
    dueDate: "2023-11-01",
    category: "Attire",
  },
]

// Mock payment history
export const mockPayments = [
  {
    id: "payment-1",
    vendorName: "Royal Wedding Palace",
    category: "Venue",
    date: "2023-10-15",
    amount: "₹1,25,000",
    status: "Paid",
    method: "Credit Card",
    description: "Venue booking advance payment (50%)",
  },
  {
    id: "payment-2",
    vendorName: "Capture Moments",
    category: "Photography",
    date: "2023-10-20",
    amount: "₹37,500",
    status: "Paid",
    method: "UPI",
    description: "Photography booking advance payment (50%)",
  },
  {
    id: "payment-3",
    vendorName: "Royal Wedding Palace",
    category: "Venue",
    date: "2023-11-15",
    amount: "₹1,25,000",
    status: "Pending",
    method: "Bank Transfer",
    description: "Venue booking final payment (50%)",
  },
  {
    id: "payment-4",
    vendorName: "Royal Feast",
    category: "Catering",
    date: "2023-10-25",
    amount: "₹60,000",
    status: "Paid",
    method: "UPI",
    description: "Catering advance payment (50%)",
  },
]

// Mock vendor listings
export const mockVendorListings = [
  {
    id: "listing-1",
    title: "Royal Wedding Palace - Main Hall",
    category: "Venue",
    price: "₹2,50,000",
    description: "Our grand main hall can accommodate up to 500 guests with elegant decor and world-class amenities.",
    features: ["500 capacity", "Air-conditioned", "Valet parking", "Catering available", "Decor included"],
    image: "/placeholder.svg?height=200&width=300&text=Main+Hall",
    status: "Active",
  },
  {
    id: "listing-2",
    title: "Royal Wedding Palace - Garden Area",
    category: "Venue",
    price: "₹1,75,000",
    description: "Beautiful outdoor garden area perfect for daytime events and ceremonies.",
    features: ["300 capacity", "Landscaped gardens", "Covered areas available", "Natural lighting", "Scenic backdrop"],
    image: "/placeholder.svg?height=200&width=300&text=Garden",
    status: "Active",
  },
  {
    id: "listing-3",
    title: "Royal Wedding Palace - Banquet Hall",
    category: "Venue",
    price: "₹1,50,000",
    description: "Intimate banquet hall ideal for smaller gatherings and pre-wedding functions.",
    features: ["150 capacity", "Air-conditioned", "Private entrance", "Sound system", "Customizable setup"],
    image: "/placeholder.svg?height=200&width=300&text=Banquet",
    status: "Active",
  },
]

// Mock vendor reviews
export const mockVendorReviews = [
  {
    id: "review-1",
    clientName: "Priya & Rahul",
    clientImage: "/placeholder.svg?height=50&width=50&text=PR",
    rating: 5,
    date: "2023-10-20",
    review:
      "Absolutely amazing venue! The staff was incredibly helpful and the venue looked stunning on our wedding day. Highly recommended!",
    response: "Thank you for your kind words! It was our pleasure to host your special day.",
    hasResponse: true,
  },
  {
    id: "review-2",
    clientName: "Amit & Neha",
    clientImage: "/placeholder.svg?height=50&width=50&text=AN",
    rating: 4,
    date: "2023-09-15",
    review:
      "Beautiful venue with great service. The only issue was some delay in setup, but everything else was perfect.",
    response: "",
    hasResponse: false,
  },
  {
    id: "review-3",
    clientName: "Vikram & Sonia",
    clientImage: "/placeholder.svg?height=50&width=50&text=VS",
    rating: 5,
    date: "2023-08-30",
    review:
      "We had our engagement ceremony here and it was magical! The decor was exactly as we requested and the food was delicious.",
    response: "We're delighted to hear you had a wonderful experience. Looking forward to hosting your future events!",
    hasResponse: true,
  },
]

// Mock vendor analytics
export const mockVendorAnalytics = {
  bookings: {
    total: 24,
    confirmed: 18,
    pending: 6,
    cancelled: 0,
    monthlyData: [
      { month: "Jan", bookings: 1 },
      { month: "Feb", bookings: 2 },
      { month: "Mar", bookings: 1 },
      { month: "Apr", bookings: 0 },
      { month: "May", bookings: 1 },
      { month: "Jun", bookings: 2 },
      { month: "Jul", bookings: 3 },
      { month: "Aug", bookings: 4 },
      { month: "Sep", bookings: 3 },
      { month: "Oct", bookings: 2 },
      { month: "Nov", bookings: 3 },
      { month: "Dec", bookings: 2 },
    ],
  },
  revenue: {
    total: "₹48,50,000",
    pending: "₹12,25,000",
    received: "₹36,25,000",
    monthlyData: [
      { month: "Jan", revenue: 250000 },
      { month: "Feb", revenue: 500000 },
      { month: "Mar", revenue: 250000 },
      { month: "Apr", revenue: 0 },
      { month: "May", revenue: 250000 },
      { month: "Jun", revenue: 500000 },
      { month: "Jul", revenue: 750000 },
      { month: "Aug", revenue: 1000000 },
      { month: "Sep", revenue: 750000 },
      { month: "Oct", revenue: 500000 },
      { month: "Nov", revenue: 750000 },
      { month: "Dec", revenue: 500000 },
    ],
  },
  profileViews: {
    total: 1250,
    monthlyData: [
      { month: "Jan", views: 50 },
      { month: "Feb", views: 75 },
      { month: "Mar", views: 60 },
      { month: "Apr", views: 80 },
      { month: "May", views: 90 },
      { month: "Jun", views: 100 },
      { month: "Jul", views: 120 },
      { month: "Aug", views: 150 },
      { month: "Sep", views: 140 },
      { month: "Oct", views: 130 },
      { month: "Nov", views: 145 },
      { month: "Dec", views: 110 },
    ],
  },
  inquiries: {
    total: 85,
    converted: 24,
    conversionRate: "28.2%",
    monthlyData: [
      { month: "Jan", inquiries: 4 },
      { month: "Feb", inquiries: 6 },
      { month: "Mar", inquiries: 5 },
      { month: "Apr", inquiries: 7 },
      { month: "May", inquiries: 8 },
      { month: "Jun", inquiries: 9 },
      { month: "Jul", inquiries: 10 },
      { month: "Aug", inquiries: 12 },
      { month: "Sep", inquiries: 8 },
      { month: "Oct", inquiries: 6 },
      { month: "Nov", inquiries: 5 },
      { month: "Dec", inquiries: 5 },
    ],
  },
}

// Mock categories for admin
export const mockCategories = [
  {
    id: "cat-1",
    name: "Venue",
    icon: "Home",
    vendorCount: 85,
    status: "Active",
    createdAt: "2022-01-15",
  },
  {
    id: "cat-2",
    name: "Photography",
    icon: "Camera",
    vendorCount: 65,
    status: "Active",
    createdAt: "2022-01-15",
  },
  {
    id: "cat-3",
    name: "Catering",
    icon: "Utensils",
    vendorCount: 40,
    status: "Active",
    createdAt: "2022-01-15",
  },
  {
    id: "cat-4",
    name: "Decor",
    icon: "Palette",
    vendorCount: 35,
    status: "Active",
    createdAt: "2022-01-15",
  },
  {
    id: "cat-5",
    name: "Mehndi Artist",
    icon: "Palette",
    vendorCount: 30,
    status: "Active",
    createdAt: "2022-01-15",
  },
  {
    id: "cat-6",
    name: "Entertainment",
    icon: "Music",
    vendorCount: 25,
    status: "Active",
    createdAt: "2022-01-15",
  },
  {
    id: "cat-7",
    name: "Wedding Planner",
    icon: "Users",
    vendorCount: 20,
    status: "Active",
    createdAt: "2022-01-15",
  },
  {
    id: "cat-8",
    name: "Gifts",
    icon: "Gift",
    vendorCount: 15,
    status: "Active",
    createdAt: "2022-01-15",
  },
  {
    id: "cat-9",
    name: "Jewelry",
    icon: "Ring",
    vendorCount: 5,
    status: "Active",
    createdAt: "2022-01-15",
  },
]

// Mock admin notifications
export const mockAdminNotifications = [
  {
    id: "notif-1",
    title: "New Vendor Registration",
    message: "A new vendor 'Glamour Bride' has registered and is awaiting verification.",
    type: "vendor",
    status: "unread",
    createdAt: "2023-11-19T10:30:00",
    actionUrl: "/admin-dashboard/vendors/pending",
  },
  {
    id: "notif-2",
    title: "New Booking",
    message: "A new booking worth ₹2,75,000 has been created for Royal Wedding Palace.",
    type: "booking",
    status: "unread",
    createdAt: "2023-11-18T15:45:00",
    actionUrl: "/admin-dashboard/bookings",
  },
  {
    id: "notif-3",
    title: "Payment Received",
    message: "Platform fee of ₹25,000 has been received for booking #booking-1.",
    type: "payment",
    status: "read",
    createdAt: "2023-11-17T09:15:00",
    actionUrl: "/admin-dashboard/payments",
  },
  {
    id: "notif-4",
    title: "User Report",
    message: "A user has reported an issue with vendor 'Artistic Mehndi'.",
    type: "report",
    status: "read",
    createdAt: "2023-11-16T14:30:00",
    actionUrl: "/admin-dashboard/reports",
  },
  {
    id: "notif-5",
    title: "System Alert",
    message: "Monthly analytics report is now available for review.",
    type: "system",
    status: "read",
    createdAt: "2023-11-15T08:00:00",
    actionUrl: "/admin-dashboard/analytics",
  },
]

// Update the AuthState interface
interface AuthState {
  user: User
  vendor: Vendor
  admin: Admin
  isAuthenticated: boolean
  isVendor: boolean
  isAdmin: boolean
  favorites: typeof mockFavorites
  checklist: typeof mockChecklist
  bookings: typeof mockBookings
  messages: typeof mockMessages
  payments: typeof mockPayments
  vendorListings: typeof mockVendorListings
  vendorReviews: typeof mockVendorReviews
  vendorAnalytics: typeof mockVendorAnalytics
  adminUsers: typeof mockUsers
  adminVendors: typeof mockVendors
  adminStats: typeof mockPlatformStats
  adminCategories: typeof mockCategories
  adminNotifications: typeof mockAdminNotifications
  login: (
    email: string,
    password: string,
    userType: "user" | "vendor" | "admin",
  ) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateProfile: (updatedProfile: Partial<User>) => void
  updateVendorProfile: (updatedProfile: Partial<Vendor>) => void
  toggleFavorite: (vendorId: string) => boolean
  updateChecklist: (updatedChecklist: typeof mockChecklist) => void
  markMessageAsRead: (messageId: string) => void
  sendMessage: (messageId: string, text: string, sender: "client" | "vendor" | "admin") => void
  addTask: (task: { title: string; description?: string; dueDate: string; category: string }) => void
  toggleTaskCompletion: (taskId: string) => void
  deleteTask: (taskId: string) => void
  updateBookingStatus: (bookingId: string, status: string) => void
  addBooking: (booking: Omit<(typeof mockBookings)[0], "platformFee">) => void
  addVendorListing: (listing: Omit<(typeof mockVendorListings)[0], "id">) => void
  updateVendorListing: (listingId: string, updates: Partial<(typeof mockVendorListings)[0]>) => void
  deleteVendorListing: (listingId: string) => void
  respondToReview: (reviewId: string, response: string) => void
  updateUserStatus: (userId: string, status: string) => void
  updateVendorStatus: (vendorId: string, status: string) => void
  updateCategoryStatus: (categoryId: string, status: string) => void
  addCategory: (category: Omit<(typeof mockCategories)[0], "id" | "vendorCount" | "createdAt">) => void
  markNotificationAsRead: (notificationId: string) => void
  clearAllNotifications: () => void
}

// Create auth store with persistence
export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      vendor: null,
      admin: null,
      isAuthenticated: false,
      isVendor: false,
      isAdmin: false,
      favorites: mockFavorites,
      checklist: mockChecklist,
      bookings: mockBookings,
      messages: mockMessages,
      payments: mockPayments,
      vendorListings: mockVendorListings,
      vendorReviews: mockVendorReviews,
      vendorAnalytics: mockVendorAnalytics,
      adminUsers: mockUsers,
      adminVendors: mockVendors,
      adminStats: mockPlatformStats,
      adminCategories: mockCategories,
      adminNotifications: mockAdminNotifications,
      login: async (email: string, password: string, userType: "user" | "vendor" | "admin") => {
        // For admin login
        if (userType === "admin") {
          if (email === "admin@blissmet.in" && password === "blissmet@admin2024") {
            set({
              admin: demoAdmin,
              isAuthenticated: true,
              isAdmin: true,
              isVendor: false,
              user: null,
              vendor: null,
            })
            return { success: true, message: "Login successful" }
          }
          return { success: false, message: "Invalid email or password" }
        }
        
        // For other user types, accept any email with password "password123"
        if (password === "password123") {
          if (userType === "vendor") {
            set({
              vendor: demoVendor,
              isAuthenticated: true,
              isVendor: true,
              isAdmin: false,
              user: null,
              admin: null,
            })
          } else {
            set({
              user: demoUser,
              isAuthenticated: true,
              isVendor: false,
              isAdmin: false,
              vendor: null,
              admin: null,
            })
          }
          return { success: true, message: "Login successful" }
        }
        return { success: false, message: "Invalid email or password" }
      },
      logout: () => {
        set({ user: null, vendor: null, admin: null, isAuthenticated: false, isVendor: false, isAdmin: false })
      },
      updateProfile: (updatedProfile) => {
        set({ user: { ...get().user, ...updatedProfile } as User })
      },
      updateVendorProfile: (updatedProfile) => {
        set({ vendor: { ...get().vendor, ...updatedProfile } as Vendor })
      },
      toggleFavorite: (vendorId) => {
        const currentFavorites = get().favorites || [...mockFavorites]
        const exists = currentFavorites.some((fav) => fav.id === vendorId)

        if (exists) {
          set({ favorites: currentFavorites.filter((fav) => fav.id !== vendorId) })
          return false // Removed
        } else {
          // Find the vendor in the vendors list and add to favorites
          const vendorToAdd = vendors.find((v) => v.id === vendorId)
          if (vendorToAdd) {
            const newFavorite = {
              id: vendorToAdd.id,
              name: vendorToAdd.name,
              category: vendorToAdd.category,
              location: vendorToAdd.location,
              price: vendorToAdd.price,
              image: vendorToAdd.image,
            }
            set({ favorites: [...currentFavorites, newFavorite] })
            return true // Added
          }
          return false
        }
      },
      updateChecklist: (updatedChecklist) => {
        set({ checklist: updatedChecklist })
      },
      markMessageAsRead: (messageId) => {
        const currentMessages = get().messages || [...mockMessages]
        set({
          messages: currentMessages.map((msg) => (msg.id === messageId ? { ...msg, unread: false } : msg)),
        })
      },
      sendMessage: (messageId, text, sender) => {
        const currentMessages = get().messages || [...mockMessages]
        const now = new Date().toISOString()

        set({
          messages: currentMessages.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  lastMessage: text,
                  date: now,
                  unread: sender === "client" || sender === "admin",
                  conversation: [
                    ...msg.conversation,
                    {
                      sender,
                      message: text,
                      timestamp: now,
                    },
                  ],
                }
              : msg,
          ),
        })
      },
      addTask: (task) => {
        const currentChecklist = get().checklist || [...mockChecklist]
        const newTask = {
          id: `task-${Date.now()}`,
          title: task.title,
          description: task.description || "",
          completed: false,
          dueDate: task.dueDate,
          category: task.category,
        }
        set({ checklist: [...currentChecklist, newTask] })
      },
      toggleTaskCompletion: (taskId) => {
        const currentChecklist = get().checklist || [...mockChecklist]
        set({
          checklist: currentChecklist.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          ),
        })
      },
      deleteTask: (taskId) => {
        const currentChecklist = get().checklist || [...mockChecklist]
        set({ checklist: currentChecklist.filter((task) => task.id !== taskId) })
      },
      updateBookingStatus: (bookingId, status) => {
        const currentBookings = get().bookings || [...mockBookings]
        set({
          bookings: currentBookings.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
        })
      },
      addBooking: (booking) => {
        const currentBookings = get().bookings || [...mockBookings]
        const platformFee = Math.round(parseInt(booking.amount.replace(/[^0-9]/g, "")) * 0.1).toLocaleString()
        const newBooking = {
          ...booking,
          platformFee: `₹${platformFee}`,
        }
        set({ bookings: [newBooking, ...currentBookings] })
      },
      addVendorListing: (listing) => {
        const currentListings = get().vendorListings || [...mockVendorListings]
        const newListing = {
          ...listing,
          id: `listing-${Date.now()}`,
          status: "Active",
        }
        set({ vendorListings: [...currentListings, newListing] })
      },
      updateVendorListing: (listingId, updates) => {
        const currentListings = get().vendorListings || [...mockVendorListings]
        set({
          vendorListings: currentListings.map((listing) =>
            listing.id === listingId ? { ...listing, ...updates } : listing,
          ),
        })
      },
      deleteVendorListing: (listingId) => {
        const currentListings = get().vendorListings || [...mockVendorListings]
        set({ vendorListings: currentListings.filter((listing) => listing.id !== listingId) })
      },
      respondToReview: (reviewId, response) => {
        const currentReviews = get().vendorReviews || [...mockVendorReviews]
        set({
          vendorReviews: currentReviews.map((review) =>
            review.id === reviewId ? { ...review, response, hasResponse: true } : review,
          ),
        })
      },
      updateUserStatus: (userId, status) => {
        const currentUsers = get().adminUsers || [...mockUsers]
        set({
          adminUsers: currentUsers.map((user) => (user.id === userId ? { ...user, status } : user)),
        })
      },
      updateVendorStatus: (vendorId, status) => {
        const currentVendors = get().adminVendors || [...mockVendors]
        set({
          adminVendors: currentVendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, status } : vendor)),
        })
      },
      updateCategoryStatus: (categoryId, status) => {
        const currentCategories = get().adminCategories || [...mockCategories]
        set({
          adminCategories: currentCategories.map((category) =>
            category.id === categoryId ? { ...category, status } : category,
          ),
        })
      },
      addCategory: (category) => {
        const currentCategories = get().adminCategories || [...mockCategories]
        const newCategory = {
          ...category,
          id: `cat-${Date.now()}`,
          vendorCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        }
        set({ adminCategories: [...currentCategories, newCategory] })
      },
      markNotificationAsRead: (notificationId) => {
        const currentNotifications = get().adminNotifications || [...mockAdminNotifications]
        set({
          adminNotifications: currentNotifications.map((notification) =>
            notification.id === notificationId ? { ...notification, status: "read" } : notification,
          ),
        })
      },
      clearAllNotifications: () => {
        const currentNotifications = get().adminNotifications || [...mockAdminNotifications]
        set({
          adminNotifications: currentNotifications.map((notification) => ({ ...notification, status: "read" })),
        })
      },
    }),
    {
      name: "wedding-bazaar-auth",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const state = JSON.parse(str);
            // Clear persisted auth state if it's stale (older than 24 hours)
            const timestamp = localStorage.getItem(`${name}:timestamp`);
            if (timestamp) {
              const staleThreshold = 24 * 60 * 60 * 1000; // 24 hours
              if (Date.now() - parseInt(timestamp) > staleThreshold) {
                localStorage.removeItem(name);
                localStorage.removeItem(`${name}:timestamp`);
                return null;
              }
            }
            return state;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
          localStorage.setItem(`${name}:timestamp`, Date.now().toString());
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
          localStorage.removeItem(`${name}:timestamp`);
        },
      },
      partialize: (state) => ({
        user: state.user,
        vendor: state.vendor,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
        isVendor: state.isVendor,
        isAdmin: state.isAdmin,
      }),
    }
  )
)

// Utility function for role-based redirects
export const getRoleBasedRedirect = (userRole: string | undefined) => {
  switch (userRole) {
    case "vendor":
      return "/vendor-dashboard";
    case "admin":
      return "/admin-dashboard";
    case "user":
      return "/dashboard";
    default:
      return "/";
  }
};

// Utility function to check if user has access to a specific route
export const hasRouteAccess = (userRole: string | undefined, requiredRole: string) => {
  return userRole === requiredRole;
};
