"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, CheckCircle, Shield, Clock, Users, Star, Phone, ArrowRight } from "lucide-react";
import { PackageSection } from "@/components/home-service/PackageSection";
import { ServiceBooking } from "@/components/home-service/ServiceBooking";
import { Footer } from "@/components/footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  serviceCategories, 
  occasionPackages, 
  occasionCategories,
  howItWorks, 
  qualityProcess, 
  trustFeatures 
} from "@/lib/data/home-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { HeroSection } from "@/components/home-service/HeroSection";
import { CelebrationPackages } from "@/components/home-service/CelebrationPackages";

export default function HomeServicePage() {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<{
    id: string;
    customizations?: {
      options: Array<{
        id: string;
        name: string;
        value: string;
        included: boolean;
      }>;
      additionalRequirements: string;
    };
  } | null>(null);

  const handlePackageSelect = (packageId: string, customizations?: any) => {
    setSelectedPackage({ id: packageId, customizations });
    setShowBooking(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Service Categories */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Event Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-4">
          {serviceCategories.map((service) => (
            <Button
              key={service.id}
              variant="outline"
              className="h-32 flex flex-col items-center justify-center gap-2 hover:border-pink-600 hover:text-pink-600"
            >
              <span className="text-sm font-medium text-center">{service.name}</span>
                </Button>
          ))}
        </div>
      </section>

      {/* Package Section */}
      <PackageSection onSelectPackage={handlePackageSelect} />

      {/* Celebration Packages */}
      <CelebrationPackages />

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Simple steps to get your event organized with our professional services
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Package</h3>
              <p className="text-gray-600">Browse through our curated packages or customize one according to your needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule Service</h3>
              <p className="text-gray-600">Pick your preferred date and time for the service</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Assignment</h3>
              <p className="text-gray-600">We assign verified professionals to handle your event</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Delivery</h3>
              <p className="text-gray-600">Enjoy professional service delivery with attention to detail</p>
        </div>
          </div>
        </div>
      </section>

      {/* Trust & Quality Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Blissmet</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We ensure the highest quality of service and customer satisfaction
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600">
                All our service providers undergo strict verification and quality checks
              </p>
            </Card>
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                We monitor service quality and collect customer feedback for continuous improvement
              </p>
            </Card>
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is available round the clock to assist you
              </p>
          </Card>
          </div>
                  </div>
      </section>

      {/* Quality Control Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Quality Control Process</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We follow a rigorous process to ensure you receive the best service
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold">1</span>
                </div>
                    <div>
                  <h3 className="text-lg font-semibold mb-2">Provider Verification</h3>
                  <p className="text-gray-600">
                    Background checks and document verification of all service providers
                      </p>
                    </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold">2</span>
                  </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Training & Standards</h3>
                  <p className="text-gray-600">
                    Regular training sessions and quality standard assessments
                  </p>
                      </div>
                    </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold">3</span>
                </div>
                      <div>
                  <h3 className="text-lg font-semibold mb-2">Service Monitoring</h3>
                  <p className="text-gray-600">
                    Real-time tracking and quality checks during service delivery
                        </p>
                      </div>
                    </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold">4</span>
          </div>
              <div>
                  <h3 className="text-lg font-semibold mb-2">Feedback Collection</h3>
                  <p className="text-gray-600">
                    Customer feedback and satisfaction surveys after every service
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Quality+Process"
                alt="Quality Control Process"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      {showBooking && (
        <ServiceBooking 
          selectedServices={selectedServices}
          selectedPackage={selectedPackage}
          onClose={() => {
            setShowBooking(false);
            setSelectedPackage(null);
          }}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
} 