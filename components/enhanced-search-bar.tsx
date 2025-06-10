"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Clock, TrendingUp, Star, Sparkles, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SearchSuggestion {
  type: "recent" | "popular" | "category" | "vendor"
  title: string
  subtitle?: string
  icon?: React.ReactNode
  rating?: number
}

export function EnhancedSearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("Select Location")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [userLocation, setUserLocation] = useState<string | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  // Demo suggestions data
  const suggestions: SearchSuggestion[] = [
    { type: "recent", title: "Event Photography", subtitle: "Mumbai", icon: <Clock className="w-4 h-4" /> },
    { type: "recent", title: "Birthday Decoration", subtitle: "Delhi", icon: <Clock className="w-4 h-4" /> },
    {
      type: "popular",
      title: "Grand Palace Banquet",
      subtitle: "Venue • 4.8★",
      icon: <TrendingUp className="w-4 h-4" />,
      rating: 4.8,
    },
    {
      type: "popular",
      title: "Royal Caterers",
      subtitle: "Catering • 4.9★",
      icon: <TrendingUp className="w-4 h-4" />,
      rating: 4.9,
    },
    { type: "category", title: "DJ Services", subtitle: "Music & Entertainment", icon: <Search className="w-4 h-4" /> },
    { type: "category", title: "Makeup Artists", subtitle: "Beauty & Styling", icon: <Search className="w-4 h-4" /> },
  ]

  const locations = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
  ]

  // Simulate location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Simulate detected location
          setUserLocation("Mumbai")
        },
        () => {
          console.log("Location access denied")
        },
      )
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set("search", searchQuery)
    }

    if (location !== "Select Location") {
      params.set("location", location)
    }

    router.push(`/vendors${params.toString() ? `?${params.toString()}` : ""}`)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const params = new URLSearchParams()

    if (suggestion.type === "category") {
      params.set("category", suggestion.title)
    } else if (suggestion.type === "vendor") {
      params.set("search", suggestion.title)
    } else {
      params.set("search", suggestion.title)
    }

    if (suggestion.subtitle && suggestion.subtitle !== suggestion.title) {
      const locationMatch = suggestion.subtitle.match(/^([A-Za-z\s]+)/)
      if (locationMatch) {
        params.set("location", locationMatch[1].trim())
      }
    }

    router.push(`/vendors?${params.toString()}`)
    setShowSuggestions(false)
  }

  const detectCurrentLocation = () => {
    setIsDetectingLocation(true)

    // Simulate location detection with animation
    setTimeout(() => {
      if (userLocation) {
        setLocation(userLocation)
      }
      setIsDetectingLocation(false)
    }, 2000)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className=" flex flex-col lg:flex-row gap-3 bg-white rounded-full shadow-lg border p-2 hover:shadow-xl transition-all duration-300">
          {/* Location Selector */}
          <div className="relative flex-1 min-w-0 lg:min-w-[200px] lg:border-r border-gray-200">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-pink-400" />
            </div>
            <select
              className="w-full pl-12 pr-16 py-3 bg-transparent border-0 focus:ring-0 focus:outline-none text-sm font-medium appearance-none cursor-pointer text-gray-700 rounded-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Select Location">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Live Location Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs hover:bg-pink-50 transition-all duration-200 px-2 py-1 h-auto ${
                isDetectingLocation ? "animate-pulse" : ""
              }`}
              onClick={detectCurrentLocation}
              disabled={isDetectingLocation}
            >
              <Navigation className={`w-3 h-3 mr-1 ${isDetectingLocation ? "animate-spin" : ""}`} />
              {isDetectingLocation ? "Detecting..." : "Live"}
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative flex-[2] min-w-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-pink-400" />
            </div>
            <Input
              type="text"
              placeholder="Search for vendors, services, venues..."
              className="w-full pl-12 pr-4 py-3 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium bg-transparent placeholder:text-gray-400 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="px-6 lg:px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </form>

      {/* Search Suggestions - Fixed positioning with higher z-index */}
      {showSuggestions && (
        <div className=" fixed inset-x-4 top-auto z-[99999] mt-4 max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-500" />
                    Recent Searches
                  </h4>
                  <div className="space-y-2">
                    {suggestions
                      .filter((s) => s.type === "recent")
                      .map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 hover:bg-pink-50 rounded-xl transition-all duration-200 flex items-center gap-3 group"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-all">
                            {suggestion.icon}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-800">{suggestion.title}</div>
                            <div className="text-xs text-gray-500">{suggestion.subtitle}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    Popular Vendors
                  </h4>
                  <div className="space-y-2">
                    {suggestions
                      .filter((s) => s.type === "popular")
                      .map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 hover:bg-orange-50 rounded-xl transition-all duration-200 flex items-center gap-3 group"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-all">
                            {suggestion.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-800">{suggestion.title}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              {suggestion.subtitle}
                              {suggestion.rating && (
                                <Badge variant="secondary" className="text-xs ml-2 bg-yellow-100 text-yellow-800">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  {suggestion.rating}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-500" />
                    Browse Categories
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestions
                      .filter((s) => s.type === "category")
                      .map((suggestion, index) => (
                        <button
                          key={index}
                          className="text-left p-3 hover:bg-blue-50 rounded-xl transition-all duration-200 flex items-center gap-2 group"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-all">
                            {suggestion.icon}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-800">{suggestion.title}</div>
                            <div className="text-xs text-gray-500">{suggestion.subtitle}</div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
