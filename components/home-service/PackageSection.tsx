'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageCustomizationModal } from "./PackageCustomizationModal";

interface PackageProps {
  onSelectPackage: (packageId: string, customizations?: any) => void;
}

const packages = [
  {
    id: "basic",
    name: "Basic Event Package",
    description: "Perfect for small gatherings",
    price: 999,
    features: [
      "Standard Tent (30 people)",
      "Basic Decor Setup",
      "Essential Lighting",
      "50 Chairs & 5 Tables",
      "Basic Sound System",
      "4 Hours Service"
    ]
  },
  {
    id: "premium",
    name: "Premium Event Package",
    description: "Ideal for medium-sized events",
    price: 2499,
    features: [
      "Luxury Tent (100 people)",
      "Premium Decor with Flowers",
      "Professional Lighting Setup",
      "100 Chairs & 10 Tables",
      "DJ with Sound System",
      "Basic Catering Service",
      "8 Hours Service"
    ]
  },
  {
    id: "deluxe",
    name: "Deluxe Event Package",
    description: "Complete solution for large events",
    price: 4999,
    features: [
      "Premium Tent (200+ people)",
      "Exclusive Decor & Theme Setup",
      "Advanced Lighting & Effects",
      "200 Chairs & 20 Tables",
      "Professional DJ & Sound",
      "Full Catering Service",
      "Event Coordinator",
      "12 Hours Service"
    ]
  }
];

export function PackageSection({ onSelectPackage }: PackageProps) {
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{ id: string; name: string } | null>(null);

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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Event Packages</h2>
        <p className="text-gray-600 text-center mb-12">Choose the perfect package for your event</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-pink-600">₹{pkg.price}</span>
                  <span className="text-gray-500 ml-2">/ event</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-pink-600"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={() => handlePackageSelect(pkg.id, pkg.name)}
                >
                  Customize & Book
                </Button>
              </CardContent>
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