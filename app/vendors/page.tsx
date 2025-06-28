"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Filter, Search, MapPin, ChevronDown, Sparkles, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VendorGrid from "@/components/vendor-grid"
import { filterOptions, locations } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"

export default function VendorsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial values from URL params
  const initialCategory = searchParams.get("category") ? [searchParams.get("category") as string] : []
  const initialLocation = searchParams.get("location") || "All Locations"
  const initialSearchQuery = searchParams.get("search") || ""

  // State for filters
  const [filters, setFilters] = useState({
    city: [] as string[],
    category: initialCategory,
    priceRange: [] as string[],
    eventTypes: [] as string[],
    location: initialLocation,
  })

  // State for search and sort
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [searchInput, setSearchInput] = useState(initialSearchQuery)
  const [sortOption, setSortOption] = useState("recommended")
  const [showStickySearch, setShowStickySearch] = useState(false)
  const [citySearch, setCitySearch] = useState("")

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

    if (searchQuery) params.set("search", searchQuery)
    if (filters.location !== "All Locations") params.set("location", filters.location)
    if (filters.category.length === 1) params.set("category", filters.category[0])

    const url = `/vendors${params.toString() ? `?${params.toString()}` : ""}`
    window.history.replaceState({}, "", url)
  }, [filters, searchQuery])

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
      city: [],
      category: [],
      priceRange: [],
      eventTypes: [],
      location: "All Locations",
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
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
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
                placeholder="Search for vendors, venues, photographers..."
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
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
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
                placeholder="Search for vendors, venues, photographers..."
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

                <Accordion type="multiple" defaultValue={["city", "service", "price"]}>
                  <AccordionItem value="location" className="border-gray-200">
                    <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                      Location
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <Input
                          placeholder="Search city..."
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          {filterOptions.cities
                            .filter((city) =>
                              city.toLowerCase().includes(citySearch.toLowerCase())
                            )
                            .map((city) => (
                              <div key={city} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`city-${city}`}
                                  checked={filters.city.includes(city)}
                                  onCheckedChange={() => handleFilterChange("city", city)}
                                  className="border-pink-300 data-[state=checked]:bg-pink-600"
                                />
                                <Label
                                  htmlFor={`city-${city}`}
                                  className="text-sm font-normal text-gray-600 cursor-pointer"
                                >
                                  {city}
                                </Label>
                              </div>
                            ))}
                        </div>
                        {citySearch && filterOptions.cities.filter((city) =>
                          city.toLowerCase().includes(citySearch.toLowerCase())
                        ).length === 0 && (
                          <p className="text-sm text-gray-500">No cities found</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="service" className="border-gray-200">
                    <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                      Service Type
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {filterOptions.services.map((service) => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={`service-${service}`}
                              checked={filters.category.includes(service)}
                              onCheckedChange={() => handleFilterChange("category", service)}
                              className="border-pink-300 data-[state=checked]:bg-pink-600"
                            />
                            <Label
                              htmlFor={`service-${service}`}
                              className="text-sm font-normal text-gray-600 cursor-pointer"
                            >
                              {service}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price" className="border-gray-200">
                    <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                      Price Range (₹)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {filterOptions.priceRanges.map((price) => (
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

                  <AccordionItem value="events" className="border-gray-200">
                    <AccordionTrigger className="py-3 text-sm font-medium text-gray-700 hover:text-pink-600">
                      Event Types
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {filterOptions.eventTypes.map((eventType) => (
                          <div key={eventType} className="flex items-center space-x-2">
                            <Checkbox
                              id={`event-${eventType}`}
                              checked={filters.eventTypes.includes(eventType)}
                              onCheckedChange={() => handleFilterChange("eventTypes", eventType)}
                              className="border-pink-300 data-[state=checked]:bg-pink-600"
                            />
                            <Label
                              htmlFor={`event-${eventType}`}
                              className="text-sm font-normal text-gray-600 cursor-pointer"
                            >
                              {eventType}
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
                <h1 className="text-3xl font-bold text-gray-900">Explore Vendors</h1>
                <p className="text-gray-600 mt-1">Discover amazing vendors for your events</p>
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

            <VendorGrid filters={filters} searchQuery={searchQuery} sortOption={sortOption} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
