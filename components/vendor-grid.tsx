"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MapPin, Star, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { vendors } from "@/lib/data"
import { useAuth, useUser } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"

interface VendorGridProps {
  limit?: number
  filters?: {
    region?: string[]
    city?: string[]
    category?: string[]
    priceRange?: string[]
    cultural?: string[]
    eventTypes?: string[]
    location?: string
  }
  searchQuery?: string
  sortOption?: string
}

export function VendorGrid({ limit, filters = {}, searchQuery = "", sortOption = "recommended" }: VendorGridProps) {
  const router = useRouter()
  const { isAuthenticated, toggleFavorite, favorites } = useAuth()
  const { toast } = useToast()
  const [filteredVendors, setFilteredVendors] = useState(vendors)

  useEffect(() => {
    let result = [...vendors]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(query) ||
          vendor.category.toLowerCase().includes(query) ||
          vendor.location.toLowerCase().includes(query),
      )
    }

    // Filter by location
    if (filters.location && filters.location !== "All Locations") {
      result = result.filter((vendor) => vendor.location === filters.location)
    }

    // Filter by region
    if (filters.region && filters.region.length > 0) {
      result = result.filter((vendor) => filters.region?.includes(vendor.region))
    }

    // Filter by city
    if (filters.city && filters.city.length > 0) {
      result = result.filter((vendor) => filters.city?.includes(vendor.city))
    }

    // Filter by category
    if (filters.category && filters.category.length > 0) {
      result = result.filter((vendor) => filters.category?.includes(vendor.category))
    }

    // Filter by price range
    if (filters.priceRange && filters.priceRange.length > 0) {
      result = result.filter((vendor) => filters.priceRange?.includes(vendor.priceRange))
    }

    // Filter by event types
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      result = result.filter((vendor) => vendor.eventTypes?.some((type: string) => filters.eventTypes?.includes(type)))
    }

    // Sort vendors
    if (sortOption === "price-low") {
      result.sort((a, b) => {
        // Extract the first number from price strings with null checks
        const priceA = a.price && typeof a.price === 'string' ? 
          (a.price.match(/\d+/) ? parseInt(a.price.match(/\d+/)[0]) : 0) : 0
        const priceB = b.price && typeof b.price === 'string' ? 
          (b.price.match(/\d+/) ? parseInt(b.price.match(/\d+/)[0]) : 0) : 0
        return priceA - priceB
      })
    } else if (sortOption === "price-high") {
      result.sort((a, b) => {
        // Extract the first number from price strings with null checks
        const priceA = a.price && typeof a.price === 'string' ? 
          (a.price.match(/\d+/) ? parseInt(a.price.match(/\d+/)[0]) : 0) : 0
        const priceB = b.price && typeof b.price === 'string' ? 
          (b.price.match(/\d+/) ? parseInt(b.price.match(/\d+/)[0]) : 0) : 0
        return priceB - priceA
      })
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    } else {
      // Default "recommended" sort - featured first, then by rating
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.rating - a.rating
      })
    }

    // Apply limit if provided
    if (limit) {
      result = result.slice(0, limit)
    }

    setFilteredVendors(result)
  }, [filters, searchQuery, sortOption, limit])

  const handleFavoriteClick = (e: React.MouseEvent, vendorId: string) => {
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

    const result = toggleFavorite(vendorId)
    toast({
      title: result ? "Added to Favorites" : "Removed from Favorites",
      description: result ? "Vendor has been added to your favorites" : "Vendor has been removed from your favorites",
    })
  }

  const isVendorFavorite = (vendorId: string) => {
    return favorites?.some((fav) => fav.id === vendorId) || false
  }

  const handleVendorClick = (vendorId: string) => {
    router.push(`/vendors/${vendorId}`)
  }

  if (filteredVendors.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No vendors found</h3>
        <p className="text-gray-500">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVendors.map((vendor) => (
        <div
          key={vendor.id}
          className="bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleVendorClick(vendor.id)}
        >
          <div className="relative h-48">
            <Image src={vendor.image || "/placeholder.svg"} alt={vendor.name} fill className="object-cover" />
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/80 hover:bg-white"
                onClick={(e) => handleFavoriteClick(e, vendor.id)}
              >
                <Heart
                  className={`h-5 w-5 ${isVendorFavorite(vendor.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </Button>
            </div>
            <Badge className="absolute top-2 left-2">{vendor.category}</Badge>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{vendor.name}</h3>
              <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{vendor.rating}</span>
              </div>
            </div>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{vendor.location}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {vendor.eventTypes?.slice(0, 3).map((type: string) => (
                <span key={type} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  {type}
                </span>
              ))}
              {vendor.eventTypes && vendor.eventTypes.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  +{vendor.eventTypes.length - 3}
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-primary">{vendor.price}</span>
                <span className="text-xs text-gray-500 ml-1">onwards</span>
              </div>
              <Button size="sm">View Details</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VendorGrid
