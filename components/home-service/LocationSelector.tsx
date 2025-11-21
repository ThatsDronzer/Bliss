'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LocationSelector({ value, onChange, className = '' }: LocationSelectorProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const popularLocations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
  ];

  const filteredLocations = popularLocations.filter(loc =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: string) => {
    onChange(location);
    setIsMapOpen(false);
  };

  return (
    <>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-full h-12 ${className}`}>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Select Location" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Button
              variant="outline"
              className="w-full mb-2"
              onClick={() => setIsMapOpen(true)}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Choose on Map
            </Button>
          </div>
          {popularLocations.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Choose Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              {filteredLocations.map((loc) => (
                <Button
                  key={loc}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleLocationSelect(loc)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {loc}
                </Button>
              ))}
            </div>
            {/* Map placeholder - you would integrate your map component here */}
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map integration coming soon</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 