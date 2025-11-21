import { type Vendor } from "./types/index"

// Vendor data
export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Royal Wedding Palace",
    rating: 4.8,
    reviewsCount: 320,
    image: "/vendors/royal-palace.jpg",
    coverImage: "/vendors/royal-palace-cover.jpg",
    location: "Delhi NCR",
    experience: "12+ years",
    description: "Premier wedding venue with world-class amenities and exceptional service.",
    phone: "+91 98765 43210",
    email: "info@royalweddingpalace.com",
    featured: true,
    verified: true,
    topServices: ["Banquet Hall", "Outdoor Venue", "Catering"],
    services: [
      {
        id: "s1",
        name: "Grand Banquet Hall",
        price: 150000,
        category: "Venue",
        description: "Luxurious banquet hall with modern amenities",
        customizations: [
          {
            id: 1,
            name: "Premium Decoration",
            price: 25000,
            description: "Elegant decor with premium flowers and materials",
            required: false
          },
          {
            id: 2,
            name: "LED Wall",
            price: 15000,
            description: "High-quality LED wall for photos and videos",
            required: false
          }
        ],
        minQuantity: 1,
        maxQuantity: 1
      },
      {
        id: "s2",
        name: "Outdoor Garden",
        price: 100000,
        category: "Venue",
        description: "Beautiful garden venue for outdoor ceremonies",
        customizations: [
          {
            id: 3,
            name: "Tent Setup",
            price: 30000,
            description: "Premium tent with lighting and cooling",
            required: false
          }
        ],
        minQuantity: 1,
        maxQuantity: 1
      }
    ],
    packages: [
      {
        id: 1,
        name: "Royal Wedding Package",
        price: 250000,
        description: "Complete wedding package including venue, catering, and decor",
        services: ["s1", "s2"],
        savings: 50000
      },
      {
        id: 2,
        name: "Basic Ceremony Package",
        price: 150000,
        description: "Essential wedding services package",
        services: ["s2"],
        savings: 25000
      }
    ],
    availability: [
      {
        date: "2024-03-20",
        slots: [
          { time: "Morning (8 AM - 2 PM)", available: true },
          { time: "Evening (4 PM - 10 PM)", available: false }
        ]
      },
      {
        date: "2024-03-21",
        slots: [
          { time: "Morning (8 AM - 2 PM)", available: true },
          { time: "Evening (4 PM - 10 PM)", available: true }
        ]
      }
    ],
    refundPolicy: {
      description: "We offer a flexible refund policy based on the cancellation notice period.",
      cancellationTerms: [
        { daysBeforeEvent: 30, refundPercentage: 90 },
        { daysBeforeEvent: 15, refundPercentage: 75 },
        { daysBeforeEvent: 7, refundPercentage: 50 }
      ]
    },
    reviews: [
      {
        id: "r1",
        name: "Priya Sharma",
        rating: 5,
        comment: "Amazing venue with excellent service. The staff was very professional and helpful.",
        date: "2024-02-15"
      },
      {
        id: "r2",
        name: "Rahul Verma",
        rating: 4,
        comment: "Great experience overall. The venue is beautiful and well-maintained.",
        date: "2024-02-10"
      }
    ]
  },
  {
    id: "venue-example",
    name: "Grand Event Center",
    image: "/placeholder.svg?height=200&width=300&text=Venue",
    category: "Venue",
    location: "Delhi NCR",
    rating: 4.8,
    reviews: 124,
    price: "₹50,000",
    services: ["Indoor Space", "Outdoor Space", "Catering", "Decor"],
    region: "North India",
    city: "Delhi",
    priceRange: "₹50,000 - ₹1,00,000",
    eventTypes: ["Wedding", "Corporate", "Birthday", "Anniversary"],
    featured: true,
    verified: true,
    description: "Luxurious event center perfect for all types of celebrations",
    items: [
      { name: "Main Hall", price: "₹30,000", capacity: "300 guests" },
      { name: "Garden Area", price: "₹15,000", capacity: "200 guests" },
      { name: "VIP Lounge", price: "₹10,000", capacity: "50 guests" },
    ],
  },
  {
    id: "photographer-1",
    name: "Capture Moments",
    image: "/placeholder.svg?height=200&width=300&text=Photography",
    category: "Photography",
    location: "Mumbai",
    rating: 4.9,
    reviews: 87,
    price: "₹25,000",
    services: ["Event Photography", "Videography", "Drone Coverage"],
    region: "West India",
    city: "Mumbai",
    priceRange: "₹25,000 - ₹50,000",
    eventTypes: ["Wedding", "Birthday", "Corporate"],
    featured: true,
    verified: true,
    description: "Professional photography services for memorable moments",
    items: [
      { name: "Basic Package (4 hours)", price: "₹15,000", details: "1 photographer" },
      { name: "Standard Package (8 hours)", price: "₹25,000", details: "2 photographers" },
      { name: "Premium Package (Full day)", price: "₹40,000", details: "2 photographers + videographer" },
    ],
  },
  {
    id: "makeup-1",
    name: "Glamour Studio",
    image: "/placeholder.svg?height=200&width=300&text=Makeup",
    category: "Makeup Artist",
    location: "Bangalore",
    rating: 4.7,
    reviews: 56,
    price: "₹15,000",
    services: ["Bridal Makeup", "Party Makeup", "Hairstyling"],
    region: "South India",
    city: "Bangalore",
    priceRange: "Under ₹25,000",
    eventTypes: ["Wedding", "Party", "Fashion"],
    featured: false,
    verified: true,
    description: "Professional makeup and styling services",
    items: [
      { name: "Basic Makeup", price: "₹5,000", details: "For one person" },
      { name: "Party Makeup", price: "₹8,000", details: "For one person" },
      { name: "Bridal Package", price: "₹15,000", details: "Complete package" },
    ],
  },
  {
    id: "decor-1",
    name: "Dream Decorators",
    image: "/placeholder.svg?height=200&width=300&text=Decor",
    category: "Decoration",
    location: "Chennai",
    rating: 4.5,
    reviews: 38,
    price: "₹35,000",
    services: ["Theme Decor", "Floral Arrangements", "Lighting Setup"],
    region: "South India",
    city: "Chennai",
    priceRange: "₹25,000 - ₹50,000",
    eventTypes: ["Wedding", "Birthday", "Corporate", "Anniversary"],
    featured: false,
    verified: true,
    description: "Creative decoration solutions for every occasion",
    items: [
      { name: "Basic Decoration", price: "₹15,000", details: "Simple setup" },
      { name: "Theme Decoration", price: "₹35,000", details: "Customized theme" },
      { name: "Premium Decoration", price: "₹60,000", details: "Luxury setup" },
    ],
  },
  {
    id: "catering-1",
    name: "Royal Feast",
    image: "/placeholder.svg?height=200&width=300&text=Catering",
    category: "Catering",
    location: "Hyderabad",
    rating: 4.7,
    reviews: 64,
    price: "₹1,200",
    services: ["North Indian", "South Indian", "Continental"],
    region: "South India",
    city: "Hyderabad",
    priceRange: "₹1,000 - ₹2,000 per plate",
    eventTypes: ["Wedding", "Corporate", "Birthday", "Anniversary"],
    featured: true,
    verified: true,
    description: "Delicious catering services for all events",
    items: [
      { name: "Veg Menu", price: "₹800 per plate", details: "10 items" },
      { name: "Non-Veg Menu", price: "₹1,200 per plate", details: "12 items" },
      { name: "Premium Menu", price: "₹1,800 per plate", details: "15 items + desserts" },
    ],
  },
  {
    id: "dj-1",
    name: "Beat Masters DJ",
    image: "/placeholder.svg?height=200&width=300&text=DJ",
    category: "DJ",
    location: "Mumbai",
    rating: 4.6,
    reviews: 45,
    price: "₹35,000",
    services: ["DJ", "Live Band", "Sound System"],
    region: "West India",
    city: "Mumbai",
    priceRange: "₹25,000 - ₹50,000",
    eventTypes: ["Wedding", "Birthday", "Corporate", "Party"],
    featured: true,
    verified: true,
    description: "Professional DJ services to energize your events",
    items: [
      { name: "Basic DJ (4 hours)", price: "₹20,000", details: "1 DJ + basic equipment" },
      { name: "Premium DJ (6 hours)", price: "₹35,000", details: "1 DJ + premium equipment" },
      { name: "DJ + Live Band", price: "₹60,000", details: "Complete entertainment package" },
    ],
  },
  {
    id: "v2",
    name: "Demo Vendor V2",
    image: "/placeholder.svg?height=200&width=300&text=Vendor+V2",
    coverImage: "/placeholder.svg?height=400&width=1200&text=Vendor+V2+Cover",
    category: "Catering",
    location: "Pune",
    rating: 4.5,
    reviewsCount: 10,
    experience: "5 years",
    description: "Demo vendor for V2. Delicious catering for all occasions.",
    phone: "+91 90000 00000",
    email: "demo-v2@vendor.com",
    featured: false,
    verified: true,
    topServices: ["Buffet", "Live Counter", "Drinks"],
    services: [
      { id: "s1", name: "Buffet", price: 10000, description: "Veg & Non-Veg options", category: "Food" },
      { id: "s2", name: "Live Counter", price: 7000, description: "Pasta, Chaat, etc.", category: "Food" },
      { id: "s3", name: "Drinks", price: 3000, description: "Soft drinks and mocktails", category: "Beverage" }
    ],
    items: [
      { name: "Buffet", price: "₹10,000", details: "Veg & Non-Veg options" },
      { name: "Live Counter", price: "₹7,000", details: "Pasta, Chaat, etc." },
      { name: "Drinks", price: "₹3,000", details: "Soft drinks and mocktails" }
    ],
    packages: [
      {
        id: 1,
        name: "Full Catering Package",
        price: 18000,
        description: "Buffet + Live Counter + Drinks",
        services: ["s1", "s2", "s3"],
        savings: 2000
      }
    ],
    availability: [
      {
        date: "2024-08-01",
        slots: [
          { time: "Morning", available: true },
          { time: "Evening", available: true }
        ]
      }
    ],
    refundPolicy: {
      description: "Full refund if cancelled 7 days before event.",
      cancellationTerms: [
        { daysBeforeEvent: 7, refundPercentage: 100 },
        { daysBeforeEvent: 3, refundPercentage: 50 }
      ]
    },
    reviews: [
      {
        id: "r1",
        name: "Test User",
        rating: 5,
        comment: "Great food and service!",
        date: "2024-07-01"
      }
    ]
  },
]

// Home service packages data
export const homeServicePackages = [
  {
    id: 1,
    title: "Birthday Party Package",
    description: "Complete birthday celebration setup",
    price: "₹5,999",
    originalPrice: "₹8,999",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Decoration", "Cake", "Photography", "Entertainment"],
  },
  {
    id: 2,
    title: "Anniversary Special",
    description: "Romantic anniversary celebration",
    price: "₹7,999",
    originalPrice: "₹11,999",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Romantic Decor", "Dinner Setup", "Photography", "Music"],
  },
  {
    id: 3,
    title: "Home Decoration",
    description: "Festival and occasion decoration",
    price: "₹3,999",
    originalPrice: "₹5,999",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Theme Decoration", "Lighting", "Flowers", "Setup"],
  },
  {
    id: 4,
    title: "Corporate Event",
    description: "Professional corporate gathering",
    price: "₹15,999",
    originalPrice: "₹22,999",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Venue Setup", "Catering", "AV Equipment", "Coordination"],
  },
]

// Categories data
export const categories = [
  { name: "Venues", icon: "Building", href: "/vendors?category=Venue" },
  { name: "Photography", icon: "Camera", href: "/vendors?category=Photography" },
  { name: "Catering", icon: "Utensils", href: "/vendors?category=Catering" },
  { name: "Decoration", icon: "Palette", href: "/vendors?category=Decoration" },
  { name: "DJ/Music", icon: "Music", href: "/vendors?category=DJ" },
  { name: "Event Planning", icon: "ClipboardList", href: "/vendors?category=Event Planning" },
  { name: "Cake & Desserts", icon: "Cake", href: "/vendors?category=Cake" },
  { name: "Transportation", icon: "Car", href: "/vendors?category=Transportation" },
  { name: "Home Services", icon: "Home", href: "/vendors?category=Home Services" },
  { name: "Entertainment", icon: "PartyPopper", href: "/vendors?category=Entertainment" },
]

// Event types
export const eventTypes = [
  "Wedding",
  "Birthday",
  "Anniversary",
  "Corporate",
  "Party",
  "Conference",
  "Product Launch",
  "House Party",
  "Fashion",
  "Special Occasions",
]

// Filter options - THIS WAS MISSING
export const filterOptions = {
  regions: ["North India", "South India", "East India", "West India", "Central India", "North East"],
  cities: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Jaipur", "Lucknow", "Ahmedabad", "Pune"],
  services: [
    "Venue",
    "Catering",
    "Photography",
    "Makeup Artist",
    "Decoration",
    "DJ",
    "Event Planning",
    "Cake",
    "Florist",
    "Transportation",
    "Home Services",
    "Corporate Events",
  ],
  priceRanges: [
    "Under ₹25,000",
    "₹25,000 - ₹50,000",
    "₹50,000 - ₹1,00,000",
    "₹1,00,000 - ₹2,00,000",
    "Above ₹2,00,000",
  ],
  eventTypes: [
    "Wedding",
    "Birthday",
    "Anniversary",
    "Corporate",
    "Party",
    "Conference",
    "Product Launch",
    "House Party",
  ],
}

// Cities by region for location filtering
export const citiesByRegion = {
  "North India": ["Delhi", "Jaipur", "Lucknow", "Chandigarh", "Dehradun"],
  "South India": ["Bangalore", "Chennai", "Hyderabad", "Kochi", "Coimbatore"],
  "East India": ["Kolkata", "Bhubaneswar", "Patna", "Ranchi", "Guwahati"],
  "West India": ["Mumbai", "Ahmedabad", "Pune", "Surat", "Goa"],
  "Central India": ["Bhopal", "Indore", "Nagpur", "Raipur", "Jabalpur"],
  "North East": ["Guwahati", "Shillong", "Imphal", "Agartala", "Itanagar"],
}

// Locations for search dropdown
export const locations = [
  "Delhi NCR",
  "Delhi",
  "Noida",
  "Gurgaon",
  "Faridabad",
  "Ghaziabad",
  "Greater Noida",
  "Rohini",
  "Punjabi Bagh",
  "Uttam Nagar",
  "Dwarka",
  "Saket",
  "Lajpat Nagar",
  "Karol Bagh",
  "Janakpuri",
  "Vasant Kunj",
  "Connaught Place",
  "Pitampura",
  "Preet Vihar",
  "Mayur Vihar",
  "Rajouri Garden",
  "Hauz Khas",
  "Chandni Chowk",
  "Okhla",
  "Shahdara",
  "Nehru Place",
  "Greater Kailash",
  "South Extension",
  "Malviya Nagar",
  "Ashok Vihar",
  "Paschim Vihar",
  "Model Town",
  "Dwarka Mor",
  "Azadpur",
  "Jangpura",
  "Tilak Nagar",
  "Kalkaji",
  "Sarita Vihar",
  "Patel Nagar",
  "Moti Nagar",
  "Shalimar Bagh",
  "Vikaspuri",
  "Laxmi Nagar",
  "Yamuna Vihar",
  "Seelampur",
  "Sadar Bazaar",
  "Civil Lines",
  "Narela",
  "Najafgarh",
  "Mehrauli",
  "Sultanpur",
  "Tughlakabad",
  "Mandawali",
  "Keshav Puram",
  "Ramesh Nagar",
  "Rithala",
  "Jahangirpuri",
  "Badarpur",
  "Munirka",
  "Vasant Vihar",
  "Green Park",
  "Adarsh Nagar",
  "GTB Nagar",
  "Kashmere Gate",
  "Sarai Rohilla",
  "Sonia Vihar",
  "Trilokpuri",
  "Govindpuri",
  "Sangam Vihar",
  "Jasola",
  "Dwarka Sector 21",
  "Dwarka Sector 12",
  "Dwarka Sector 10",
  "Dwarka Sector 7",
  "Dwarka Sector 6",
  "Dwarka Sector 5",
  "Dwarka Sector 3",
  "Dwarka Sector 1",
]

// Testimonials
export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    event: "Birthday Party",
    rating: 5,
    comment:
      "Blissmet made planning my daughter's birthday party so easy! The vendors were professional and the service was excellent.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    event: "Corporate Event",
    rating: 5,
    comment: "Outstanding service for our company's annual event. Everything was perfectly organized and executed.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Anita Patel",
    event: "Anniversary Celebration",
    rating: 5,
    comment: "The decoration and photography services exceeded our expectations. Highly recommended!",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "Vikram Singh",
    event: "Wedding",
    rating: 5,
    comment: "Found amazing vendors for our wedding. The platform made everything so convenient!",
    image: "/placeholder.svg?height=60&width=60",
  },
]

// Popular searches
export const popularSearches = [
  "Birthday party venues",
  "Wedding photographers",
  "Corporate event planners",
  "Anniversary decoration",
  "Catering services",
  "DJ for party",
  "Cake delivery",
]

// Recent searches (demo)
export const recentSearches = ["Venues in Mumbai", "Birthday decorators", "Event planners", "Catering near me"]
