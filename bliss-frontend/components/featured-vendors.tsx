"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Shield, MessageCircle } from "lucide-react"
import { vendors } from "@/lib/data"
import Image from "next/image"

export function FeaturedVendors() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.slice(0, 6).map((vendor) => (
        <Card key={vendor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            <Image
              src={vendor.image || "/placeholder.svg"}
              alt={vendor.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            {vendor.verified && (
              <Badge className="absolute top-2 right-2 bg-green-500">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{vendor.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{vendor.rating}</span>
                <span className="text-sm text-gray-500">({vendor.reviews.length} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{vendor.location}</span>
            </div>

            <Badge variant="secondary" className="mb-2">
              {vendor.category}
            </Badge>

            <p className="text-sm text-gray-600 mb-3">{vendor.description}</p>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-primary">{vendor.price}</span>
              <div className="flex gap-2">
                <Button size="sm">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
