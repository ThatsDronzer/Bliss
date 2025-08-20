"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, CheckCircle, Shield, Clock, Users, Star, Phone, ArrowRight, Filter } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  serviceCategories,
  homeServiceCategories,
  homeServices, 
  occasionPackages, 
  occasionCategories,
  howItWorks, 
  qualityProcess, 
  trustFeatures 
} from "@/lib/data/home-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { HomeServiceHero } from "@/components/home-service/HomeServiceHero";
import { CelebrationPackages } from "@/components/home-service/CelebrationPackages";
import { FeaturedHomeServices } from "@/components/home-service/FeaturedHomeServices";
import { HomeServicePackages } from "@/components/home-service/HomeServicePackages";

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  const filteredServices = homeServices.filter((service) => {
    const categoryMatch = selectedCategory === 'all' || service.category === selectedCategory;
    const locationMatch = selectedLocation === 'all' || service.locations.includes(selectedLocation);
    return categoryMatch && locationMatch;
  });

  const handlePackageSelect = (packageId: string, customizations?: any) => {
    setSelectedPackage({ id: packageId, customizations });
    setShowBooking(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <HomeServiceHero 
        onCategoryChange={setSelectedCategory}
        onLocationChange={setSelectedLocation}
      />

      {/* Service Categories Section */}
      <section className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Door-to-Door Services</h2>
          
          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden flex items-center gap-2 mt-4 md:mt-0">
                <Filter size={16} />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filter Services</SheetTitle>
                <SheetDescription>
                  Refine services based on your preferences
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={selectedCategory === 'all' ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                    >
                      All
                    </Button>
                    {homeServiceCategories.map((cat) => (
                      <Button 
                        key={cat.id} 
                        variant={selectedCategory === cat.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Locations</h3>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All locations</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <SheetClose asChild>
                  <Button className="w-full">Apply Filters</Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop Filters */}
          <div className="hidden md:flex items-center space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {homeServiceCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <FeaturedHomeServices onSelect={handlePackageSelect} filteredServices={filteredServices} />
        </div>
        
        {/* View More Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 px-8 py-2">
            View All Services <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Package Section */}
      <HomeServicePackages onSelectPackage={handlePackageSelect} />

      {/* Celebration Packages - Keep the original component */}
      <CelebrationPackages />

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Simple steps to get your home services delivered with professional quality
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <Search className="h-8 w-8 text-pink-600" />
                <div className="absolute top-0 right-0 w-6 h-6 bg-pink-600 rounded-full text-white flex items-center justify-center text-sm font-bold">1</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Service</h3>
              <p className="text-gray-600">Browse through our curated services or packages according to your needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <Clock className="h-8 w-8 text-pink-600" />
                <div className="absolute top-0 right-0 w-6 h-6 bg-pink-600 rounded-full text-white flex items-center justify-center text-sm font-bold">2</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Schedule Service</h3>
              <p className="text-gray-600">Pick your preferred date and time for the service</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <Users className="h-8 w-8 text-pink-600" />
                <div className="absolute top-0 right-0 w-6 h-6 bg-pink-600 rounded-full text-white flex items-center justify-center text-sm font-bold">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Assignment</h3>
              <p className="text-gray-600">We assign verified professionals to handle your service needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <CheckCircle className="h-8 w-8 text-pink-600" />
                <div className="absolute top-0 right-0 w-6 h-6 bg-pink-600 rounded-full text-white flex items-center justify-center text-sm font-bold">4</div>
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
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Our Home Services</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We ensure the highest quality of service and customer satisfaction
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
                <p className="text-gray-600">
                  All our service providers undergo strict verification and quality checks
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
                <p className="text-gray-600">
                  We monitor service quality and collect customer feedback for continuous improvement
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Our dedicated support team is available round the clock to assist you
                </p>
              </CardContent>
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
              <div className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Provider Verification</h3>
                  <p className="text-gray-600">
                    Background checks and document verification of all service providers to ensure your safety and security
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Training & Standards</h3>
                  <p className="text-gray-600">
                    Regular training sessions and quality standard assessments to maintain exceptional service levels
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Service Monitoring</h3>
                  <p className="text-gray-600">
                    Real-time tracking and quality checks during service delivery to ensure everything goes as planned
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 font-semibold text-lg">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Feedback Collection</h3>
                  <p className="text-gray-600">
                    Customer feedback and satisfaction surveys after every service to continuously improve our offerings
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Quality+Process"
                alt="Quality Control Process"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Your satisfaction is our priority</h3>
                  <p>We continuously monitor and improve our processes to deliver exceptional home services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Find answers to common questions about our home services
          </p>
          
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">What types of home services do you offer?</AccordionTrigger>
                <AccordionContent>
                  We offer a variety of door-to-door services including home decoration, small party arrangements, 
                  home DJ services, catering, cleaning, and more. All our services are designed to provide convenience 
                  and quality right at your doorstep.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">How do I book a service?</AccordionTrigger>
                <AccordionContent>
                  Booking a service is simple! Browse our available services, select the one you need, 
                  choose your preferred date and time, and complete the booking form. You'll receive 
                  a confirmation email with all the details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">Can I customize the services as per my requirements?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! We understand that each home is unique. You can customize our 
                  packages by selecting specific options or adding special requests during the booking process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">What is your cancellation policy?</AccordionTrigger>
                <AccordionContent>
                  We offer free cancellation up to 48 hours before your scheduled service. Cancellations 
                  made less than 48 hours in advance may be subject to a cancellation fee. Please refer 
                  to our terms and conditions for more details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-white/90">
            Book our professional home services today and experience the difference of quality service at your doorstep.
          </p>
          <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
            Explore Services Now
          </Button>
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