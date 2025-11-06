'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function HomeServiceHero({ onCategoryChange, onLocationChange }: { 
  onCategoryChange?: (category: string) => void;
  onLocationChange?: (location: string) => void;
}) {
  const [location, setLocation] = useState('all');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'decoration', name: 'Home Decoration' },
    { id: 'party', name: 'Party Arrangements' },
    { id: 'dj', name: 'Home DJ Services' },
    { id: 'catering', name: 'Catering Services' },
    { id: 'cleaning', name: 'Cleaning Services' },
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'kolkata', name: 'Kolkata' },
  ];

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (onCategoryChange) {
      onCategoryChange(value);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (onLocationChange) {
      onLocationChange(value);
    }
  };

  const handleSearch = () => {
    console.log('Search params:', { location, category, searchQuery });
    // Implement search functionality
  };

  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/guest_party.jpg"
          alt="Home Services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-pink-600/80 hover:bg-pink-600 px-4 py-2 text-base">Professional Home Services</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Quality Services At Your <span className="text-pink-400">Doorstep</span>
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            From home decoration to party arrangements, we bring professional services directly to your home
          </p>

          {/* Search Box */}
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
              {/* Search Input */}
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="What service do you need?"
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Location Select */}
              <div className="md:col-span-2">
                <Select value={location} onValueChange={handleLocationChange}>
                  <SelectTrigger className="w-full h-12">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <SelectValue placeholder="Location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Select */}
              <div className="md:col-span-2">
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1">
                <Button
                  className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 text-gray-600">
              <span className="text-sm font-medium mr-2">Popular:</span>
              <div className="inline-flex flex-wrap gap-2">
                {['Home Decoration', 'Small Party', 'DJ Services', 'Catering'].map((term) => (
                  <button
                    key={term}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/80">Service Providers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10,000+</p>
              <p className="text-sm text-white/80">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">4.8/5</p>
              <p className="text-sm text-white/80">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
