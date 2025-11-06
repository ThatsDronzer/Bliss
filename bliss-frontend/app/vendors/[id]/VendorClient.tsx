"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  MapPin, Phone, Mail, Calendar, Star, Heart, ArrowLeft, MessageSquare, Users, CheckCircle2, Gift, Clock, AlertTriangle
} from "lucide-react"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useAuth, useUser } from "@clerk/nextjs"
import { useBooking } from "@/hooks/use-booking"
import { ServiceCard } from '@/components/vendor/ServiceCard'
import { ReviewCard } from '@/components/vendor/ReviewCard'
import { ImageGallery } from '@/components/vendor/ImageGallery'
import { type VendorDetails, type Service, type ServiceCustomization } from '@/lib/types/vendor'
import { ServiceBooking } from "@/components/home-service/ServiceBooking"

interface VendorClientProps {
  vendor: VendorDetails
}

function formatAvailability(availability: VendorDetails["availability"]) {
  if (!Array.isArray(availability) || availability.length === 0) return "No availability info.";
  // Show next 2 available dates with available slots
  const nextAvailable = availability.filter(day => day.slots.some(slot => slot.available)).slice(0, 2);
  return (
    <ul className="text-sm text-gray-700 space-y-1">
      {nextAvailable.map(day => (
        <li key={day.date}>
          <span className="font-medium">{format(new Date(day.date), "PPP")}</span>: {day.slots.filter(s => s.available).map(s => s.time).join(", ")}
        </li>
      ))}
    </ul>
  );
}

function formatRefundPolicy(refundPolicy: VendorDetails["refundPolicy"]) {
  if (!refundPolicy) return null;
  return (
    <div>
      <p className="mb-2 text-gray-700">{refundPolicy.description}</p>
      <ul className="text-sm text-gray-600 list-disc pl-5">
        {refundPolicy.cancellationTerms.map((term, idx) => (
          <li key={idx}>
            Cancel {term.daysBeforeEvent}+ days before: <span className="font-semibold">{term.refundPercentage}% refund</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VendorClient({ vendor }: VendorClientProps) {
  const router = useRouter()
  const { isAuthenticated, user, favorites, toggleFavorite } = useAuth()
  const { handleBookingSubmission, isProcessing } = useBooking()
  const [showBooking, setShowBooking] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [serviceQuantities, setServiceQuantities] = useState<{ [serviceId: string]: number }>({})
  const [serviceCustomizations, setServiceCustomizations] = useState<{ [serviceId: string]: number[] }>({})

  const isServiceSelected = (serviceId: number) => {
    return selectedServices.includes(serviceId.toString())
  }

  const handleServiceSelect = (serviceId: number) => {
    setSelectedServices(prev => {
      const idStr = serviceId.toString();
      if (prev.includes(idStr)) {
        return prev.filter(id => id !== idStr)
      }
      return [...prev, idStr]
    })
    setSelectedPackage(null)
  }

  const handlePackageSelection = (packageId: number) => {
    setSelectedPackage(selectedPackage === packageId ? null : packageId)
    setSelectedServices([])
  }

  const calculateTotalPrice = () => {
    if (selectedPackage) {
      const selectedPkg = vendor.packages.find(p => p.id === selectedPackage)
      return selectedPkg ? selectedPkg.price : 0
    }
    return selectedServices.reduce((total, serviceId) => {
      const service = vendor.services.find(s => s.id.toString() === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const isTimeSlotAvailable = (date: Date) => {
    if (!Array.isArray(vendor.availability)) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    const dayAvailability = vendor.availability.find(a => a.date === dateStr);
    return dayAvailability?.slots?.some(slot => slot.available) || false;
  }

  const handleQuantityChange = (serviceId: number, value: number) => {
    setServiceQuantities(prev => ({ ...prev, [serviceId.toString()]: value }))
  }

  const handleCustomizationChange = (serviceId: number, customizationId: number) => {
    setServiceCustomizations(prev => {
      const selected = prev[serviceId] || []
      if (selected.includes(customizationId)) {
        return { ...prev, [serviceId]: selected.filter(id => id !== customizationId) }
      }
      return { ...prev, [serviceId]: [...selected, customizationId] }
    })
  }

  // Calculate average rating and review count
  const averageRating = vendor.rating?.toFixed(1) || "-"
  const reviewCount = vendor.reviews?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">
      {/* Hero Section */}
      <div className="relative h-[340px] md:h-[420px] flex items-end">
        <div className="absolute inset-0">
          {vendor.coverImage && (
            <Image
              src={vendor.coverImage}
              alt={vendor.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 w-full px-6 md:px-12 pb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
              {vendor.coverImage && (
                <Image src={vendor.coverImage} alt={vendor.name} width={96} height={96} className="object-cover w-full h-full" />
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                {vendor.name}
                {vendor.category && <Badge className="bg-pink-600 text-white ml-2">{vendor.category}</Badge>}
                <span className="ml-2"><Star className="inline h-5 w-5 text-yellow-400" /> {averageRating}</span>
              </h1>
              <div className="flex items-center gap-3 mt-2 text-white/90">
                <MapPin className="h-5 w-5" />
                <span>{vendor.location}</span>
                <Users className="h-5 w-5 ml-4" />
                <span>{reviewCount} Reviews</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 md:mt-0">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white shadow-lg" onClick={() => setShowBooking(true)}>
              <Calendar className="h-5 w-5 mr-2" /> Book Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={cn("border-pink-600 text-pink-600 hover:bg-pink-50", isFavorite && "bg-pink-100 border-2")}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={cn("h-5 w-5 mr-2", isFavorite && "fill-pink-600 text-pink-600")}/>
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
        <Button
          variant="outline"
          className="absolute top-4 left-4 bg-white/80 backdrop-blur z-20"
          onClick={() => router.push('/vendors')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      {/* Info Cards moved below hero section */}
      <div className="container mx-auto px-4 md:px-8 mt-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <CardContent className="p-5 flex items-center gap-4">
              <MapPin className="h-6 w-6 text-pink-600" />
              <div>
                <div className="font-semibold text-gray-700">Location</div>
                <div className="text-gray-500 text-sm">{vendor.location}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-5 flex items-center gap-4">
              <Calendar className="h-6 w-6 text-pink-600" />
              <div>
                <div className="font-semibold text-gray-700">Next Availability</div>
                {formatAvailability(vendor.availability)}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-5 flex items-center gap-4">
              <CheckCircle2 className="h-6 w-6 text-pink-600" />
              <div>
                <div className="font-semibold text-gray-700">Featured Vendor</div>
                <div className="text-gray-500 text-sm">{vendor.category}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 space-y-8 pb-24">
        {/* Package Selection Section */}
        {vendor.packages && vendor.packages.length > 0 && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle>Packages</CardTitle>
              <CardDescription>Select a package for bundled services and savings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendor.packages.map(pkg => (
                  <Card key={pkg.id} className={cn("transition-all duration-200 border-2", selectedPackage === pkg.id ? 'border-pink-600 ring-2 ring-pink-200' : 'border-gray-200') }>
                    <CardHeader>
                      <CardTitle>{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <span className="text-xl font-bold text-pink-600">₹{pkg.price}</span>
                        {pkg.savings > 0 && <span className="ml-2 text-green-600">Save ₹{pkg.savings}</span>}
                      </div>
                      <div className="mb-2 text-sm text-gray-600">Includes: {pkg.services.map(sid => vendor.services.find(s => s.id === sid)?.name).join(", ")}</div>
                      <Button variant={selectedPackage === pkg.id ? "default" : "outline"} className="w-full" onClick={() => handlePackageSelection(pkg.id)}>
                        {selectedPackage === pkg.id ? "Selected" : "Select Package"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="bg-white border rounded-lg shadow-sm flex gap-2">
            <TabsTrigger value="services"><Gift className="inline h-4 w-4 mr-1" /> Services</TabsTrigger>
            <TabsTrigger value="about"><InfoIcon className="inline h-4 w-4 mr-1" /> About</TabsTrigger>
            <TabsTrigger value="gallery"><ImageIcon className="inline h-4 w-4 mr-1" /> Gallery</TabsTrigger>
            <TabsTrigger value="reviews"><Star className="inline h-4 w-4 mr-1" /> Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendor.services
                .filter(service => service && service.id !== undefined)
                .map((service) => (
                  <Card key={service.id} className={cn("transition-all duration-200 border-2", isServiceSelected(service.id) ? 'border-pink-600 ring-2 ring-pink-200' : 'border-gray-200') }>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                          <span className="text-xl font-bold">₹{service.price}</span>
                        </div>
                        <Button
                          variant={isServiceSelected(service.id) ? "default" : "outline"}
                          onClick={() => handleServiceSelect(service.id)}
                        >
                          {isServiceSelected(service.id) ? "Selected" : "Select Service"}
                        </Button>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      {/* Quantity Selector */}
                      {typeof service.minQuantity === 'number' && typeof service.maxQuantity === 'number' && (
                        <div className="mb-2 flex items-center gap-2">
                          <Label htmlFor={`quantity-${service.id}`}>Quantity:</Label>
                          <Input
                            id={`quantity-${service.id}`}
                            type="number"
                            min={service.minQuantity}
                            max={service.maxQuantity}
                            value={serviceQuantities[service.id.toString()] || service.minQuantity || 1}
                            onChange={e => handleQuantityChange(service.id, Math.max(service.minQuantity || 1, Math.min(service.maxQuantity || 99, Number(e.target.value))))}
                            className="w-20"
                          />
                          <span className="text-xs text-gray-500">(min {service.minQuantity}, max {service.maxQuantity})</span>
                        </div>
                      )}
                      {/* Customizations */}
                      {service.customizations && service.customizations.length > 0 && (
                        <div className="mb-2">
                          <Label>Customizations:</Label>
                          <div className="flex flex-col gap-1 mt-1">
                            {service.customizations.map(cust => (
                              <div key={cust.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={`customization-${service.id}-${cust.id}`}
                                  checked={serviceCustomizations[service.id]?.includes(cust.id) || false}
                                  onCheckedChange={() => handleCustomizationChange(service.id, cust.id)}
                                />
                                <Label htmlFor={`customization-${service.id}-${cust.id}`}>{cust.name} (+₹{cust.price})</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card className="shadow-md">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center"><InfoIcon className="h-4 w-4 mr-2 text-pink-600" /> About {vendor.name}</h3>
                  <p className="text-gray-600">{vendor.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center"><AlertTriangle className="h-4 w-4 mr-2 text-pink-600" /> Refund Policy</h3>
                  {formatRefundPolicy(vendor.refundPolicy)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <ImageGallery images={vendor.gallery} />
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="font-bold text-lg">{averageRating}</span>
                <span className="text-gray-500">({reviewCount} reviews)</span>
              </div>
              {vendor.reviews.length > 0 ? (
                vendor.reviews.map((review) => (
                  <ReviewCard key={review.id.toString()} review={{...review, id: review.id.toString()}} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No reviews yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Floating Action Bar */}
        {calculateTotalPrice() > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Services</p>
                <p className="text-xl font-bold">Total: ₹{calculateTotalPrice()}</p>
              </div>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={() => setShowBooking(true)}
              >
                Proceed to Book
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Dialog - show availability calendar here */}
      {showBooking && (
        <ServiceBooking
          selectedServices={selectedServices}
          selectedPackage={null}
          onClose={() => setShowBooking(false)}
          vendorAvailability={vendor.availability}
        />
      )}
    </div>
  )
}

// Icon components for tabs
function InfoIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
}
function ImageIcon(props: any) {
  return <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
}
