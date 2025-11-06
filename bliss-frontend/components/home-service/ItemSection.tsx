'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  category: string;
}

const serviceItems: ServiceItem[] = [
  {
    id: "cleaning-1",
    name: "Deep House Cleaning",
    price: 80,
    duration: "4 hours",
    category: "Cleaning"
  },
  {
    id: "repair-1",
    name: "Electrical Repair",
    price: 60,
    duration: "2 hours",
    category: "Repair"
  },
  {
    id: "plumbing-1",
    name: "Plumbing Service",
    price: 70,
    duration: "2 hours",
    category: "Plumbing"
  },
  {
    id: "painting-1",
    name: "Room Painting",
    price: 120,
    duration: "6 hours",
    category: "Painting"
  },
  {
    id: "gardening-1",
    name: "Garden Maintenance",
    price: 50,
    duration: "3 hours",
    category: "Gardening"
  },
  {
    id: "pest-1",
    name: "Pest Control",
    price: 90,
    duration: "2 hours",
    category: "Pest Control"
  }
];

export function ItemSection() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const totalPrice = selectedItems.reduce((sum, itemId) => {
    const item = serviceItems.find(item => item.id === itemId);
    return sum + (item?.price || 0);
  }, 0);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Select Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceItems.map((item) => (
            <Card key={item.id} className={`cursor-pointer transition-all ${
              selectedItems.includes(item.id) ? 'ring-2 ring-primary' : ''
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleItemToggle(item.id)}
                />
              </CardHeader>
              <CardContent>
                <div className="grid gap-1">
                  <div className="text-2xl font-bold">${item.price}</div>
                  <p className="text-xs text-gray-500">Duration: {item.duration}</p>
                  <p className="text-xs text-gray-500">Category: {item.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-2xl font-bold mb-4">
            Total: ${totalPrice}
          </div>
          <Button 
            size="lg"
            disabled={selectedItems.length === 0}
          >
            Proceed with Selected Services
          </Button>
        </div>
      </div>
    </section>
  );
} 