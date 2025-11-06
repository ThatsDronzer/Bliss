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
import { Search } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'featured', name: 'Featured Events' },
    { id: 'personal', name: 'Personal Events' },
    { id: 'corporate', name: 'Corporate Events' },
    { id: 'religious', name: 'Religious Events' },
    { id: 'social', name: 'Social Events' },
  ];

  const locations = [
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'bangalore', name: 'Bangalore' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'kolkata', name: 'Kolkata' },
  ];

  const handleSearch = () => {
    console.log('Search params:', { location, category });
  };

  return (
    <section className="relative min-h-[500px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-4 z-0 rounded-xl overflow-hidden">
        <Image
          src="/guest_party.jpg"
          alt="Event Services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Find the Perfect Event Service
          </h1>
          <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
            Discover and book the best event services for your special occasions
          </p>

          {/* Search Box */}
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
              {/* Location Select */}
              <div className="md:col-span-3">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select Location" />
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
              <div className="md:col-span-3">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select Category" />
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
              <div className="md:col-span-2">
                <Button
                  className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 text-gray-600">
              <span className="text-sm font-medium mr-2">Popular:</span>
              <div className="inline-flex flex-wrap gap-2">
                {['Weddings', 'Birthday Parties', 'Corporate Events', 'Pujas'].map((term) => (
                  <button
                    key={term}
                    className="text-sm text-gray-600 hover:text-pink-600 transition-colors"
                    onClick={() => setCategory('all')}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 