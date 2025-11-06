# Bliss - Event Management Platform

A modern event management platform built with Next.js 15, Clerk authentication, and MongoDB.

## Features

- 🔐 **Authentication**: Clerk integration with Google login
- 🗄️ **Database**: MongoDB Atlas integration
- 🎨 **UI**: Modern design with Tailwind CSS and shadcn/ui
- 📱 **Responsive**: Mobile-first design
- 🚀 **Deployment**: Vercel-ready configuration

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: Clerk
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables
4. Run development server: `pnpm dev`

## Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

## API Endpoints

- `/api/test` - MongoDB connection test
- `/api/rental` - Rental items with filtering
- `/api/user/create` - User creation in MongoDB
- `/api/webhooks/clerk` - Clerk webhook handler

## Deployment

This project is configured for Vercel deployment with:
- Updated `pnpm-lock.yaml`
- `vercel.json` configuration
- Environment variable setup 