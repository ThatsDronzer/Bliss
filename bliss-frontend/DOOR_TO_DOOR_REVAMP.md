# Door-to-Door Services Revamp

## Overview
The door-to-door section has been completely revamped to follow the CherishX.com flow with a three-level navigation structure:

1. **Event Types** → 2. **Themes/Experiences** → 3. **Booking Page**

## New Structure

### 1. Event Types Page (`/home-service/events`)
- Displays all available event categories (Birthday, Baby Shower, Candlelight Dinner, etc.)
- Each event type shows an icon, name, description, and image
- Clicking on an event type navigates to its themes page

### 2. Event Themes Page (`/home-service/events/[eventType]`)
- Shows all decoration themes available for the selected event type
- Displays theme cards with:
  - Images
  - Pricing (with discounts)
  - Ratings and reviews
  - Location
  - Tags (Trending, Popular, etc.)
- Clicking on a theme navigates to the booking page

### 3. Experience/Booking Page (`/home-service/experience/[experienceId]/[location]/[slug]`)
- Detailed view of the selected decoration theme
- Features:
  - Image gallery with navigation
  - Pricing information
  - Event details (duration, capacity, setup time)
  - Tabs for Overview, Inclusions, and Reviews
  - Sticky booking card with:
    - Pincode input
    - Date & time selector
    - Book Now button
    - Trust indicators

## Files Created

### Data Layer
- `bliss-frontend/lib/data/event-types.ts` - Event types and themes data

### Pages
- `bliss-frontend/app/home-service/events/page.tsx` - Event types listing
- `bliss-frontend/app/home-service/events/[eventType]/page.tsx` - Themes for specific event
- `bliss-frontend/app/home-service/experience/[experienceId]/[location]/[slug]/page.tsx` - Booking page

### Components
- `bliss-frontend/components/home-service/EventTypesPreview.tsx` - Preview component for home page

## Files Modified
- `bliss-frontend/app/home-service/page.tsx` - Updated to show event types preview instead of old service cards

## Sample Data Included
- 8 event types (Birthday, Baby Shower, Candlelight Dinner, Baby Welcome, Anniversary, Proposal, Housewarming, Festivals)
- 6 decoration themes with full details (pricing, features, inclusions, etc.)

## Features
- Responsive design for mobile and desktop
- Image galleries with navigation
- Rating and review display
- Price comparison (original vs discounted)
- Location-based filtering
- Tags for trending/popular items
- Sticky booking card
- Breadcrumb navigation
- Trust indicators (verified professionals, quality assured, etc.)

## Next Steps
To fully implement this:
1. Add more event themes to the data file
2. Connect booking form to backend API
3. Add actual images to replace placeholders
4. Implement pincode validation
5. Add payment integration
6. Implement review system
