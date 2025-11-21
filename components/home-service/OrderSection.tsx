'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  specialization: string;
  image: string;
}

interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed';
  items: string[];
  totalAmount: number;
  serviceProvider?: ServiceProvider;
  scheduledDate?: string;
}

const mockServiceProvider: ServiceProvider = {
  id: "sp-1",
  name: "John Smith",
  rating: 4.8,
  specialization: "Home Maintenance Expert",
  image: "/service-provider-avatar.jpg"
};

export function OrderSection() {
  const [order, setOrder] = useState<Order>({
    id: "order-1",
    status: 'pending',
    items: ["Deep House Cleaning", "Electrical Repair"],
    totalAmount: 140,
  });

  const handleConfirmOrder = () => {
    setOrder(prev => ({
      ...prev,
      status: 'confirmed',
      serviceProvider: mockServiceProvider,
      scheduledDate: new Date(Date.now() + 86400000).toLocaleDateString()
    }));
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Order Summary</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Selected Services:</h3>
                <ul className="list-disc list-inside">
                  {order.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Total Amount:</h3>
                <p className="text-2xl font-bold">${order.totalAmount}</p>
              </div>

              {order.serviceProvider ? (
                <div className="border rounded-lg p-4 mt-4">
                  <h3 className="font-semibold mb-4">Service Provider</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                      <img
                        src={order.serviceProvider.image}
                        alt={order.serviceProvider.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{order.serviceProvider.name}</p>
                      <p className="text-sm text-gray-600">{order.serviceProvider.specialization}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{order.serviceProvider.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Scheduled for: {order.scheduledDate}
                  </p>
                </div>
              ) : (
                <Button 
                  onClick={handleConfirmOrder}
                  className="w-full"
                >
                  Confirm Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 