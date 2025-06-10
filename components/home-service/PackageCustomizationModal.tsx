'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { occasionPackages } from "@/lib/data/home-service";

interface PackageOption {
  id: string;
  name: string;
  value: string;
  included: boolean;
}

interface PackageCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: string;
  packageName: string;
  isOccasionPackage?: boolean;
  onConfirm: (selectedOptions: PackageOption[], additionalRequirements: string) => void;
}

export function PackageCustomizationModal({
  isOpen,
  onClose,
  packageId,
  packageName,
  isOccasionPackage = false,
  onConfirm,
}: PackageCustomizationModalProps) {
  const [options, setOptions] = useState<PackageOption[]>([]);
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  useEffect(() => {
    if (isOccasionPackage) {
      const occasionPackage = occasionPackages.find(pkg => pkg.id === packageId);
      if (occasionPackage) {
        const packageOptions: PackageOption[] = [
          { id: 'guests', name: 'Number of Guests', value: '50', included: true },
          { id: 'duration', name: 'Event Duration (hours)', value: '4', included: true },
          ...occasionPackage.features.map((feature, index) => ({
            id: `feature-${index}`,
            name: feature,
            value: 'Included',
            included: true
          }))
        ];
        setOptions(packageOptions);
      }
    } else {
      // Standard event package options
      setOptions([
        { id: 'guests', name: 'Number of Guests', value: '200', included: true },
        { id: 'chairs', name: 'Chairs', value: '200', included: true },
        { id: 'tables', name: 'Tables', value: '20', included: true },
        { id: 'tent', name: 'Tent Size (sq ft)', value: '2000', included: true },
        { id: 'lighting', name: 'Lighting Points', value: '20', included: true },
        { id: 'sound', name: 'Sound System', value: 'Professional DJ Setup', included: true },
        { id: 'catering', name: 'Catering (plates)', value: '200', included: true },
        { id: 'decoration', name: 'Decoration Theme', value: 'Premium', included: true },
        { id: 'duration', name: 'Event Duration (hours)', value: '8', included: true },
      ]);
    }
  }, [packageId, isOccasionPackage]);

  const handleOptionToggle = (optionId: string) => {
    setOptions(options.map(option =>
      option.id === optionId
        ? { ...option, included: !option.included }
        : option
    ));
  };

  const handleValueChange = (optionId: string, newValue: string) => {
    setOptions(options.map(option =>
      option.id === optionId
        ? { ...option, value: newValue }
        : option
    ));
  };

  const handleConfirm = () => {
    onConfirm(options, additionalRequirements);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize {packageName}</DialogTitle>
          <DialogDescription>
            Select the options you want to include and specify their values. You can also add any additional requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-start space-x-4">
                <Checkbox
                  id={`checkbox-${option.id}`}
                  checked={option.included}
                  onCheckedChange={() => handleOptionToggle(option.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <Label
                    htmlFor={`input-${option.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.name}
                  </Label>
                  <Input
                    id={`input-${option.id}`}
                    value={option.value}
                    onChange={(e) => handleValueChange(option.id, e.target.value)}
                    disabled={!option.included}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-requirements">Additional Requirements</Label>
            <Textarea
              id="additional-requirements"
              placeholder="Enter any additional requirements or special requests..."
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} className="bg-pink-600 hover:bg-pink-700 text-white">
            Confirm Customization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 