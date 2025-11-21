'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  duration: string;
  locations: string[];
  featured?: boolean;
  tags?: string[];
}

interface FeaturedHomeServicesProps {
  onSelect: (id: string, customizations?: any) => void;
  filteredServices?: Service[];
}

// Sample data if no filtered services provided
const defaultServices: Service[] = [
  {
    id: "small-party",
    name: "Small Party Arrangement",
    description: "Perfect setup for intimate gatherings of up to 20 people",
    price: 4999,
    discountedPrice: 3999,
    rating: 4.8,
    reviews: 128,
    image: "/placeholder.svg?height=200&width=300&text=Small+Party",
    category: "party",
    duration: "4-6 hours",
    locations: ["mumbai", "delhi", "bangalore"],
    featured: true,
    tags: ["trending", "popular"]
  },
  {
    id: "home-decoration",
    name: "Home Decoration Service",
    description: "Professional decoration services for your home",
    price: 3499,
    rating: 4.7,
    reviews: 94,
    image: "/placeholder.svg?height=200&width=300&text=Home+Decoration",
    category: "decoration",
    duration: "3-5 hours",
    locations: ["mumbai", "delhi", "bangalore", "hyderabad"],
    tags: ["bestseller"]
  },
  {
    id: "home-dj",
    name: "Home DJ Service",
    description: "Professional DJ setup with sound system for your home party",
    price: 5999,
    discountedPrice: 4999,
    rating: 4.9,
    reviews: 76,
    image: "/placeholder.svg?height=200&width=300&text=Home+DJ",
    category: "dj",
    duration: "4-8 hours",
    locations: ["mumbai", "delhi", "bangalore"],
    featured: true
  },
  {
    id: "catering",
    name: "Premium Catering Service",
    description: "Gourmet food catering for home events",
    price: 7999,
    rating: 4.6,
    reviews: 112,
    image: "/placeholder.svg?height=200&width=300&text=Catering",
    category: "catering",
    duration: "Flexible",
    locations: ["mumbai", "delhi", "bangalore", "hyderabad", "chennai"],
  }
];

export function FeaturedHomeServices({ onSelect, filteredServices }: FeaturedHomeServicesProps) {
  const services = filteredServices && filteredServices.length > 0 ? filteredServices : defaultServices;

  return (
    <>
      {services.map((service) => (
        <Card 
          key={service.id} 
          className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-0 shadow"
        >
          <div className="relative h-48 bg-gray-100">
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {service.featured && (
              <Badge className="absolute top-3 right-3 bg-pink-600">
                Featured
              </Badge>
            )}
            {service.discountedPrice && (
              <Badge className="absolute top-3 left-3 bg-green-600">
                {Math.round((1 - service.discountedPrice / service.price) * 100)}% OFF
              </Badge>
            )}
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-normal border-orange-200 text-orange-700 bg-orange-50">
                {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
              </Badge>
              <div className="flex items-center text-amber-500 text-sm">
                <Star className="fill-amber-500 stroke-amber-500 h-3.5 w-3.5 mr-1" />
                <span>{service.rating} ({service.reviews})</span>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-1 group-hover:text-pink-600 transition-colors">
              {service.name}
            </h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{service.description}</p>
            
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <Clock className="h-4 w-4 mr-1" />
              <span className="mr-3">{service.duration}</span>
              <MapPin className="h-4 w-4 mr-1" />
              <span>{service.locations.length} locations</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                {service.discountedPrice ? (
                  <>
                    <span className="text-gray-400 line-through text-sm">₹{service.price}</span>
                    <span className="text-pink-600 font-semibold">₹{service.discountedPrice}</span>
                  </>
                ) : (
                  <span className="text-pink-600 font-semibold">₹{service.price}</span>
                )}
              </div>
              <Button 
                size="sm" 
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => onSelect(service.id)}
              >
                Book Now
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
