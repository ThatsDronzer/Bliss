"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from 'next/link';

interface Service {
  id: string
  name: string
  price: number
  description: string
  images?: string[]
  features?: string[]
  isActive: boolean
}

interface ServiceCardProps {
  service: Service
  isSelected: boolean
  onSelect: () => void
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-pink-600' : ''} bg-white/90 shadow-md hover:shadow-lg`}> 
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
              {service.name}
              {!service.isActive && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Currently Unavailable
                </Badge>
              )}
            </h3>
          </div>
          <span className="text-xl font-bold">₹{service.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
        {service.features && service.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {service.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                {feature}
              </Badge>
            ))}
          </div>
        )}
        <Button 
          variant={isSelected ? "default" : "outline"}
          className="w-full mb-2"
          onClick={onSelect}
          disabled={!service.isActive}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Selected
            </>
          ) : (
            'Select Service'
          )}
        </Button>
        <Link href={`/services/${service.id}`} passHref legacyBehavior>
          <Button asChild variant="default" className="w-full mt-1">
            <a>View Details</a>
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 