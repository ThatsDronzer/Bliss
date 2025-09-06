"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, MapPin, Star, TrendingUp, Sparkles, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { ServiceVendorCard } from "@/components/service-vendor-card"

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

export default function ExploreServicesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from URL params
  const initialService = searchParams.get("service") || ""
  const initialLocation = searchParams.get("location") || "All Locations"

  // State for filters
  const [filters, setFilters] = useState({
    serviceCategories: [] as string[],
    location: initialLocation,
    priceRange: [] as string[],
    rating: [] as string[]
  })

  // State for search and sort
  const [searchQuery, setSearchQuery] = useState(initialService)
  const [searchInput, setSearchInput] = useState(initialService)
  const [sortOption, setSortOption] = useState("recommended")
  const [showStickySearch, setShowStickySearch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])

  // Fetch vendor services data from API
  useEffect(() => {
    const fetchVendorServices = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/vendor-services');
        const data = await response.json();
        
        if (data && data.vendorServices) {
          setVendors(data.vendorServices);
          // Initially set filtered vendors to all vendors
          setFilteredVendors(data.vendorServices);
        } else {
          // Fallback to mock data if API returns no data
          console.log("No vendor services found, using mock data");
          setVendors(vendorsWithServices);
          setFilteredVendors(vendorsWithServices);
        }
      } catch (error) {
        console.error("Error fetching vendor services:", error);
        // Fallback to mock data on error
        setVendors(vendorsWithServices);
        setFilteredVendors(vendorsWithServices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorServices();
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

  // Filter vendors based on search and filters
  useEffect(() => {
    // Only filter when we have vendors data
    if (!vendors.length) return;
    
    let result = [...vendors]

    // Filter by search query (search in vendor name, services, and descriptions)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((vendor) => {
        // Check vendor name and description
        if (vendor.name.toLowerCase().includes(query) || 
            vendor.description.toLowerCase().includes(query)) {
          return true
        }
        // Check if any service matches the query
        return vendor.services.some(service => 
          service.name.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query)
        )
      })
    }

    // Filter by service categories
    if (filters.serviceCategories.length > 0) {
      result = result.filter((vendor) => 
        vendor.services.some(service => 
          filters.serviceCategories.includes(service.category)
        )
      )
    }

    // Filter by location
    if (filters.location && filters.location !== "All Locations") {
      result = result.filter((vendor) => vendor.location === filters.location)
    }

    // Filter by price range
    if (filters.priceRange.length > 0) {
      result = result.filter((vendor) => {
        const minPrice = Math.min(...vendor.services.map(s => s.price))
        return filters.priceRange.some(range => {
          if (range === "Under ₹10,000") return minPrice < 10000
          if (range === "₹10,000 - ₹25,000") return minPrice >= 10000 && minPrice <= 25000
          if (range === "₹25,000 - ₹50,000") return minPrice >= 25000 && minPrice <= 50000
          if (range === "₹50,000 - ₹1,00,000") return minPrice >= 50000 && minPrice <= 100000
          if (range === "Above ₹1,00,000") return minPrice > 100000
          return true
        })
      })
    }

    // Filter by rating
    if (filters.rating.length > 0) {
      result = result.filter((vendor) => 
        filters.rating.some(rating => {
          const ratingValue = parseFloat(rating.replace("+", ""))
          return vendor.rating >= ratingValue
        })
      )
    }

    // Sort vendors
    if (sortOption === "price-low") {
      result.sort((a, b) => {
        const minPriceA = Math.min(...a.services.map(s => s.price))
        const minPriceB = Math.min(...b.services.map(s => s.price))
        return minPriceA - minPriceB
      })
    } else if (sortOption === "price-high") {
      result.sort((a, b) => {
        const minPriceA = Math.min(...a.services.map(s => s.price))
        const minPriceB = Math.min(...b.services.map(s => s.price))
        return minPriceB - minPriceA
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

    setFilteredVendors(result)
  }, [filters, searchQuery, sortOption, vendors])

  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      const currentValues = [...(prev[type as keyof typeof prev] as string[])]

      newFilters[type as keyof typeof prev] = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return newFilters
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
        <div className="container mx-auto px-4 py-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row w-full max-w-4xl mx-auto gap-3 bg-white p-3 rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="relative flex-1 min-w-[180px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-pink-400" />
              </div>
              <div className="flex items-center">
                <select
                  className="w-full pl-10 pr-4 py-3 appearance-none bg-transparent border-0 focus:ring-0 focus:outline-none text-sm font-medium text-gray-700"
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
                <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 pointer-events-none" />
              </div>
            </div>
            <div className="relative flex-[3]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-pink-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for services like 'wedding photography', 'catering', 'decoration'..."
                className="w-full pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent font-medium"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" className="shrink-0 bg-pink-600 hover:bg-pink-700 shadow-lg px-6 py-3 rounded-xl">
              <Sparkles className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Regular Search Bar */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row w-full max-w-4xl mx-auto gap-3 bg-gray-50 p-3 rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="relative flex-1 min-w-[180px]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-pink-400" />
              </div>
              <div className="flex items-center">
                <select
                  className="w-full pl-10 pr-4 py-3 appearance-none bg-transparent border-0 focus:ring-0 focus:outline-none text-sm font-medium text-gray-700"
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
                <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 pointer-events-none" />
              </div>
            </div>
            <div className="relative flex-[3]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-pink-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for services like 'wedding photography', 'catering', 'decoration'..."
                className="w-full pl-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent font-medium"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" className="shrink-0 bg-pink-600 hover:bg-pink-700 shadow-lg px-6 py-3 rounded-xl">
              <Sparkles className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 shrink-0">
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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Explore Services</h1>
                <p className="text-gray-600 mt-1">
                  {searchQuery ? `Search results for "${searchQuery}"` : "Find vendors for your specific service needs"}
                </p>
                {filteredVendors.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} found
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

            {isLoading ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Loading services...</h3>
                <p className="text-gray-500">Please wait while we fetch the latest vendor services</p>
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No vendors found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <ServiceVendorCard
                    key={vendor.id}
                    vendor={vendor}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
} 