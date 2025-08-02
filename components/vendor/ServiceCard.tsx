"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from 'next/link';

interface Service {
  id: number
  name: string
  price: number
  description: string
}

interface ServiceCardProps {
  service: Service
  isSelected: boolean
  onSelect: () => void
  duration?: string
  availability?: string
}

export function ServiceCard({ service, isSelected, onSelect, duration, availability }: ServiceCardProps) {
  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-pink-600' : ''} bg-white/90 shadow-md hover:shadow-lg`}> 
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
              {service.name}
              {duration && (
                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">⏱ {duration}</span>
              )}
            </h3>
            {/* <Badge variant="secondary" className="bg-gray-100">
              {service.description.length > 30 
                ? service.description.substring(0, 30) + "..."
                : service.description}
            </Badge> */}
          </div>
          <span className="text-xl font-bold">₹{service.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
        {availability && (
          <div className="flex items-center gap-2 mb-2 text-xs text-green-700">
            <svg width="16" height="16" fill="currentColor" className="inline-block"><circle cx="8" cy="8" r="8" fill="#22c55e" /></svg>
            <span>Available: {availability}</span>
          </div>
        )}
        <Button 
          variant={isSelected ? "default" : "outline"}
          className="w-full mb-2"
          onClick={onSelect}
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
            <a>View Service</a>
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 