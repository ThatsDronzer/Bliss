export interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  customizations?: ServiceCustomization[];
  minQuantity?: number;
  maxQuantity?: number;
}

export interface ServiceCustomization {
  id: number;
  name: string;
  price: number;
  description: string;
  required: boolean;
}

export interface Package {
  id: number;
  name: string;
  price: number;
  description: string;
  services: number[]; // Array of service IDs included in the package
  savings: number; // Amount saved compared to booking services individually
}

export interface Availability {
  date: string;
  slots: {
    time: string;
    available: boolean;
  }[];
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface VendorDetails {
  id: string;
  name: string;
  location: string;
  rating: number;
  coverImage: string;
  description: string;
  shortDescription: string;
  category: string;
  services: Service[];
  packages: Package[];
  gallery: string[];
  reviews: Review[];
  availability: Availability[];
  refundPolicy: {
    description: string;
    cancellationTerms: {
      daysBeforeEvent: number;
      refundPercentage: number;
    }[];
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  businessHours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

export const mockVendorData: VendorDetails = {
  id: "venue-example",
  name: "Elite Event Experts",
  location: "Delhi",
  rating: 4.6,
  category: "Event Management",
  coverImage: "/images/vendors/elite-events-cover.jpg",
  description: "We provide premium event management services tailored to weddings and parties. With over 10 years of experience in the industry, we specialize in creating unforgettable moments through our comprehensive range of services. Our team of professionals ensures that every detail is perfect for your special day.",
  shortDescription: "Premium event management services for weddings and parties with a decade of excellence.",
  services: [
    {
      id: 1,
      name: "DJ",
      price: 8000,
      description: "Professional DJ with modern equipment and extensive music library for all genres.",
      customizations: [
        {
          id: 1,
          name: "Additional Speaker Set",
          price: 2000,
          description: "Extra speakers for larger venues",
          required: false
        },
        {
          id: 2,
          name: "Karaoke Setup",
          price: 1500,
          description: "Complete karaoke system with song library",
          required: false
        }
      ],
      minQuantity: 1,
      maxQuantity: 1
    },
    {
      id: 2,
      name: "Tent Setup",
      price: 12000,
      description: "Elegant tent setup with premium decorations, lights, and comfortable seating arrangements.",
      customizations: [
        {
          id: 3,
          name: "Premium Fabric Upgrade",
          price: 3000,
          description: "Upgrade to premium quality fabric",
          required: false
        },
        {
          id: 4,
          name: "Additional Seating (50 chairs)",
          price: 2500,
          description: "Extra seating arrangement",
          required: false
        }
      ],
      minQuantity: 1,
      maxQuantity: 5
    },
    { id: 3, name: "Sound System", price: 6000, description: "High-quality audio setup with wireless microphones and speakers for crystal clear sound." },
    { id: 4, name: "Lighting", price: 4000, description: "Ambient lighting solutions for indoor and outdoor events with mood lighting options." },
    { id: 5, name: "Stage Decoration", price: 15000, description: "Custom stage design and decoration with premium flowers and materials." }
  ],
  packages: [
    {
      id: 1,
      name: "Complete Event Package",
      price: 25000,
      description: "Complete setup including DJ, tent, sound system, and basic lighting",
      services: [1, 2, 3, 4],
      savings: 5000
    },
    {
      id: 2,
      name: "Basic Setup Package",
      price: 15000,
      description: "Basic setup with tent and sound system",
      services: [2, 3],
      savings: 3000
    }
  ],
  gallery: [
    "/images/vendors/dj-setup.jpg",
    "/images/vendors/tent-setup.jpg",
    "/images/vendors/sound.jpg",
    "/images/vendors/lighting.jpg",
    "/images/vendors/stage.jpg",
    "/images/vendors/decoration.jpg"
  ],
  reviews: [
    { id: 1, name: "Aarav Kumar", rating: 5, comment: "Exceptional service! The tent setup and lighting created the perfect ambiance for our wedding.", date: "2024-02-15" },
    { id: 2, name: "Meera Singh", rating: 4, comment: "The DJ was fantastic and kept everyone dancing all night. Very professional team.", date: "2024-02-10" },
    { id: 3, name: "Rahul Sharma", rating: 5, comment: "Best event management service in Delhi. The sound system was perfect and the stage decoration was breathtaking.", date: "2024-02-01" }
  ],
  availability: [
    {
      date: "2024-03-20",
      slots: [
        { time: "Morning", available: true },
        { time: "Evening", available: false }
      ]
    },
    {
      date: "2024-03-21",
      slots: [
        { time: "Morning", available: true },
        { time: "Evening", available: true }
      ]
    }
  ],
  refundPolicy: {
    description: "We offer a flexible refund policy based on the cancellation notice period.",
    cancellationTerms: [
      { daysBeforeEvent: 30, refundPercentage: 100 },
      { daysBeforeEvent: 15, refundPercentage: 75 },
      { daysBeforeEvent: 7, refundPercentage: 50 },
      { daysBeforeEvent: 3, refundPercentage: 25 }
    ]
  },
  contact: {
    phone: "+91 98765 43210",
    email: "elite@events.com",
    whatsapp: "https://wa.me/919876543210"
  },
  businessHours: "Mon-Sun: 9:00 AM - 9:00 PM",
  socialLinks: {
    facebook: "https://facebook.com/eliteeventexperts",
    instagram: "https://instagram.com/eliteeventexperts",
    website: "https://eliteeventexperts.com"
  }
}; 