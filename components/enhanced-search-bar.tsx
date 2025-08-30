"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  const [suggestionPosition, setSuggestionPosition] = useState<"top" | "bottom">("bottom")
  const [suggestionStyle, setSuggestionStyle] = useState<React.CSSProperties>({})
  const searchBarRef = useRef<HTMLDivElement>(null)
  const suggestionRef = useRef<HTMLDivElement>(null)

  // Demo suggestions data
  const suggestions: SearchSuggestion[] = [
    { type: "recent", title: "Event Photography", subtitle: "Delhi", icon: <Clock className="w-4 h-4" /> },
    { type: "recent", title: "Birthday Decoration", subtitle: "Noida", icon: <Clock className="w-4 h-4" /> },
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
    "Delhi NCR",
    "Delhi",
    "Noida",
    "Gurgaon",
    "Faridabad",
    "Ghaziabad",
    "Greater Noida",
    // Popular areas in Delhi
    "Rohini",
    "Punjabi Bagh",
    "Uttam Nagar",
    "Dwarka",
    "Saket",
    "Lajpat Nagar",
    "Karol Bagh",
    "Janakpuri",
    "Vasant Kunj",
    "Connaught Place",
    "Pitampura",
    "Preet Vihar",
    "Mayur Vihar",
    "Rajouri Garden",
    "Hauz Khas",
    "Chandni Chowk",
    "Okhla",
    "Shahdara",
    "Nehru Place",
    "Greater Kailash",
    "South Extension",
    "Malviya Nagar",
    "Ashok Vihar",
    "Paschim Vihar",
    "Model Town",
    "Dwarka Mor",
    "Azadpur",
    "Jangpura",
    "Tilak Nagar",
    "Kalkaji",
    "Sarita Vihar",
    "Patel Nagar",
    "Moti Nagar",
    "Shalimar Bagh",
    "Vikaspuri",
    "Laxmi Nagar",
    "Yamuna Vihar",
    "Seelampur",
    "Sadar Bazaar",
    "Civil Lines",
    "Narela",
    "Najafgarh",
    "Mehrauli",
    "Sultanpur",
    "Tughlakabad",
    "Mandawali",
    "Keshav Puram",
    "Ramesh Nagar",
    "Rithala",
    "Jahangirpuri",
    "Badarpur",
    "Munirka",
    "Vasant Vihar",
    "Green Park",
    "Adarsh Nagar",
    "GTB Nagar",
    "Kashmere Gate",
    "Sarai Rohilla",
    "Sonia Vihar",
    "Trilokpuri",
    "Govindpuri",
    "Sangam Vihar",
    "Jasola",
    "Dwarka Sector 21",
    "Dwarka Sector 12",
    "Dwarka Sector 10",
    "Dwarka Sector 7",
    "Dwarka Sector 6",
    "Dwarka Sector 5",
    "Dwarka Sector 3",
    "Dwarka Sector 1",
  ]

  // Calculate suggestion position based on search bar position and viewport boundaries
  const calculateSuggestionPosition = () => {
    if (searchBarRef.current) {
      const rect = searchBarRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth
      const searchBarBottom = rect.bottom
      const searchBarTop = rect.top
      const searchBarLeft = rect.left
      const searchBarWidth = rect.width
      
      // Estimate suggestion box height (adjust based on actual content)
      const estimatedSuggestionHeight = 400 // Approximate height in pixels
      const margin = 16 // Margin from search bar
      
      // Check if there's enough space below
      const spaceBelow = windowHeight - searchBarBottom - margin
      const spaceAbove = searchBarTop - margin
      
      let position: "top" | "bottom" = "bottom"
      let maxHeight = estimatedSuggestionHeight
      let left = 16
      let right = 16
      
      // Determine vertical position
      if (spaceBelow >= estimatedSuggestionHeight) {
        position = "bottom"
        maxHeight = Math.min(estimatedSuggestionHeight, spaceBelow - margin)
      } else if (spaceAbove >= estimatedSuggestionHeight) {
        position = "top"
        maxHeight = Math.min(estimatedSuggestionHeight, spaceAbove - margin)
      } else {
        // If neither space is sufficient, choose the one with more space
        position = spaceBelow > spaceAbove ? "bottom" : "top"
        maxHeight = Math.min(estimatedSuggestionHeight, Math.max(spaceBelow, spaceAbove) - margin)
      }
      
      // Handle horizontal positioning for smaller screens
      const maxSuggestionWidth = Math.min(800, windowWidth - 32)
      
      // Ensure the suggestion box doesn't go outside the viewport horizontally
      if (searchBarLeft < 16) {
        left = 16
        right = Math.max(16, windowWidth - (searchBarLeft + searchBarWidth) - 16)
      } else if (searchBarLeft + searchBarWidth > windowWidth - 16) {
        right = 16
        left = Math.max(16, windowWidth - maxSuggestionWidth - 16)
      } else {
        // Center the suggestion box with the search bar
        const centerOffset = (maxSuggestionWidth - searchBarWidth) / 2
        left = Math.max(16, searchBarLeft - centerOffset)
        right = Math.max(16, windowWidth - (left + maxSuggestionWidth))
      }
      
      setSuggestionPosition(position)
      setSuggestionStyle({
        maxHeight: `${maxHeight}px`,
        left: `${left}px`,
        right: `${right}px`,
        overflowY: maxHeight < estimatedSuggestionHeight ? 'auto' : 'visible'
      })
    }
  }

  // Simulate location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Simulate detected location
          setUserLocation("Delhi NCR")
        },
        () => {
          console.log("Location access denied")
        },
      )
    }
  }, [])

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (showSuggestions) {
        calculateSuggestionPosition()
      }
    }

    const handleScroll = () => {
      if (showSuggestions) {
        calculateSuggestionPosition()
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showSuggestions])

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set("service", searchQuery)
    }

    if (location !== "Select Location") {
      params.set("location", location)
    }

    router.push(`/explore-services${params.toString() ? `?${params.toString()}` : ""}`)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const params = new URLSearchParams()

    if (suggestion.type === "category") {
      params.set("category", suggestion.title)
    } else if (suggestion.type === "vendor") {
      params.set("service", suggestion.title)
    } else {
      params.set("service", suggestion.title)
    }

    if (suggestion.subtitle && suggestion.subtitle !== suggestion.title) {
      const locationMatch = suggestion.subtitle?.match(/^([A-Za-z\s]+)/)
      if (locationMatch && locationMatch[1]) {
        params.set("location", locationMatch[1].trim())
      }
    }

    router.push(`/explore-services?${params.toString()}`)
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

  const handleInputFocus = () => {
    calculateSuggestionPosition()
    setShowSuggestions(true)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto" ref={searchBarRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className=" flex flex-col lg:flex-row gap-3 bg-white rounded-full shadow-lg border p-2 hover:shadow-xl transition-all duration-300">
          {/* Location Selector */}
          <div className="relative flex-1 min-w-0 lg:min-w-[200px] lg:border-r border-gray-200">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-pink-400" />
            </div>
            <select
              className="w-full pl-12 pr-4 py-3 bg-transparent border-0 focus:ring-0 focus:outline-none text-sm font-medium appearance-none cursor-pointer text-gray-700 rounded-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Select Location">Select Location</option>
              <option value="use-current-location" className="text-pink-600" onClick={detectCurrentLocation}>
                {isDetectingLocation ? "Detecting Location..." : "Use Current Location"}
              </option>
              <option disabled>──────────</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
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
              onFocus={handleInputFocus}
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

      {/* Search Suggestions - Fixed positioning with viewport boundaries */}
      {showSuggestions && (
        <div 
          ref={suggestionRef}
          className={`fixed z-[99999] ${
            suggestionPosition === "top" 
              ? "bottom-auto" 
              : "top-auto"
          }`}
          style={{
            ...suggestionStyle,
            [suggestionPosition === "top" ? "bottom" : "top"]: suggestionPosition === "top" 
              ? `${searchBarRef.current?.getBoundingClientRect().top - 16}px`
              : `${searchBarRef.current?.getBoundingClientRect().bottom + 16}px`
          }}
        >
          <Card className="shadow-2xl border-0 bg-white rounded-2xl overflow-hidden w-full max-w-4xl mx-auto">
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
