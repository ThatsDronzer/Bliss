'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { occasionPackages } from "@/lib/data/home-service";
import { PackageCustomizationModal } from "@/components/home-service/PackageCustomizationModal";
import { useToast } from "@/components/ui/use-toast";
import { OccasionPackage } from "@/lib/types/home-service";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<{ id: string; name: string } | null>(null);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const { toast } = useToast();

  const validCategories = ['featured', 'personal', 'corporate', 'religious', 'social'];
  if (!validCategories.includes(params.category)) {
    notFound();
  }

  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  const filteredPackages = occasionPackages.filter((pkg: OccasionPackage) => {
    // Ensure all required properties exist
    if (!pkg?.name || !pkg?.description || typeof pkg?.price !== 'number' || !pkg?.category) {
      return false;
    }

    const matchesCategory = pkg.category === params.category;
    const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1];
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">{categoryName} Packages</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 space-y-6">
          <div>
            <Label htmlFor="search">Search Packages</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <Label>Price Range (₹)</Label>
            <div className="pt-4">
              <Slider
                defaultValue={[0, 100000]}
                max={100000}
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg: OccasionPackage) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:border-pink-500 transition-all duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                  {pkg.featured && (
                    <span className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
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
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">
                      ₹{pkg.price.toLocaleString()}
                    </span>
                    <Button
                      onClick={() => handleCustomize(pkg.id, pkg.name)}
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      Customize
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
} 