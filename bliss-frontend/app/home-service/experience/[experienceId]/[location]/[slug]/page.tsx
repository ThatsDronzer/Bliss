"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { eventThemes } from "@/lib/data/event-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExperienceDetailPage() {
  const params = useParams();
  const experienceId = params.experienceId as string;
  
  const experience = eventThemes.find(theme => theme.id === experienceId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pincode, setPincode] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Experience not found</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === experience.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? experience.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-pink-600">Home</Link>
            <span>›</span>
            <Link href="/home-service/events" className="hover:text-pink-600">
              Events
            </Link>
            <span>›</span>
            <span className="text-gray-900">{experience.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
              <div className="relative h-[400px] md:h-[500px]">
                <Image
                  src={experience.images[currentImageIndex]}
                  alt={experience.name}
                  fill
                  className="object-cover"
                />
                {experience.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {experience.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Thumbnail Strip */}
              {experience.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {experience.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-pink-600' 
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${experience.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Details */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{experience.name}</h1>
                    <p className="text-gray-600 mb-3">{experience.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{experience.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{experience.rating}</span>
                        <span>({experience.reviewCount} Reviews)</span>
                      </div>
                    </div>
                  </div>
                  {experience.tags && experience.tags.length > 0 && (
                    <div className="flex gap-2">
                      {experience.tags.map((tag) => (
                        <Badge key={tag} className="bg-pink-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <Clock className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">{experience.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <Users className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Capacity</p>
                      <p className="font-semibold">{experience.guestCapacity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-3 rounded-lg">
                      <Calendar className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Setup Time</p>
                      <p className="font-semibold">{experience.setupTime}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Features</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {experience.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Vendor</h3>
                        <p className="text-gray-600">{experience.vendorName}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inclusions" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-green-600">
                          What's Included
                        </h3>
                        <ul className="space-y-2">
                          {experience.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {experience.exclusions && experience.exclusions.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-lg mb-3 text-red-600">
                            What's Not Included
                          </h3>
                          <ul className="space-y-2">
                            {experience.exclusions.map((item, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-6">
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                      <p className="text-2xl font-bold mb-2">{experience.rating} / 5</p>
                      <p className="text-gray-600">Based on {experience.reviewCount} reviews</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-xl">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    {experience.originalPrice && (
                      <span className="text-gray-400 line-through text-lg">
                        ₹{experience.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-pink-600">
                      ₹{experience.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">per decoration</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Enter Pincode
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Don't know pincode?
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Date & Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg"
                    size="lg"
                  >
                    BOOK NOW →
                  </Button>

                  <div className="pt-4 border-t space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Free Cancellation up to 48 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Verified Professionals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Quality Assured</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
