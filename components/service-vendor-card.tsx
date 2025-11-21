"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Star, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth, useUser } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"

interface Service {
  id: string
  name: string
  price: number
  category: string
  description: string
  startingPrice: string
}

interface Vendor {
  id: string
  name: string
  rating: number
  reviewsCount: number
  image: string
  location: string
  experience: string
  description: string
  featured: boolean
  verified: boolean
  services: Service[]
}

interface ServiceVendorCardProps {
  vendor: Vendor
  searchQuery?: string
  onFavoriteToggle?: (vendorId: string) => void
}

export function ServiceVendorCard({ vendor, searchQuery = "", onFavoriteToggle }: ServiceVendorCardProps) {
  const router = useRouter()
  const { isAuthenticated, toggleFavorite, favorites } = useAuth()
  const { toast } = useToast()

  const isVendorFavorite = (vendorId: string) => {
    return favorites?.some((fav) => fav.id === vendorId) || false
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to save vendors to your favorites",
        variant: "destructive",
      })
      return
    }

    const result = toggleFavorite(vendor.id)
    toast({
      title: result ? "Added to Favorites" : "Removed from Favorites",
      description: result ? "Vendor has been added to your favorites" : "Vendor has been removed from your favorites",
    })

    if (onFavoriteToggle) {
      onFavoriteToggle(vendor.id)
    }
  }

  const handleVendorClick = () => {
    router.push(`/vendors/${vendor.id}`)
  }

  // Get relevant services for a vendor based on search query
  const getRelevantServices = () => {
    if (!searchQuery) return vendor.services.slice(0, 3)
    
    const query = searchQuery.toLowerCase()
    return vendor.services
      .filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
      )
      .slice(0, 3)
  }

  const relevantServices = getRelevantServices()

  return (
    <div
      className="bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleVendorClick}
    >
      <div className="relative h-48">
        <img 
          src={vendor.image} 
          alt={vendor.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 hover:bg-white shadow-sm"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-5 w-5 ${isVendorFavorite(vendor.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
        </div>
        {vendor.featured && (
          <Badge className="absolute top-2 left-2 bg-pink-600">Featured</Badge>
        )}
        {vendor.verified && (
          <Badge className="absolute bottom-2 left-2 bg-green-600">Verified</Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors">
            {vendor.name}
          </h3>
          <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{vendor.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{vendor.location}</span>
        </div>
        
        {/* Relevant Services */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Services Offered:</h4>
          <div className="space-y-2">
            {relevantServices.map((service) => (
              <div key={service.id} className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{service.name}</p>
                  <p className="text-xs text-gray-600">{service.category}</p>
                </div>
                <span className="text-sm font-semibold text-pink-600">{service.startingPrice}</span>
              </div>
            ))}
            {vendor.services.length > relevantServices.length && (
              <p className="text-xs text-gray-500 text-center">
                +{vendor.services.length - relevantServices.length} more services
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {vendor.reviewsCount} reviews
          </div>
          <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ServiceVendorCard 