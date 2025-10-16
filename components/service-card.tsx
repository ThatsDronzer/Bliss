"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Star, Heart, User, BadgeCheck } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"

interface VendorInfo {
  id: string
  name: string
  image: string
  location: string
  rating: number
  verified: boolean
  reviewsCount?: number
}

interface Service {
  id: string
  name: string
  price: number
  category: string
  description: string
  images: string[]
  vendor: VendorInfo
  featured?: boolean
}

interface ServiceCardProps {
  service: Service
  searchQuery?: string
  onFavoriteToggle?: (serviceId: string) => void
}

export function ServiceCard({ service, searchQuery = "", onFavoriteToggle }: ServiceCardProps) {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isSignedIn) {
      toast({
        title: "Login Required",
        description: "Please login to save services to your favorites",
        variant: "destructive",
      })
      return
    }

    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite 
        ? "Service has been removed from your favorites" 
        : "Service has been added to your favorites",
    })

    if (onFavoriteToggle) {
      onFavoriteToggle(service.id)
    }
  }

  const handleServiceClick = () => {
    router.push(`/services/${service.id}`)
  }

  const handleVendorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/vendors/${service.vendor.id}`)
  }

  // Use vendor avatar image as the primary image for the service card
  const primaryImage = service.vendor.image || "/placeholder.svg?height=200&width=300&text=Vendor"

  return (
    <Card
      className="overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white"
      onClick={handleServiceClick}
    >
      {/* Service Image (Using Vendor Avatar) */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={primaryImage}
          alt={service.vendor.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Favorite Button */}
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/90 hover:bg-white shadow-md"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {service.featured && (
            <Badge className="bg-pink-600 text-white shadow-md">Featured</Badge>
          )}
          <Badge className="bg-blue-600 text-white shadow-md">{service.category}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Service Name and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-base text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-2 flex-1 mr-2">
            {service.name}
          </h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md flex-shrink-0">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-semibold text-gray-700">{service.vendor.rating}</span>
          </div>
        </div>

        {/* Service Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
          {service.description || "Professional service with quality guarantee"}
        </p>

        {/* Vendor Information - Compact */}
        <div 
          className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg mb-3 hover:bg-pink-50 transition-colors"
          onClick={handleVendorClick}
        >
          <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
            <Image
              src={service.vendor.image || "/placeholder.svg?height=32&width=32&text=V"}
              alt={service.vendor.name}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-gray-800 truncate">
                {service.vendor.name}
              </p>
              {service.vendor.verified && (
                <BadgeCheck className="h-3 w-3 text-green-600 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="h-3 w-3 mr-0.5 flex-shrink-0" />
              <span className="truncate">{service.vendor.location}</span>
            </div>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-lg font-bold text-pink-600">
              ₹{service.price.toLocaleString('en-IN')}
            </p>
          </div>
          <Button 
            size="sm" 
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceCard
