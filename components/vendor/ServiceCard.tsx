"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

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
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-pink-600' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
            <Badge variant="secondary" className="bg-gray-100">
              {service.description.length > 30 
                ? service.description.substring(0, 30) + "..."
                : service.description}
            </Badge>
          </div>
          <span className="text-xl font-bold">₹{service.price}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        <Button 
          variant={isSelected ? "default" : "outline"}
          className="w-full"
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
      </CardContent>
    </Card>
  )
} 