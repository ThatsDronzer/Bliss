'use client';

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageCustomizationModal } from "./PackageCustomizationModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, Users } from "lucide-react";

interface PackageProps {
  onSelectPackage: (packageId: string, customizations?: any) => void;
}

const packages = [
  {
    id: "basic",
    name: "Basic Home Service Package",
    description: "Perfect for small home gatherings",
    price: 999,
    duration: "4 hours",
    guests: "Up to 10 guests",
    category: "basic",
    popular: false,
    features: [
      "Standard Party Setup",
      "Basic Decoration",
      "Essential Lighting",
      "Portable Sound System",
      "One Staff Member"
    ]
  },
  {
    id: "premium",
    name: "Premium Home Service Package",
    description: "Ideal for medium-sized home events",
    price: 2499,
    duration: "6 hours",
    guests: "Up to 25 guests",
    category: "premium",
    popular: true,
    features: [
      "Advanced Party Setup",
      "Premium Decor with Flowers",
      "Professional Lighting",
      "DJ & Sound System",
      "Basic Catering Setup",
      "Two Staff Members"
    ]
  },
  {
    id: "deluxe",
    name: "Deluxe Home Service Package",
    description: "Complete solution for large home events",
    price: 4999,
    duration: "8 hours",
    guests: "Up to 50 guests",
    category: "deluxe",
    popular: false,
    features: [
      "Exclusive Home Event Setup",
      "Themed Decoration",
      "Advanced Lighting & Effects",
      "Professional DJ & Sound",
      "Full Catering Service",
      "Event Coordinator",
      "Three Staff Members"
    ]
  }
];

const packageCategories = [
  { id: "all", name: "All Packages" },
  { id: "basic", name: "Basic" },
  { id: "premium", name: "Premium" },
  { id: "deluxe", name: "Deluxe" }
];

export function HomeServicePackages({ onSelectPackage }: PackageProps) {
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{ id: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const handlePackageSelect = (packageId: string, packageName: string) => {
    setSelectedPackage({ id: packageId, name: packageName });
    setCustomizationModalOpen(true);
  };

  const handleCustomizationConfirm = (selectedOptions: any, additionalRequirements: string) => {
    if (selectedPackage) {
      onSelectPackage(selectedPackage.id, {
        options: selectedOptions,
        additionalRequirements
      });
    }
  };

  const filteredPackages = activeTab === "all" 
    ? packages 
    : packages.filter(pkg => pkg.category === activeTab);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Home Service Packages</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect package for your home event needs and customize it to your requirements
          </p>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              {packageCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className={`hover:shadow-xl transition-all duration-300 overflow-hidden ${pkg.popular ? 'border-pink-500 shadow-lg' : 'border-gray-200'}`}>
              {pkg.popular && (
                <div className="bg-pink-600 text-white text-center py-1.5 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardContent className="pt-8 pb-4 px-6">
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{pkg.description}</p>
                  <div className="flex justify-center gap-3 mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {pkg.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {pkg.guests}
                    </div>
                  </div>
                  <div className="flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold text-pink-600">₹{pkg.price}</span>
                    <span className="text-gray-500 ml-2">/ event</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-pink-600" />
                      </div>
                      <span className="ml-3 text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="px-6 pb-8 pt-2">
                <Button 
                  className={`w-full ${pkg.popular ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-800 hover:bg-gray-900'}`}
                  onClick={() => handlePackageSelect(pkg.id, pkg.name)}
                >
                  Customize & Book
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {selectedPackage && (
        <PackageCustomizationModal
          isOpen={customizationModalOpen}
          onClose={() => setCustomizationModalOpen(false)}
          packageId={selectedPackage.id}
          packageName={selectedPackage.name}
          onConfirm={handleCustomizationConfirm}
        />
      )}
    </section>
  );
}
