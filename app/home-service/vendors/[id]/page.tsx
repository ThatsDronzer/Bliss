'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Phone, 
  Mail,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  MessageSquare
} from "lucide-react";
import Image from 'next/image';
import { ServiceBooking } from "@/components/home-service/ServiceBooking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  phone: string;
  email: string;
}

// Mock data - in a real app, this would come from an API
const vendors: Record<string, Vendor & {
  specialties: string[];
  eventTypes: string[];
  teamSize: string;
  languages: string[];
  awards: string[];
  testimonials: Array<{
    name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}> = {
  "v1": {
    id: "v1",
    name: "Royal Events",
    rating: 4.8,
    reviews: 156,
    image: "/vendors/royal-events.jpg",
    coverImage: "/vendors/royal-events-cover.jpg",
    location: "Mumbai, Maharashtra",
    experience: "10+ years",
    description: "Premium event management and services provider specializing in luxury events and weddings. We offer comprehensive event solutions with attention to detail and exceptional customer service.",
    phone: "+91 98765 43210",
    email: "contact@royalevents.com",
    services: [
      { 
        id: "s1", 
        name: "Premium Tent Setup", 
        price: 15000, 
        category: "Tent",
        description: "Luxury tent setup with premium materials and elegant design. Includes installation and decoration."
      },
      { 
        id: "s2", 
        name: "Luxury Decor Package", 
        price: 25000, 
        category: "Decor",
        description: "Complete decor solution with premium flowers and modern aesthetics. Perfect for weddings and corporate events."
      },
      { 
        id: "s3", 
        name: "Professional Lighting", 
        price: 12000, 
        category: "Lighting",
        description: "Advanced lighting setup with mood lighting and special effects. Includes LED walls and spot lights."
      }
    ],
    specialties: ["Wedding Events", "Corporate Events", "Birthday Parties", "Social Gatherings"],
    eventTypes: ["Indoor", "Outdoor", "Destination"],
    teamSize: "25-50 members",
    languages: ["English", "Hindi", "Marathi"],
    awards: [
      "Best Event Management Company 2023",
      "Excellence in Customer Service 2022"
    ],
    testimonials: [
      {
        name: "Rahul Sharma",
        rating: 5,
        comment: "Exceptional service! The team went above and beyond to make our wedding perfect.",
        date: "2024-02-15"
      },
      {
        name: "Priya Patel",
        rating: 4.5,
        comment: "Very professional team. Great attention to detail.",
        date: "2024-01-20"
      }
    ]
  },
  "v2": {
    id: "v2",
    name: "Sound Masters",
    rating: 4.9,
    reviews: 203,
    image: "/vendors/sound-masters.jpg",
    coverImage: "/vendors/sound-masters-cover.jpg",
    location: "Delhi, NCR",
    experience: "8+ years",
    description: "Professional sound and entertainment services for all types of events.",
    phone: "+91 98765 43211",
    email: "contact@soundmasters.com",
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
  }
};

export default function VendorDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const vendorData = vendors[params.id];

  if (!vendorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
            <p className="text-gray-600 mb-6">Sorry, we couldn't find the vendor you're looking for.</p>
            <Button 
              onClick={() => router.push('/home-service')}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home Services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <div className="absolute inset-0 bg-gray-200">
          {vendorData.coverImage && (
            <Image
              src={vendorData.coverImage}
              alt={vendorData.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <Button
          variant="outline"
          className="absolute top-4 left-4 bg-white"
          onClick={() => router.push('/home-service')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                  {vendorData.image && (
                    <Image
                      src={vendorData.image}
                      alt={vendorData.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="mt-4 space-y-3">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Vendor
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Check Availability
                  </Button>
                </div>
              </div>

              <div className="md:w-3/4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{vendorData.name}</h1>
                  {vendorData.verified && (
                    <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  )}
                  {vendorData.featured && (
                    <Badge className="bg-pink-600">Featured</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{vendorData.rating}</span>
                    <span className="text-gray-500">({vendorData.reviews} reviews)</span>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
                    <Clock className="h-4 w-4 mr-1" />
                    {vendorData.experience}
                  </Badge>
                </div>

                <p className="text-gray-600 mb-6">{vendorData.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span>{vendorData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{vendorData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span>{vendorData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="bg-white border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-pink-600" />
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {vendorData.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-pink-600" />
                    Event Types
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {vendorData.eventTypes.map((type, index) => (
                      <Badge key={index} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-pink-600" />
                    Team Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">Team Size: {vendorData.teamSize}</p>
                    <p className="text-gray-600">Languages: {vendorData.languages.join(", ")}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-pink-600" />
                    Awards & Recognition
                  </h3>
                  <ul className="space-y-2">
                    {vendorData.awards.map((award, index) => (
                      <li key={index} className="text-gray-600 flex items-start gap-2">
                        <Star className="h-4 w-4 text-yellow-400 mt-1" />
                        {award}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorData.services.map((service) => (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedServices.includes(service.id) ? 'ring-2 ring-pink-600' : ''
                  }`}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                        <Badge>{service.category}</Badge>
                      </div>
                      <span className="text-xl font-bold">₹{service.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    <Button 
                      variant={selectedServices.includes(service.id) ? "default" : "outline"}
                      className="w-full"
                    >
                      {selectedServices.includes(service.id) ? 'Selected' : 'Select Service'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {vendorData.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <span className="text-sm text-gray-500">{testimonial.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{testimonial.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedServices.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="container mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Services: {selectedServices.length}</p>
                <p className="text-xl font-bold">
                  Total: ₹{vendorData.services
                    .filter(s => selectedServices.includes(s.id))
                    .reduce((sum, s) => sum + s.price, 0)}
                </p>
              </div>
              <Button 
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => setShowBooking(true)}
              >
                Proceed to Booking
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      {showBooking && (
        <ServiceBooking 
          selectedServices={selectedServices}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
} 