export interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
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
  gallery: string[];
  reviews: Review[];
  availability: string;
  refundPolicy: string;
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
    { id: 1, name: "DJ", price: 8000, description: "Professional DJ with modern equipment and extensive music library for all genres." },
    { id: 2, name: "Tent Setup", price: 12000, description: "Elegant tent setup with premium decorations, lights, and comfortable seating arrangements." },
    { id: 3, name: "Sound System", price: 6000, description: "High-quality audio setup with wireless microphones and speakers for crystal clear sound." },
    { id: 4, name: "Lighting", price: 4000, description: "Ambient lighting solutions for indoor and outdoor events with mood lighting options." },
    { id: 5, name: "Stage Decoration", price: 15000, description: "Custom stage design and decoration with premium flowers and materials." }
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
  availability: "Available all days. Advance booking of 2 weeks required for major events.",
  refundPolicy: "50% refund for cancellations made 7 days before the event. No refund for last-minute cancellations."
}; 