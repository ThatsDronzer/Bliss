export interface EventType {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
}

export interface EventTheme {
  id: string;
  eventTypeId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  vendorName: string;
  location: string;
  features: string[];
  inclusions: string[];
  exclusions?: string[];
  setupTime: string;
  duration: string;
  guestCapacity: string;
  tags?: string[];
}

export const eventTypes: EventType[] = [
  {
    id: "birthday",
    name: "Birthday",
    slug: "birthday-special-decorations",
    description: "Make your birthday celebration unforgettable with stunning decorations",
    image: "/placeholder.svg?height=300&width=400&text=Birthday",
    icon: "🎂"
  },
  {
    id: "baby-shower",
    name: "Baby Shower",
    slug: "baby-shower-decorations",
    description: "Celebrate the upcoming arrival with beautiful themed decorations",
    image: "/placeholder.svg?height=300&width=400&text=Baby+Shower",
    icon: "👶"
  },
  {
    id: "candlelight-dinner",
    name: "Candlelight Dinner",
    slug: "candlelight-dinner-setup",
    description: "Create a romantic ambiance with our elegant dinner setups",
    image: "/placeholder.svg?height=300&width=400&text=Candlelight",
    icon: "🕯️"
  },
  {
    id: "baby-welcome",
    name: "Baby Welcome",
    slug: "baby-welcome-decorations",
    description: "Welcome your newborn with adorable decorations",
    image: "/placeholder.svg?height=300&width=400&text=Baby+Welcome",
    icon: "🍼"
  },
  {
    id: "anniversary",
    name: "Anniversary",
    slug: "anniversary-decorations",
    description: "Celebrate your love story with romantic anniversary decorations",
    image: "/placeholder.svg?height=300&width=400&text=Anniversary",
    icon: "💑"
  },
  {
    id: "proposal",
    name: "Proposal",
    slug: "proposal-decorations",
    description: "Make your proposal moment magical with stunning setups",
    image: "/placeholder.svg?height=300&width=400&text=Proposal",
    icon: "💍"
  },
  {
    id: "housewarming",
    name: "Housewarming",
    slug: "housewarming-decorations",
    description: "Welcome guests to your new home with beautiful decorations",
    image: "/placeholder.svg?height=300&width=400&text=Housewarming",
    icon: "🏠"
  },
  {
    id: "festivals",
    name: "Festivals",
    slug: "festival-decorations",
    description: "Celebrate festivals with traditional and modern decorations",
    image: "/placeholder.svg?height=300&width=400&text=Festivals",
    icon: "🎊"
  }
];

export const eventThemes: EventTheme[] = [
  // Birthday Themes
  {
    id: "pastel-rosegold-birthday",
    eventTypeId: "birthday",
    name: "Pastel and Rosegold Birthday Decor",
    slug: "pastel-and-rosegold-birthday-decor",
    description: "An Exquisite Pastel Rose Gold Birthday Decor to Book for your Close Ones",
    shortDescription: "Elegant pastel and rose gold themed birthday decoration",
    price: 2499,
    originalPrice: 2799,
    rating: 4.8,
    reviewCount: 685,
    images: [
      "/placeholder.svg?height=400&width=600&text=Pastel+Birthday+1",
      "/placeholder.svg?height=400&width=600&text=Pastel+Birthday+2",
      "/placeholder.svg?height=400&width=600&text=Pastel+Birthday+3",
      "/placeholder.svg?height=400&width=600&text=Pastel+Birthday+4"
    ],
    vendorName: "Bliss Decorations",
    location: "Delhi NCR",
    features: [
      "Pastel & Rose Gold Balloons",
      "Happy Birthday Foil Balloons",
      "Fairy Lights",
      "Customized Name Banner",
      "Photo Props"
    ],
    inclusions: [
      "Setup and Installation",
      "Balloon Arrangements",
      "Backdrop Setup",
      "Fairy Light Decoration",
      "Cleanup After Event"
    ],
    exclusions: [
      "Cake and Food",
      "Photography Services",
      "Additional Customizations"
    ],
    setupTime: "2-3 hours",
    duration: "Full Day",
    guestCapacity: "Up to 30 guests",
    tags: ["Trending", "Popular"]
  },
  {
    id: "fairy-lights-lantern",
    eventTypeId: "birthday",
    name: "Fairy Lights and Lantern Surprise",
    slug: "fairy-lights-and-lantern-surprise",
    description: "Create a magical ambiance with fairy lights and elegant lanterns",
    shortDescription: "Magical fairy lights and lantern decoration",
    price: 2299,
    rating: 4.5,
    reviewCount: 854,
    images: [
      "/placeholder.svg?height=400&width=600&text=Fairy+Lights+1",
      "/placeholder.svg?height=400&width=600&text=Fairy+Lights+2"
    ],
    vendorName: "Bliss Decorations",
    location: "Delhi NCR",
    features: [
      "Fairy Light Canopy",
      "Paper Lanterns",
      "LED String Lights",
      "Ambient Lighting"
    ],
    inclusions: [
      "Complete Setup",
      "Lighting Installation",
      "Lantern Arrangements",
      "Cleanup Service"
    ],
    setupTime: "2-3 hours",
    duration: "Full Day",
    guestCapacity: "Up to 25 guests"
  },
  {
    id: "golden-black-birthday",
    eventTypeId: "birthday",
    name: "Classy Silver and Black Birthday Decor",
    slug: "classy-silver-and-black-birthday-decor",
    description: "Sophisticated black and silver themed birthday decoration",
    shortDescription: "Elegant black and silver birthday setup",
    price: 1999,
    rating: 4.4,
    reviewCount: 608,
    images: [
      "/placeholder.svg?height=400&width=600&text=Black+Silver+1",
      "/placeholder.svg?height=400&width=600&text=Black+Silver+2"
    ],
    vendorName: "Bliss Decorations",
    location: "Delhi NCR",
    features: [
      "Black & Silver Balloons",
      "Metallic Backdrop",
      "LED Lights",
      "Happy Birthday Banner"
    ],
    inclusions: [
      "Full Setup",
      "Balloon Decoration",
      "Backdrop Installation",
      "Cleanup"
    ],
    setupTime: "2 hours",
    duration: "Full Day",
    guestCapacity: "Up to 30 guests"
  },
  {
    id: "golden-sparkle-bouquet",
    eventTypeId: "birthday",
    name: "Golden Sparkle Balloon Bouquet",
    slug: "golden-sparkle-balloon-bouquet",
    description: "Stunning golden sparkle balloon arrangements",
    shortDescription: "Premium golden balloon bouquet decoration",
    price: 1399,
    rating: 4.4,
    reviewCount: 10,
    images: [
      "/placeholder.svg?height=400&width=600&text=Golden+Bouquet+1"
    ],
    vendorName: "Bliss Decorations",
    location: "Delhi NCR",
    features: [
      "Golden Confetti Balloons",
      "LED Balloon Stand",
      "Sparkle Effect",
      "Premium Quality Balloons"
    ],
    inclusions: [
      "Balloon Bouquet Setup",
      "LED Stand",
      "Delivery & Installation"
    ],
    setupTime: "1 hour",
    duration: "Full Day",
    guestCapacity: "Any"
  },
  // Candlelight Dinner Themes
  {
    id: "romantic-candlelight-setup",
    eventTypeId: "candlelight-dinner",
    name: "Romantic Candlelight Dinner Setup",
    slug: "romantic-candlelight-dinner-setup",
    description: "Create an intimate and romantic atmosphere with candles and flowers",
    shortDescription: "Intimate candlelight dinner with floral decorations",
    price: 3499,
    originalPrice: 3999,
    rating: 4.9,
    reviewCount: 342,
    images: [
      "/placeholder.svg?height=400&width=600&text=Candlelight+1",
      "/placeholder.svg?height=400&width=600&text=Candlelight+2"
    ],
    vendorName: "Bliss Decorations",
    location: "Delhi NCR",
    features: [
      "Candle Arrangements",
      "Rose Petals Pathway",
      "Fairy Lights",
      "Table Decoration",
      "Flower Arrangements"
    ],
    inclusions: [
      "Complete Setup",
      "Candles & Holders",
      "Fresh Flowers",
      "Table Setting",
      "Cleanup Service"
    ],
    setupTime: "2 hours",
    duration: "4 hours",
    guestCapacity: "2 guests"
  },
  // Baby Shower Themes
  {
    id: "pastel-baby-shower",
    eventTypeId: "baby-shower",
    name: "Pastel Dreams Baby Shower",
    slug: "pastel-dreams-baby-shower",
    description: "Soft pastel themed baby shower decoration",
    shortDescription: "Dreamy pastel baby shower setup",
    price: 3999,
    rating: 4.7,
    reviewCount: 234,
    images: [
      "/placeholder.svg?height=400&width=600&text=Baby+Shower+1"
    ],
    vendorName: "Bliss Decorations",
    location: "Delhi NCR",
    features: [
      "Pastel Balloon Arch",
      "Baby Shower Banner",
      "Photo Booth Props",
      "Table Decorations"
    ],
    inclusions: [
      "Full Setup",
      "Balloon Decorations",
      "Props & Banners",
      "Cleanup"
    ],
    setupTime: "3 hours",
    duration: "Full Day",
    guestCapacity: "Up to 40 guests"
  }
];
