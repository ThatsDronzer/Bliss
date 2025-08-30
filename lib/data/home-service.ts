export const serviceCategories = [
  { id: "tent", name: "Tent & Marquee" },
  { id: "decor", name: "Decor" },
  { id: "lighting", name: "Lighting" },
  { id: "dj", name: "DJ & Sound" },
  { id: "furniture", name: "Furniture" },
  { id: "catering", name: "Catering" },
];

export const homeServiceCategories = [
  { id: "all", name: "All Services" },
  { id: "decoration", name: "Home Decoration", icon: "Palette" },
  { id: "party", name: "Party Arrangements", icon: "PartyPopper" },
  { id: "dj", name: "DJ Services", icon: "Music" },
  { id: "cleaning", name: "Cleaning", icon: "Sparkles" },
  { id: "catering", name: "Catering", icon: "UtensilsCrossed" },
  { id: "maintenance", name: "Maintenance", icon: "Wrench" },
];

export const homeServices = [
  {
    id: "small-party",
    name: "Small Party Arrangement",
    description: "Perfect setup for intimate gatherings of up to 20 people",
    price: 4999,
    discountedPrice: 3999,
    rating: 4.8,
    reviews: 128,
    image: "/placeholder.svg?height=200&width=300&text=Small+Party",
    category: "party",
    duration: "4-6 hours",
    locations: ["mumbai", "delhi", "bangalore"],
    featured: true,
    tags: ["trending", "popular"]
  },
  {
    id: "home-decoration",
    name: "Home Decoration Service",
    description: "Professional decoration services for your home",
    price: 3499,
    rating: 4.7,
    reviews: 94,
    image: "/placeholder.svg?height=200&width=300&text=Home+Decoration",
    category: "decoration",
    duration: "3-5 hours",
    locations: ["mumbai", "delhi", "bangalore", "hyderabad"],
    tags: ["bestseller"]
  },
  {
    id: "home-dj",
    name: "Home DJ Service",
    description: "Professional DJ setup with sound system for your home party",
    price: 5999,
    discountedPrice: 4999,
    rating: 4.9,
    reviews: 76,
    image: "/placeholder.svg?height=200&width=300&text=Home+DJ",
    category: "dj",
    duration: "4-8 hours",
    locations: ["mumbai", "delhi", "bangalore"],
    featured: true
  },
  {
    id: "catering",
    name: "Premium Catering Service",
    description: "Gourmet food catering for home events",
    price: 7999,
    rating: 4.6,
    reviews: 112,
    image: "/placeholder.svg?height=200&width=300&text=Catering",
    category: "catering",
    duration: "Flexible",
    locations: ["mumbai", "delhi", "bangalore", "hyderabad", "chennai"],
  },
  {
    id: "cleaning",
    name: "Deep Cleaning Service",
    description: "Professional deep cleaning for your entire home",
    price: 2499,
    rating: 4.5,
    reviews: 203,
    image: "/placeholder.svg?height=200&width=300&text=Cleaning",
    category: "cleaning",
    duration: "3-6 hours",
    locations: ["mumbai", "delhi", "bangalore", "hyderabad", "chennai", "kolkata"],
  },
  {
    id: "maintenance",
    name: "Home Maintenance",
    description: "General repairs and maintenance for your home",
    price: 1999,
    rating: 4.4,
    reviews: 87,
    image: "/placeholder.svg?height=200&width=300&text=Maintenance",
    category: "maintenance",
    duration: "2-4 hours",
    locations: ["mumbai", "delhi", "bangalore"],
  },
  {
    id: "birthday-decoration",
    name: "Birthday Party Decoration",
    description: "Special decoration for birthday parties at home",
    price: 3499,
    discountedPrice: 2999,
    rating: 4.7,
    reviews: 156,
    image: "/placeholder.svg?height=200&width=300&text=Birthday",
    category: "party",
    duration: "2-3 hours setup",
    locations: ["mumbai", "delhi", "bangalore", "hyderabad", "chennai"],
    featured: true
  },
  {
    id: "festival-decoration",
    name: "Festival Decoration",
    description: "Cultural and festival-specific home decoration",
    price: 4999,
    rating: 4.8,
    reviews: 92,
    image: "/placeholder.svg?height=200&width=300&text=Festival",
    category: "decoration",
    duration: "3-5 hours",
    locations: ["mumbai", "delhi", "bangalore", "hyderabad", "chennai", "kolkata"],
  }
];

export const occasionCategories = [
  { id: "featured", name: "Featured" },
  { id: "personal", name: "Personal Celebrations" },
  { id: "corporate", name: "Corporate Events" },
  { id: "religious", name: "Religious Events" },
  { id: "social", name: "Social Gatherings" }
];

export const occasionPackages = [
  // Featured Packages
  {
    id: "anniversary",
    title: "Anniversary Celebration",
    description: "Make your special day memorable with our romantic setup",
    image: "/placeholder.svg?height=200&width=300&text=Anniversary",
    price: "₹15,999",
    category: "featured",
    features: [
      "Romantic Dinner Setup",
      "Floral Decorations",
      "Mood Lighting",
      "Background Music",
      "Professional Photography",
      "Cake & Champagne"
    ]
  },
  {
    id: "birthday",
    title: "Birthday Bash",
    description: "Perfect party setup for birthdays of all ages",
    image: "/placeholder.svg?height=200&width=300&text=Birthday",
    price: "₹12,999",
    category: "featured",
    features: [
      "Theme Decorations",
      "Balloon Arrangements",
      "Sound System",
      "Party Games Setup",
      "Cake Table Decor",
      "Basic Catering"
    ]
  },
  {
    id: "housewarming",
    title: "Housewarming Party",
    description: "Welcome guests to your new home in style",
    image: "/placeholder.svg?height=200&width=300&text=Housewarming",
    price: "₹18,999",
    category: "personal",
    features: [
      "Home Decoration",
      "Traditional Setup",
      "Seating Arrangement",
      "Catering Service",
      "Welcome Area Setup",
      "Pooja Arrangements"
    ]
  },
  {
    id: "babyshower",
    title: "Baby Shower",
    description: "Celebrate the upcoming arrival with a beautiful setup",
    image: "/placeholder.svg?height=200&width=300&text=BabyShower",
    price: "₹16,999",
    category: "personal",
    features: [
      "Theme Based Decor",
      "Photo Booth",
      "Games Corner",
      "Gift Table Setup",
      "Customized Backdrop",
      "Light Refreshments"
    ]
  },
  // Corporate Events
  {
    id: "corporate-meeting",
    title: "Corporate Meeting",
    description: "Professional setup for business meetings and conferences",
    image: "/placeholder.svg?height=200&width=300&text=Corporate",
    price: "₹25,999",
    category: "corporate",
    features: [
      "Conference Room Setup",
      "Audio-Visual Equipment",
      "Presentation Facilities",
      "Coffee Break Service",
      "Business Lunch",
      "Technical Support"
    ]
  },
  {
    id: "product-launch",
    title: "Product Launch Event",
    description: "Impressive setup for product launches and demonstrations",
    image: "/placeholder.svg?height=200&width=300&text=Launch",
    price: "₹45,999",
    category: "corporate",
    features: [
      "Stage & Backdrop",
      "Product Display Area",
      "LED Screens",
      "Sound System",
      "Photography & Videography",
      "Full Catering Service"
    ]
  },
  // Religious Events
  {
    id: "puja-ceremony",
    title: "Puja Ceremony",
    description: "Traditional setup for religious ceremonies",
    image: "/placeholder.svg?height=200&width=300&text=Puja",
    price: "₹8,999",
    category: "religious",
    features: [
      "Puja Mandap Setup",
      "Traditional Decorations",
      "Flower Arrangements",
      "Seating Area",
      "Prasad Counter",
      "Basic Sound System"
    ]
  },
  {
    id: "satyanarayan-puja",
    title: "Satyanarayan Puja",
    description: "Complete arrangement for Satyanarayan Puja",
    image: "/placeholder.svg?height=200&width=300&text=Satyanarayan",
    price: "₹11,999",
    category: "religious",
    features: [
      "Puja Samagri",
      "Pandit Ji",
      "Decoration",
      "Sound System",
      "Prasad Distribution",
      "Seating Arrangement"
    ]
  },
  // Social Gatherings
  {
    id: "cocktail-party",
    title: "Cocktail Party",
    description: "Elegant setup for cocktail parties and social gatherings",
    image: "/placeholder.svg?height=200&width=300&text=Cocktail",
    price: "₹35,999",
    category: "social",
    features: [
      "Bar Setup",
      "Lounge Furniture",
      "Mood Lighting",
      "DJ & Sound",
      "Appetizers Service",
      "Bartender Service"
    ]
  },
  {
    id: "reunion",
    title: "Reunion Party",
    description: "Perfect setup for school/college reunions",
    image: "/placeholder.svg?height=200&width=300&text=Reunion",
    price: "₹28,999",
    category: "social",
    features: [
      "Theme Based Decor",
      "Photo Wall",
      "Games & Activities",
      "DJ & Dance Floor",
      "Full Catering",
      "Photography Service"
    ]
  }
];

export const howItWorks = [
  {
    icon: "Search",
    title: "Choose Your Package",
    description: "Browse through our curated packages or customize one according to your needs"
  },
  {
    icon: "Clock",
    title: "Schedule Service",
    description: "Pick your preferred date and time for the service"
  },
  {
    icon: "Users",
    title: "Expert Assignment",
    description: "We assign verified professionals to handle your event"
  },
  {
    icon: "CheckCircle",
    title: "Service Delivery",
    description: "Enjoy professional service delivery with attention to detail"
  }
];

export const qualityProcess = [
  {
    step: 1,
    title: "Provider Verification",
    description: "Background checks and document verification of all service providers"
  },
  {
    step: 2,
    title: "Training & Standards",
    description: "Regular training sessions and quality standard assessments"
  },
  {
    step: 3,
    title: "Service Monitoring",
    description: "Real-time tracking and quality checks during service delivery"
  },
  {
    step: 4,
    title: "Feedback Collection",
    description: "Customer feedback and satisfaction surveys after every service"
  }
];

export const trustFeatures = [
  {
    icon: "Shield",
    title: "Verified Professionals",
    description: "All our service providers undergo strict verification and quality checks",
    color: "blue"
  },
  {
    icon: "Star",
    title: "Quality Assurance",
    description: "We monitor service quality and collect customer feedback for continuous improvement",
    color: "green"
  },
  {
    icon: "Phone",
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to assist you",
    color: "purple"
  }
]; 