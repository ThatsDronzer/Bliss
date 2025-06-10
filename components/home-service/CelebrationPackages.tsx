'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { occasionPackages } from "@/lib/data/home-service";
import { PackageCustomizationModal } from "./PackageCustomizationModal";
import { useToast } from "@/components/ui/use-toast";
import { OccasionPackage } from "@/lib/types/home-service";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CelebrationPackages() {
  const [selectedPackage, setSelectedPackage] = useState<{ id: string; name: string } | null>(null);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: 'featured', name: 'Featured' },
    { id: 'personal', name: 'Personal' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'religious', name: 'Religious' },
    { id: 'social', name: 'Social' },
  ];

  const handleCustomize = (packageId: string, packageName: string) => {
    setSelectedPackage({ id: packageId, name: packageName });
    setIsCustomizeModalOpen(true);
  };

  const handleCustomizationConfirm = (selectedOptions: any[], additionalRequirements: string) => {
    toast({
      title: "Package Customized!",
      description: "Your customized package has been created. Our team will contact you shortly.",
    });
    // Here you would typically send this data to your backend
    console.log('Selected Options:', selectedOptions);
    console.log('Additional Requirements:', additionalRequirements);
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Celebration Packages</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our carefully curated celebration packages, each designed to make your special moments unforgettable
          </p>
        </div>

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="flex justify-center mb-8 flex-wrap">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-4 py-2 text-sm"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {occasionPackages
                  .filter((pkg: OccasionPackage) => {
                    if (!pkg?.title || !pkg?.description || !pkg?.price || !pkg?.category) {
                      return false;
                    }
                    return pkg.category === category.id;
                  })
                  .map((pkg: OccasionPackage) => (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:border-pink-500 transition-all duration-300"
                    >
                      <div className="relative h-48">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover"
                        />
                        {pkg.featured && (
                          <Badge className="absolute top-4 right-4 bg-pink-500">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                        <p className="text-gray-600 mb-4">{pkg.description}</p>
                        
                        {/* Quick Info */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>50-200 Guests</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>4-8 Hours</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Flexible Dates</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Gift className="w-4 h-4 mr-2" />
                            <span>Custom Add-ons</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Includes:</h4>
                          <ul className="space-y-1">
                            {pkg.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <span className="mr-2">•</span>
                                {feature}
                              </li>
                            ))}
                            {pkg.features.length > 3 && (
                              <li className="text-sm text-gray-600">
                                +{pkg.features.length - 3} more features
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <span className="text-2xl font-bold text-pink-600">
                              {pkg.price}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">base price</span>
                          </div>
                          <Button
                            onClick={() => handleCustomize(pkg.id, pkg.title)}
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                          >
                            Customize
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-12">
          <Link href="/packages">
            <Button variant="outline" size="lg" className="border-pink-200 text-pink-600 hover:bg-pink-50 px-8 py-3">
              Explore All Packages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {selectedPackage && (
        <PackageCustomizationModal
          isOpen={isCustomizeModalOpen}
          onClose={() => setIsCustomizeModalOpen(false)}
          packageId={selectedPackage.id}
          packageName={selectedPackage.name}
          isOccasionPackage={true}
          onConfirm={handleCustomizationConfirm}
        />
      )}
    </section>
  );
} 