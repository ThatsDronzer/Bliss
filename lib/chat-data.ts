export const demoUser = {
  name: "Ananya Sharma",
  coins: 150,
  bookings: [
    {
      service: "Venue",
      vendor: "Royal Garden Lawn",
      date: "2025-07-10",
      location: "Delhi",
      price: 45000
    }
  ]
};

interface VenueVendor {
  name: string;
  price: number;
  rating: number;
  capacity: string;
  type: 'venue';
}

interface CateringVendor {
  name: string;
  price: number;
  rating: number;
  priceUnit: string;
  type: 'catering';
}

interface DecorationVendor {
  name: string;
  price: number;
  rating: number;
  style: string;
  type: 'decoration';
}

type Vendor = VenueVendor | CateringVendor | DecorationVendor;

export const vendorData: Record<string, Record<string, Vendor[]>> = {
  delhi: {
    venue: [
      { name: "Grand Sapphire Hall", price: 30000, rating: 4.8, capacity: "300-500", type: 'venue' },
      { name: "Royal Garden Lawn", price: 45000, rating: 4.9, capacity: "500-800", type: 'venue' },
      { name: "The Sky Banquet", price: 25000, rating: 4.7, capacity: "200-300", type: 'venue' }
    ],
    catering: [
      { name: "Royal Cuisine", price: 1200, rating: 4.8, priceUnit: "per plate", type: 'catering' },
      { name: "Flavor Fusion", price: 1500, rating: 4.9, priceUnit: "per plate", type: 'catering' },
      { name: "Delhi Delights", price: 1000, rating: 4.7, priceUnit: "per plate", type: 'catering' }
    ],
    decoration: [
      { name: "Dream Decor", price: 35000, rating: 4.8, style: "Modern", type: 'decoration' },
      { name: "Floral Fantasy", price: 45000, rating: 4.9, style: "Traditional", type: 'decoration' },
      { name: "Creative Events", price: 30000, rating: 4.7, style: "Contemporary", type: 'decoration' }
    ]
  },
  mumbai: {
    venue: [
      { name: "Sea Pearl Banquet", price: 40000, rating: 4.8, capacity: "400-600", type: 'venue' },
      { name: "Sunset Bay Hall", price: 55000, rating: 4.9, capacity: "600-1000", type: 'venue' },
      { name: "Urban Celebration", price: 35000, rating: 4.7, capacity: "300-400", type: 'venue' }
    ],
    catering: [
      { name: "Spice & Serve", price: 1500, rating: 4.8, priceUnit: "per plate", type: 'catering' },
      { name: "Feast Delight", price: 1800, rating: 4.9, priceUnit: "per plate", type: 'catering' },
      { name: "Urban Food Craft", price: 1300, rating: 4.7, priceUnit: "per plate", type: 'catering' }
    ],
    decoration: [
      { name: "Mumbai Moments", price: 40000, rating: 4.8, style: "Modern", type: 'decoration' },
      { name: "Elegant Affairs", price: 50000, rating: 4.9, style: "Luxury", type: 'decoration' },
      { name: "Creative Canvas", price: 35000, rating: 4.7, style: "Theme-based", type: 'decoration' }
    ]
  }
};

export const coinRules = {
  conversionRate: 1, // 1 coin = ₹1
  maxRedeemPercentage: 20,
  earnPercentage: 5,
  expiryMonths: 6
};

export const helpArticles = {
  coinSystem: {
    title: "How Coins Work",
    content: `
      • Earn 5% of booking value as coins
      • 1 Coin = ₹1 discount
      • Use up to 20% of booking value
      • Coins expire after 6 months
      • Awarded after successful booking
    `
  },
  bookingGuide: {
    title: "How to Book a Service",
    content: `
      • Browse vendors by city and category
      • Compare prices and reviews
      • Check venue capacity or service details
      • Select your preferred date
      • Apply available coins for discount
      • Complete secure payment
      • Receive instant confirmation
    `
  },
  eventPlanning: {
    title: "Event Planning Tips",
    content: `
      • Book venue 4-6 months in advance
      • Finalize catering 2-3 months before
      • Book decoration 2 months prior
      • Confirm guest count 1 month before
      • Schedule menu tasting
      • Plan layout and seating
      • Create event timeline
    `
  },
  services: {
    title: "Our Services",
    content: `
      • Venues (Banquet Halls, Gardens, Hotels)
      • Catering (Multi-cuisine, Specialized)
      • Decoration (Modern, Traditional, Themed)
      • Photography & Videography
      • Entertainment & Music
      • Invitations & Favors
      • Event Planning & Coordination
    `
  },
  cancellationPolicy: {
    title: "Cancellation & Refunds",
    content: `
      • Free cancellation 30 days before
      • 50% refund within 15-29 days
      • No refund within 14 days
      • Coins refunded for eligible cancellations
      • Vendor-specific policies may apply
    `
  }
};

export const packages = {
  basic: {
    name: "Basic Celebration",
    price: 99999,
    includes: [
      "Standard Venue (4 hours)",
      "Basic Decor",
      "Catering (100 people)",
      "Basic Photography"
    ],
    bestFor: "Small gatherings & intimate celebrations"
  },
  premium: {
    name: "Premium Celebration",
    price: 199999,
    includes: [
      "Premium Venue (6 hours)",
      "Themed Decor",
      "Catering (200 people)",
      "Photo & Video Coverage",
      "Basic Entertainment"
    ],
    bestFor: "Medium-sized events & corporate functions"
  },
  luxury: {
    name: "Luxury Celebration",
    price: 499999,
    includes: [
      "Luxury Venue (8 hours)",
      "Premium Decor with Flowers",
      "Premium Catering (300 people)",
      "Complete Media Coverage",
      "Entertainment & DJ",
      "Event Coordinator"
    ],
    bestFor: "Large events & premium celebrations"
  }
};

export const budgetCategories = {
  economic: {
    range: "Under ₹1,00,000",
    venues: ["Community Halls", "Small Banquets"],
    catering: "Basic Buffet (₹800-1000/plate)",
    decoration: "Essential Decor Package"
  },
  standard: {
    range: "₹1,00,000 - ₹3,00,000",
    venues: ["Standard Banquets", "Garden Venues"],
    catering: "Standard Buffet (₹1000-1500/plate)",
    decoration: "Standard Decor with Themes"
  },
  premium: {
    range: "₹3,00,000 - ₹7,00,000",
    venues: ["Premium Hotels", "Resort Venues"],
    catering: "Premium Buffet (₹1500-2000/plate)",
    decoration: "Premium Decor with Flowers"
  },
  luxury: {
    range: "Above ₹7,00,000",
    venues: ["5-Star Hotels", "Luxury Resorts"],
    catering: "Luxury Dining (₹2000+/plate)",
    decoration: "Luxury Decor with Designer Themes"
  }
};

export const trendingDeals = [
  {
    title: "Monsoon Wedding Package",
    description: "Special package for monsoon season weddings with indoor venue and rain backup",
    discount: "15% off on venue booking",
    validTill: "September 30, 2024"
  },
  {
    title: "Weekend Special",
    description: "Complete weekend event package with stay arrangements",
    discount: "10% off on total package",
    validTill: "December 31, 2024"
  },
  {
    title: "Early Bird Booking",
    description: "Book 6 months in advance and get special benefits",
    discount: "Extra 1000 reward coins",
    validTill: "Ongoing"
  }
];

export const quickResponses = {
  budget: [
    "What's your approximate budget range?",
    "Would you prefer economic, standard, premium, or luxury options?",
    "How many guests are you expecting?"
  ],
  date: [
    "When are you planning to host the event?",
    "Is your event date flexible?",
    "Would you consider off-season dates for better rates?"
  ],
  preferences: [
    "Do you have any specific theme in mind?",
    "Any particular cuisine preferences?",
    "Would you need accommodation arrangements?"
  ]
};

export const supportedLanguages = [
  {
    code: "en",
    name: "English",
    greeting: "How can I help you today?"
  },
  {
    code: "hi",
    name: "Hindi",
    greeting: "में आपकी कैसे मदद कर सकता हूं?"
  }
]; 