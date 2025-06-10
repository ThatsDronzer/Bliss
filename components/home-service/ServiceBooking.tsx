'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ServiceBookingProps {
  selectedServices: string[];
  selectedPackage: {
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
  } | null;
  onClose: () => void;
}

export function ServiceBooking({ selectedServices, selectedPackage, onClose }: ServiceBookingProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    location: '',
    specialRequests: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', {
      formData,
      selectedServices,
      selectedPackage
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Services</DialogTitle>
          <DialogDescription>
            Fill in your details to complete the booking
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedPackage && (
            <div className="space-y-4">
              <h3 className="font-semibold">Selected Package Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                {selectedPackage.customizations?.options
                  .filter(option => option.included)
                  .map(option => (
                    <div key={option.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{option.name}</span>
                      <span className="font-medium">{option.value}</span>
                    </div>
                  ))
                }
                {selectedPackage.customizations?.additionalRequirements && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Additional Requirements:</h4>
                    <p className="text-sm text-gray-600">
                      {selectedPackage.customizations.additionalRequirements}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Event Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Event Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Event Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Any special requests or additional information..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
              Confirm Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 