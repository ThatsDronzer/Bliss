"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, MapPin, Star, TrendingUp, Sparkles, ChevronDown, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { ServiceVendorCard } from "@/components/service-vendor-card"
import { ServiceCard } from "@/components/service-card"

// Service categories for filtering
const serviceCategories = [
  "Wedding Venue",
  "Photography & Videography",
  "Catering Services",
  "Decoration & Florist",
  "Music & Entertainment",
  "Transportation",
  "Beauty & Makeup",
  "Wedding Planning",
  "Jewelry & Accessories",
  "Attire & Fashion",
  "DJ & Sound",
  "Lighting",
  "Tent & Marquee",
  "Furniture",
  "Event Planning",
  "Other"
]

// Mock vendor data with multiple services
const vendorsWithServices = [
  {
    id: "v1",
    name: "Royal Wedding Palace",
    rating: 4.8,
    reviewsCount: 320,
    image: "/placeholder.svg?height=200&width=300&text=Venue",
    location: "Delhi NCR",
    experience: "12+ years",
    description: "Premier wedding venue with world-class amenities and exceptional service.",
    featured: true,
    verified: true,
    services: [
      {
        id: "s1",
        name: "Grand Banquet Hall",
        price: 150000,
        category: "Wedding Venue",
        description: "Luxurious banquet hall with modern amenities",
        startingPrice: "₹1,50,000"
      },
      {
        id: "s2",
        name: "Outdoor Garden",
        price: 100000,
        category: "Wedding Venue",
        description: "Beautiful garden venue for outdoor ceremonies",
        startingPrice: "₹1,00,000"
      },
      {
        id: "s3",
        name: "Premium Catering",
        price: 1200,
        category: "Catering Services",
        description: "Exquisite catering with multiple cuisine options",
        startingPrice: "₹1,200/plate"
      }
    ]
  },
  {
    id: "v2",
    name: "Capture Moments Studio",
    rating: 4.9,
    reviewsCount: 156,
    image: "/placeholder.svg?height=200&width=300&text=Photography",
    location: "Mumbai",
    experience: "8+ years",
    description: "Professional photography and videography services for all occasions.",
    featured: true,
    verified: true,
    services: [
      {
        id: "s4",
        name: "Wedding Photography",
        price: 25000,
        category: "Photography & Videography",
        description: "Complete wedding photography coverage",
        startingPrice: "₹25,000"
      },
      {
        id: "s5",
        name: "Wedding Videography",
        price: 35000,
        category: "Photography & Videography",
        description: "Professional wedding video coverage",
        startingPrice: "₹35,000"
      },
      {
        id: "s6",
        name: "Drone Photography",
        price: 15000,
        category: "Photography & Videography",
        description: "Aerial photography and videography",
        startingPrice: "₹15,000"
      }
    ]
  },
  {
    id: "v3",
    name: "Dream Decorators",
    rating: 4.7,
    reviewsCount: 203,
    image: "/placeholder.svg?height=200&width=300&text=Decor",
    location: "Bangalore",
    experience: "10+ years",
    description: "Creative decoration solutions for every occasion.",
    featured: false,
    verified: true,
    services: [
      {
        id: "s7",
        name: "Wedding Decoration",
        price: 50000,
        category: "Decoration & Florist",
        description: "Complete wedding decoration package",
        startingPrice: "₹50,000"
      },
      {
        id: "s8",
        name: "Floral Arrangements",
        price: 25000,
        category: "Decoration & Florist",
        description: "Premium floral decorations and bouquets",
        startingPrice: "₹25,000"
      },
      {
        id: "s9",
        name: "Lighting Setup",
        price: 20000,
        category: "Lighting",
        description: "Professional lighting and mood lighting",
        startingPrice: "₹20,000"
      }
    ]
  },
  {
    id: "v4",
    name: "Beat Masters DJ",
    rating: 4.6,
    reviewsCount: 145,
    image: "/placeholder.svg?height=200&width=300&text=DJ",
    location: "Chennai",
    experience: "6+ years",
    description: "Professional DJ and entertainment services.",
    featured: false,
    verified: true,
    services: [
      {
        id: "s10",
        name: "DJ Services",
        price: 35000,
        category: "Music & Entertainment",
        description: "Professional DJ with equipment",
        startingPrice: "₹35,000"
      },
      {
        id: "s11",
        name: "Sound System",
        price: 15000,
        category: "DJ & Sound",
        description: "High-quality sound system rental",
        startingPrice: "₹15,000"
      },
      {
        id: "s12",
        name: "Live Band",
        price: 60000,
        category: "Music & Entertainment",
        description: "Professional live band performance",
        startingPrice: "₹60,000"
      }
    ]
  },
  {
    id: "v5",
    name: "Glamour Studio",
    rating: 4.8,
    reviewsCount: 189,
    image: "/placeholder.svg?height=200&width=300&text=Makeup",
    location: "Hyderabad",
    experience: "7+ years",
    description: "Professional makeup and beauty services.",
    featured: true,
    verified: true,
    services: [
      {
        id: "s13",
        name: "Bridal Makeup",
        price: 15000,
        category: "Beauty & Makeup",
        description: "Complete bridal makeup package",
        startingPrice: "₹15,000"
      },
      {
        id: "s14",
        name: "Party Makeup",
        price: 8000,
        category: "Beauty & Makeup",
        description: "Professional party makeup",
        startingPrice: "₹8,000"
      },
      {
        id: "s15",
        name: "Hair Styling",
        price: 5000,
        category: "Beauty & Makeup",
        description: "Professional hair styling services",
        startingPrice: "₹5,000"
      }
    ]
  }
]

interface VendorInfo {
  id: string
  name: string
  rating: number
  reviewsCount: number
  image: string
  location: string
  experience?: string
  description?: string
  verified: boolean
}

interface Service {
  id: string
  name: string
  price: number
  category: string
  description: string
  images: string[]
  featured?: boolean
  vendor: VendorInfo
}

// Legacy interface for backward compatibility
interface LegacyService {
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
  services: LegacyService[]
}

export default function ExploreServicesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from URL params
  const initialService = searchParams.get("service") || ""
  const initialLocation = searchParams.get("location") || "All Locations"

  // State for filters
  type Filters = {
    serviceCategories: string[];
    location: string;
    priceRange: string[];
    rating: string[];
  };

  const [filters, setFilters] = useState<Filters>({
    serviceCategories: [],
    location: initialLocation,
    priceRange: [],
    rating: []
  });

  // State for search and sort
  const [searchQuery, setSearchQuery] = useState(initialService)
  const [searchInput, setSearchInput] = useState(initialService)
  const [sortOption, setSortOption] = useState("recommended")
  const [showStickySearch, setShowStickySearch] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])

  // Fetch services data from API (service-first approach)
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/vendor-services');
        const data = await response.json();
        
        if (data && data.services && data.services.length > 0) {
          setServices(data.services);
          setFilteredServices(data.services);
        } else {
          console.log("No services found from API");
          setServices([]);
          setFilteredServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
        setFilteredServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle scroll to show/hide sticky search
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowStickySearch(scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("service", searchQuery)
    if (filters.location !== "All Locations") params.set("location", filters.location)
    if (filters.serviceCategories.length === 1) params.set("category", filters.serviceCategories[0])

    const url = `/explore-services${params.toString() ? `?${params.toString()}` : ""}`
    window.history.replaceState({}, "", url)
  }, [filters, searchQuery])

  // Filter services based on search and filters
  useEffect(() => {
    // Only filter when we have services data
    if (!services.length) return;
    
    let result = [...services]

    // Filter by search query (search in service name, category, description, and vendor name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((service) => {
        return (
          service.name.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.vendor.name.toLowerCase().includes(query) ||
          service.vendor.location.toLowerCase().includes(query)
        )
      })
    }

    // Filter by service categories
    if (filters.serviceCategories.length > 0) {
      result = result.filter((service) => 
        filters.serviceCategories.includes(service.category)
      )
    }

    // Filter by location (vendor location)
    if (filters.location && filters.location !== "All Locations") {
      result = result.filter((service) => service.vendor.location === filters.location)
    }

    // Filter by price range
    if (filters.priceRange.length > 0) {
      result = result.filter((service) => {
        return filters.priceRange.some(range => {
          if (range === "Under ₹10,000") return service.price < 10000
          if (range === "₹10,000 - ₹25,000") return service.price >= 10000 && service.price <= 25000
          if (range === "₹25,000 - ₹50,000") return service.price >= 25000 && service.price <= 50000
          if (range === "₹50,000 - ₹1,00,000") return service.price >= 50000 && service.price <= 100000
          if (range === "Above ₹1,00,000") return service.price > 100000
          return true
        })
      })
    }

    // Filter by rating (vendor rating)
    if (filters.rating.length > 0) {
      result = result.filter((service) => 
        filters.rating.some(rating => {
          const ratingValue = parseFloat(rating.replace("+", ""))
          return service.vendor.rating >= ratingValue
        })
      )
    }

    // Sort services
    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.vendor.rating - a.vendor.rating)
    } else {
      // Default "recommended" sort - featured first, then by rating
      result.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.vendor.rating - a.vendor.rating
      })
    }

    setFilteredServices(result)
  }, [filters, searchQuery, sortOption, services])

  // Handle filter changes
  const handleFilterChange = (type: keyof Omit<Filters, 'location'>, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[type] as string[]
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [type]: updatedValues
      }
    })
  }

  // Handle location change
  const handleLocationChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      location: value,
    }))
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      serviceCategories: [],
      location: "All Locations",
      priceRange: [],
      rating: []
    })
    setSearchQuery("")
    setSearchInput("")
    setSortOption("recommended")
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Sticky Search Bar */}
      <div
        className={`fixed top-[73px] left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 transition-all duration-300 ${
          showStickySearch ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full max-w-4xl mx-auto gap-2 bg-white p-2 rounded-full shadow-lg border border-gray-200"
          >
            {/* Location Dropdown - Icon Only */}
            <div className="relative flex-shrink-0">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400 pointer-events-none z-10" />
              <select
                className="pl-9 pr-7 py-2.5 appearance-none bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
                value={filters.location}
                onChange={(e) => handleLocationChange(e.target.value)}
              >
                <option value="All Locations">All Locations</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Jaipur">Jaipur</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200"></div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Input
                type="text"
                placeholder="Search services..."
                className="w-full px-3 py-2.5 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-xs sm:text-sm font-medium placeholder:text-gray-400"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Search Button - Icon Only */}
            <Button type="submit" className="flex-shrink-0 bg-pink-600 hover:bg-pink-700 shadow-md h-10 w-10 rounded-full p-0 flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </Button>
          </form>
        </div>
      </div>

      {/* Regular Search Bar */}
      <div className="bg-white py-4 sm:py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center w-full max-w-4xl mx-auto gap-2 bg-gray-50 p-2 rounded-full shadow-lg border border-gray-200"
          >
            {/* Location Dropdown - Icon Only */}
            <div className="relative flex-shrink-0">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-400 pointer-events-none z-10" />
              <select
                className="pl-9 pr-7 py-2.5 appearance-none bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
                value={filters.location}
                onChange={(e) => handleLocationChange(e.target.value)}
              >
                <option value="All Locations">All Locations</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Jaipur">Jaipur</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200"></div>

            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Input
                type="text"
                placeholder="Search services..."
                className="w-full px-3 py-2.5 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-xs sm:text-sm font-medium placeholder:text-gray-400"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            {/* Search Button - Icon Only */}
            <Button type="submit" className="flex-shrink-0 bg-pink-600 hover:bg-pink-700 shadow-md h-10 w-10 rounded-full p-0 flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </Button>
          </form>

          {/* Active Filter Chips */}
          {(filters.serviceCategories.length > 0 || filters.priceRange.length > 0 || filters.rating.length > 0 || filters.location !== "All Locations") && (
            <div className="max-w-4xl mx-auto mt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-600">Active filters:</span>
                
                {filters.location !== "All Locations" && (
                  <Badge variant="secondary" className="gap-1 pr-1 bg-pink-100 text-pink-700 hover:bg-pink-200">
                    <MapPin className="w-3 h-3" />
                    {filters.location}
                    <button
                      onClick={() => handleLocationChange("All Locations")}
                      className="ml-1 hover:bg-pink-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}

                {filters.serviceCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1 pr-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {category}
                    <button
                      onClick={() => handleFilterChange("serviceCategories", category)}
                      className="ml-1 hover:bg-blue-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}

                {filters.priceRange.map((price) => (
                  <Badge key={price} variant="secondary" className="gap-1 pr-1 bg-green-100 text-green-700 hover:bg-green-200">
                    {price}
                    <button
                      onClick={() => handleFilterChange("priceRange", price)}
                      className="ml-1 hover:bg-green-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}

                {filters.rating.map((rating) => (
                  <Badge key={rating} variant="secondary" className="gap-1 pr-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                    <Star className="w-3 h-3 fill-yellow-600" />
                    {rating}
                    <button
                      onClick={() => handleFilterChange("rating", rating)}
                      className="ml-1 hover:bg-yellow-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-6 px-2 text-xs text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Filters Sidebar - Hidden on Mobile */}
          <div className="hidden md:block md:w-64 shrink-0">
            <Card className="sticky top-32 bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold flex items-center gap-2 text-gray-800">
                    <Filter className="h-4 w-4 text-pink-600" />
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-pink-600 hover:bg-pink-50"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </Button>
                </div>

                <Accordion type="multiple" defaultValue={["services", "price", "rating"]}>
                  <AccordionItem value="services" className="border-gray-200">
                    <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                      Service Categories
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {serviceCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`service-${category}`}
                              checked={filters.serviceCategories.includes(category)}
                              onCheckedChange={() => handleFilterChange("serviceCategories", category)}
                              className="border-pink-300 data-[state=checked]:bg-pink-600"
                            />
                            <Label
                              htmlFor={`service-${category}`}
                              className="text-sm font-normal text-gray-600 cursor-pointer"
                            >
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price" className="border-gray-200">
                    <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                      Price Range
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {["Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1,00,000", "Above ₹1,00,000"].map((price) => (
                          <div key={price} className="flex items-center space-x-2">
                            <Checkbox
                              id={`price-${price}`}
                              checked={filters.priceRange.includes(price)}
                              onCheckedChange={() => handleFilterChange("priceRange", price)}
                              className="border-pink-300 data-[state=checked]:bg-pink-600"
                            />
                            <Label
                              htmlFor={`price-${price}`}
                              className="text-sm font-normal text-gray-600 cursor-pointer"
                            >
                              {price}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="rating" className="border-gray-200">
                    <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                      Rating
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {["4.5+", "4.0+", "3.5+", "3.0+"].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <Checkbox
                              id={`rating-${rating}`}
                              checked={filters.rating.includes(rating)}
                              onCheckedChange={() => handleFilterChange("rating", rating)}
                              className="border-pink-300 data-[state=checked]:bg-pink-600"
                            />
                            <Label
                              htmlFor={`rating-${rating}`}
                              className="text-sm font-normal text-gray-600 cursor-pointer flex items-center gap-1"
                            >
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {rating}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Listings */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4 flex items-center gap-2">
              <Button 
                onClick={() => setShowMobileFilters(true)} 
                variant="outline"
                className="flex-1 justify-center gap-2 h-10 border-pink-200 hover:bg-pink-50"
              >
                <Filter className="h-4 w-4 text-pink-600" />
                <span className="font-medium">Filters</span>
                {(filters.serviceCategories.length + filters.priceRange.length + filters.rating.length + (filters.location !== "All Locations" ? 1 : 0)) > 0 && (
                  <Badge className="bg-pink-600 text-white ml-1 h-5 min-w-[20px] flex items-center justify-center">
                    {filters.serviceCategories.length + filters.priceRange.length + filters.rating.length + (filters.location !== "All Locations" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32 h-10 border-pink-200 focus:border-pink-400">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-pink-600" />
                      Recommended
                    </div>
                  </SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Rating
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Explore Services</h1>
                <p className="text-gray-600 mt-1">
                  {searchQuery ? `Search results for "${searchQuery}"` : "Discover the perfect service for your needs"}
                </p>
                {filteredServices.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px] h-9 border-pink-200 focus:border-pink-400">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-pink-600" />
                        Recommended
                      </div>
                    </SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Rating
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile Title */}
            <div className="md:hidden mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Explore Services</h1>
              {filteredServices.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
                </p>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Loading services...</h3>
                <p className="text-gray-500">Please wait while we fetch the latest services</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No services found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-pink-600" />
                Filters
              </SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-pink-600 hover:bg-pink-50"
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            <Accordion type="multiple" defaultValue={["services", "price", "rating"]} className="w-full">
              <AccordionItem value="services" className="border-gray-200">
                <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                  Service Categories
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {serviceCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-service-${category}`}
                          checked={filters.serviceCategories.includes(category)}
                          onCheckedChange={() => handleFilterChange("serviceCategories", category)}
                          className="border-pink-300 data-[state=checked]:bg-pink-600"
                        />
                        <Label
                          htmlFor={`mobile-service-${category}`}
                          className="text-sm font-normal text-gray-600 cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="price" className="border-gray-200">
                <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                  Price Range
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {["Under ₹10,000", "₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "₹50,000 - ₹1,00,000", "Above ₹1,00,000"].map((price) => (
                      <div key={price} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-price-${price}`}
                          checked={filters.priceRange.includes(price)}
                          onCheckedChange={() => handleFilterChange("priceRange", price)}
                          className="border-pink-300 data-[state=checked]:bg-pink-600"
                        />
                        <Label
                          htmlFor={`mobile-price-${price}`}
                          className="text-sm font-normal text-gray-600 cursor-pointer"
                        >
                          {price}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rating" className="border-gray-200">
                <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                  Rating
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {["4.5+", "4.0+", "3.5+", "3.0+"].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-rating-${rating}`}
                          checked={filters.rating.includes(rating)}
                          onCheckedChange={() => handleFilterChange("rating", rating)}
                          className="border-pink-300 data-[state=checked]:bg-pink-600"
                        />
                        <Label
                          htmlFor={`mobile-rating-${rating}`}
                          className="text-sm font-normal text-gray-600 cursor-pointer flex items-center gap-1"
                        >
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {rating}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 pb-2 mt-6 border-t">
            <Button 
              onClick={() => setShowMobileFilters(false)} 
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
            >
              Show {filteredServices.length} Result{filteredServices.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Footer */}
      <Footer />
    </main>
  )
} 