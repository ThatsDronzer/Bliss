# Bliss Backend API

Backend API service for Bliss event management platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Fill in environment variables in `.env`

4. Run development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## API Endpoints

### User Routes
- `GET /api/user/:id` - Get user by Clerk ID
- `PUT /api/user/:id` - Update user (authenticated)
- `POST /api/user/create` - Create or update user (authenticated)
- `GET /api/user/booking-requests` - Get user's booking requests (authenticated)

## Architecture

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic layer
- **Models**: Mongoose schemas
- **Routes**: Express route definitions
- **Middleware**: Authentication, error handling, validation

## Environment Variables

See `.env.example` for required environment variables.

