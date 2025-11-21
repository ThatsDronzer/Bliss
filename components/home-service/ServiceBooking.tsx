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
import { Calendar } from "@/components/ui/calendar";
import { format } from 'date-fns';

interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
}

interface ServiceBookingProps {
  selectedServices: Service[];
  onClose: () => void;
}

export function ServiceBooking({ selectedServices, onClose }: ServiceBookingProps) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [confirmed, setConfirmed] = useState(false);

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
    setStep(4);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Services</DialogTitle>
          <DialogDescription>
            {step === 1 && 'Select your event date and time.'}
            {step === 2 && 'Enter your contact information.'}
            {step === 3 && 'Review and confirm your booking.'}
            {step === 4 && 'Booking Confirmed!'}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Date & Time Picker */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Event Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                fromDate={new Date()}
                className="rounded-lg border"
              />
            </div>
            <div>
              <Label htmlFor="time" className="mb-2 block">Event Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                onClick={handleNext}
                disabled={!date || !time}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                Next
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 2: User Info */}
        {step === 2 && (
          <form onSubmit={e => { e.preventDefault(); handleNext(); }} className="space-y-6">
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
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requests or additional information..."
                className="min-h-[80px]"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white">Next</Button>
            </DialogFooter>
          </form>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <form onSubmit={handleConfirm} className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-2">Booking Summary</h3>
              <ul className="mb-2">
                {selectedServices.map((s) => (
                  <li key={s.id} className="flex justify-between text-sm py-1">
                    <span>{s.name}</span>
                    <span className="font-medium">₹{s.price}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <div><span className="font-medium">Date:</span> {date ? format(date, 'PPP') : '-'}</div>
              <div><span className="font-medium">Time:</span> {time || '-'}</div>
              <div><span className="font-medium">Name:</span> {formData.name}</div>
              <div><span className="font-medium">Email:</span> {formData.email}</div>
              <div><span className="font-medium">Phone:</span> {formData.phone}</div>
              {formData.specialRequests && <div><span className="font-medium">Special Requests:</span> {formData.specialRequests}</div>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white">Confirm Booking</Button>
            </DialogFooter>
          </form>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && confirmed && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-green-700">Booking Confirmed!</h3>
            <p className="text-gray-700 mb-6 text-center">Thank you for booking with us. You will receive a confirmation email shortly.</p>
            <Button onClick={onClose} className="bg-pink-600 hover:bg-pink-700 text-white">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 