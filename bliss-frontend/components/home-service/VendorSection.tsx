'use client';

import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, CheckCircle2 } from "lucide-react";
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

interface Vendor {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  image: string;
  location: string;
  services: Service[];
  experience: string;
  description: string;
  coverImage: string;
  featured: boolean;
  verified: boolean;
  topServices: string[];
}

const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Royal Events",
    rating: 4.8,
    reviews: 156,
    image: "/vendors/royal-events.jpg",
    coverImage: "/vendors/royal-events-cover.jpg",
    location: "Mumbai, Maharashtra",
    experience: "10+ years",
    description: "Premium event management and services provider specializing in luxury events and weddings.",
    featured: true,
    verified: true,
    topServices: ["Luxury Tents", "Premium Decor", "Event Planning"],
    services: [
      { 
        id: "s1", 
        name: "Premium Tent Setup", 
        price: 15000, 
        category: "Tent",
        description: "Luxury tent setup with premium materials and elegant design"
      },
      { 
        id: "s2", 
        name: "Luxury Decor Package", 
        price: 25000, 
        category: "Decor",
        description: "Complete decor solution with premium flowers and modern aesthetics"
      },
      { 
        id: "s3", 
        name: "Professional Lighting", 
        price: 12000, 
        category: "Lighting",
        description: "Advanced lighting setup with mood lighting and special effects"
      }
    ]
  },
  {
    id: "v2",
    name: "Sound Masters",
    rating: 4.9,
    reviews: 203,
    image: "/vendors/sound-masters.jpg",
    coverImage: "/vendors/sound-masters-cover.jpg",
    location: "Delhi, NCR",
    experience: "8+ years",
    description: "Professional sound and entertainment services for all types of events.",
    featured: false,
    verified: true,
    topServices: ["Professional DJ", "Sound Systems", "Live Music"],
    services: [
      { 
        id: "s4", 
        name: "DJ with Equipment", 
        price: 20000, 
        category: "DJ",
        description: "Professional DJ service with high-end sound equipment"
      },
      { 
        id: "s5", 
        name: "Sound System Rental", 
        price: 8000, 
        category: "Sound",
        description: "Complete sound system setup for events"
      }
    ]
  },
  {
    id: "v3",
    name: "Decor Dreams",
    rating: 4.7,
    reviews: 178,
    image: "/vendors/decor-dreams.jpg",
    coverImage: "/vendors/decor-dreams-cover.jpg",
    location: "Bangalore, Karnataka",
    experience: "12+ years",
    description: "Transforming spaces into magical settings with creative and elegant decorations.",
    featured: true,
    verified: true,
    topServices: ["Theme Decor", "Floral Arrangements", "Stage Design"],
    services: [
      {
        id: "s6",
        name: "Theme Decoration",
        price: 35000,
        category: "Decor",
        description: "Complete theme-based decoration for your event"
      },
      {
        id: "s7",
        name: "Floral Package",
        price: 25000,
        category: "Decor",
        description: "Premium floral arrangements and decorations"
      }
    ]
  },
  {
    id: "v4",
    name: "Catering Delights",
    rating: 4.6,
    reviews: 245,
    image: "/vendors/catering-delights.jpg",
    coverImage: "/vendors/catering-delights-cover.jpg",
    location: "Pune, Maharashtra",
    experience: "15+ years",
    description: "Exquisite catering services with a wide range of cuisines and presentation styles.",
    featured: false,
    verified: true,
    topServices: ["Multi-cuisine", "Live Counters", "Premium Catering"],
    services: [
      {
        id: "s8",
        name: "Premium Catering",
        price: 1200,
        category: "Catering",
        description: "Per plate premium catering service"
      },
      {
        id: "s9",
        name: "Live Counter Setup",
        price: 25000,
        category: "Catering",
        description: "Live cooking stations for your event"
      }
    ]
  },
  {
    id: "v5",
    name: "Luminous Events",
    rating: 4.8,
    reviews: 167,
    image: "/vendors/luminous-events.jpg",
    coverImage: "/vendors/luminous-events-cover.jpg",
    location: "Hyderabad, Telangana",
    experience: "7+ years",
    description: "Specialized in creating stunning lighting solutions for events and weddings.",
    featured: false,
    verified: true,
    topServices: ["LED Walls", "Mood Lighting", "Stage Lighting"],
    services: [
      {
        id: "s10",
        name: "Premium Lighting",
        price: 45000,
        category: "Lighting",
        description: "Complete event lighting solution"
      },
      {
        id: "s11",
        name: "LED Wall Setup",
        price: 35000,
        category: "Lighting",
        description: "High-quality LED wall installation"
      }
    ]
  },
  {
    id: "v6",
    name: "Furniture Plus",
    rating: 4.5,
    reviews: 132,
    image: "/vendors/furniture-plus.jpg",
    coverImage: "/vendors/furniture-plus-cover.jpg",
    location: "Chennai, Tamil Nadu",
    experience: "9+ years",
    description: "Complete furniture solutions for events with premium quality and elegant designs.",
    featured: false,
    verified: true,
    topServices: ["Premium Seating", "Stage Setup", "Lounge Areas"],
    services: [
      {
        id: "s12",
        name: "Complete Furniture Package",
        price: 50000,
        category: "Furniture",
        description: "Full event furniture setup"
      },
      {
        id: "s13",
        name: "VIP Lounge Setup",
        price: 30000,
        category: "Furniture",
        description: "Premium lounge area setup"
      }
    ]
  }
];

export function VendorSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Our Trusted Vendors</h2>
        <p className="text-gray-600 text-center mb-12">Choose from our verified event service providers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <Link 
              key={vendor.id} 
              href={`/home-service/vendors/${vendor.id}`}
              className="block group"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200">
                    {vendor.coverImage && (
                      <Image
                        src={vendor.coverImage}
                        alt={vendor.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  {vendor.featured && (
                    <Badge className="absolute top-4 right-4 bg-pink-600 text-white">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">{vendor.name}</h3>
                      {vendor.verified && (
                        <CheckCircle2 className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{vendor.location}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{vendor.rating}</span>
                      <span className="text-gray-500">({vendor.reviews} reviews)</span>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100">
                      <Clock className="h-4 w-4 mr-1" />
                      {vendor.experience}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {vendor.description}
                    </p>

                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-2">Top Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.topServices.map((service, index) => (
                          <Badge 
                            key={index} 
                            variant="outline"
                            className="bg-pink-50 text-pink-700 border-pink-200"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 