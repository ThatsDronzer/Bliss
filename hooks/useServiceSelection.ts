import { useState, useEffect } from 'react';
import { Service } from '@/lib/types/vendor';

interface UseServiceSelectionReturn {
  selectedServices: Service[];
  totalPrice: number;
  toggleService: (service: Service) => void;
  isServiceSelected: (serviceId: number) => boolean;
}

export function useServiceSelection(): UseServiceSelectionReturn {
  // Initialize state from session storage
  const [selectedServices, setSelectedServices] = useState<Service[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('selectedServices');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [totalPrice, setTotalPrice] = useState(0);

  // Update session storage when selected services change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    }
  }, [selectedServices]);

  useEffect(() => {
    const newTotalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
    setTotalPrice(newTotalPrice);
  }, [selectedServices]);

  const toggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s.id === service.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const isServiceSelected = (serviceId: number): boolean => {
    return selectedServices.some((service) => service.id === serviceId);
  };

  return {
    selectedServices,
    totalPrice,
    toggleService,
    isServiceSelected,
  };
} 