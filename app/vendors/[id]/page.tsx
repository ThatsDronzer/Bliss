"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Calendar, Star, MapIcon, Heart, ShoppingCart } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { vendors } from "@/lib/data"
import { useAuth } from "@/lib/auth"
import { useBooking } from "@/hooks/use-booking"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { ServiceCard } from '@/components/vendor/ServiceCard'
import { ReviewCard } from '@/components/vendor/ReviewCard'
import { SelectedServicesSummary } from '@/components/vendor/SelectedServicesSummary'
import { ImageGallery } from '@/components/vendor/ImageGallery'
import { useServiceSelection } from '@/hooks/useServiceSelection'
import { mockVendorData, type VendorDetails } from '@/lib/types/vendor'
import { PlaceholderImage } from '@/components/vendor/PlaceholderImage'
import { PaymentGateway } from "@/components/payment-gateway"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServiceBooking } from "@/components/home-service/ServiceBooking"

export default function VendorDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, user, favorites, toggleFavorite } = useAuth()
  const { handleBookingSubmission, isProcessing } = useBooking()
  const [vendor, setVendor] = useState<VendorDetails>(mockVendorData)
  const [loading, setLoading] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [isFavorite, setIsFavorite] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [showBooking, setShowBooking] = useState(false)

  const { totalPrice, toggleService, isServiceSelected } = useServiceSelection()

  useEffect(() => {
    // Find the vendor from the actual vendors data
    const foundVendor = vendors.find(v => v.id === params.id)
    
    if (foundVendor) {
      // Transform the vendor data to match VendorDetails type
      const vendorDetails: VendorDetails = {
        id: foundVendor.id,
        name: foundVendor.name,
        location: foundVendor.location,
        rating: foundVendor.rating,
        category: foundVendor.category,
        coverImage: foundVendor.image,
        description: foundVendor.description,
        shortDescription: foundVendor.description.split('.')[0], // First sentence as short description
        services: foundVendor.items.map((item, index) => ({
          id: index + 1,
          name: item.name,
          price: parseInt(item.price.replace(/[^\d]/g, '')), // Convert price string to number
          description: 'details' in item ? item.details : item.capacity || ''
        })),
        gallery: [foundVendor.image], // Use main image for now
        reviews: [], // We'll add reviews later
        availability: "Available all days. Advance booking required.",
        refundPolicy: "50% refund for cancellations made 7 days before the event."
      }
      setVendor(vendorDetails)
    } else {
      // Handle vendor not found
      toast({
        title: "Vendor Not Found",
        description: "The requested vendor could not be found.",
        variant: "destructive",
      })
      router.push('/vendors')
    }
    setLoading(false)

    // Clear selected services when leaving the page
    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('selectedServices');
      }
    };
  }, [params.id, router])

  // Clear selected services when leaving the page
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('selectedServices');
      }
    };
  }, []);

  // Check if vendor is in favorites
  useEffect(() => {
    if (vendor && favorites) {
      setIsFavorite(favorites.some((fav) => fav.id === vendor.id))
    }
  }, [vendor, favorites])

  const handleBookNow = (packageName?: string) => {
    if (packageName) {
      setSelectedPackage(packageName)
    }
    setBookingOpen(true)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book services.",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a booking date.",
        variant: "destructive",
      })
      return
    }

    if (selectedServices.length === 0) {
      toast({
        title: "Services Required",
        description: "Please select at least one service to book.",
        variant: "destructive",
      })
      return
    }

    if (!name || !phone || !email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a new booking ID
      const bookingId = `booking-${Date.now()}`
      
      // Format the booking data
      const newBookingData = {
        id: bookingId,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorCategory: vendor.category,
        bookingDate: date.toISOString().split('T')[0],
        status: "Pending",
        amount: totalPrice,
        paymentStatus: "Pending",
        image: vendor.coverImage,
        clientName: name,
        clientPhone: phone,
        clientEmail: email,
        eventDetails: `Booking for ${selectedServices.map(s => s.name).join(", ")}`,
        notes: notes,
        createdAt: new Date().toISOString(),
        guestCount: 0
      }

      // Submit the booking using the updated hook
      const success = await handleBookingSubmission(newBookingData)

      if (success) {
        setBookingData(newBookingData)
        setShowPayment(true)
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
    toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePaymentSuccess = () => {
    setBookingOpen(false)
    setShowPayment(false)
    
    // Reset form
    setDate(undefined)
    setName("")
    setPhone("")
    setEmail("")
    setNotes("")
    setSelectedPackage("")
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to save vendors to your favorites",
        variant: "destructive",
      })
      return
    }

    const result = toggleFavorite(vendor.id)
    setIsFavorite(result)

    toast({
      title: result ? "Added to Favorites" : "Removed from Favorites",
      description: result
        ? `${vendor.name} has been added to your favorites`
        : `${vendor.name} has been removed from your favorites`,
    })
  }

  const handleProceedToBook = () => {
    if (!isAuthenticated) {
    toast({
        title: "Authentication Required",
        description: "Please log in to book services.",
        variant: "destructive",
      })
      return
    }
    
    setBookingOpen(true)
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
        <p className="text-gray-500 mb-6">The vendor you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/vendors")}>Browse All Vendors</Button>
      </div>
    )
  }

  const isVenue = vendor.category === "Venue"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <PlaceholderImage
          src={vendor.coverImage}
          alt={vendor.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold">{vendor.name}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1">{vendor.rating}</span>
            </div>
            <span>•</span>
            <span>{vendor.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="text-gray-600">{vendor.description}</p>
            </section>

            {/* Services Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Services</h2>
              <div className="grid gap-4">
                {vendor.services.map((service) => (
                  <Card 
                    key={service.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedServices.includes(service.id) ? 'ring-2 ring-pink-600' : ''
                    }`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                          <Badge>{service.category}</Badge>
                        </div>
                        <span className="text-xl font-bold">₹{service.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                      <Button 
                        variant={selectedServices.includes(service.id) ? "default" : "outline"}
                        className="w-full"
                      >
                        {selectedServices.includes(service.id) ? 'Selected' : 'Select Service'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Gallery Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
              <ImageGallery images={vendor.gallery} />
            </section>

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {vendor.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>

            {/* Additional Information */}
            <section className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Availability</h3>
                <p className="text-gray-600">{vendor.availability}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Refund Policy</h3>
                <p className="text-gray-600">{vendor.refundPolicy}</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SelectedServicesSummary
              selectedServices={selectedServices}
              totalPrice={totalPrice}
              onProceedToBook={handleProceedToBook}
            />
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
            <DialogTitle>Book {vendor.name}</DialogTitle>
            <DialogDescription>
              {selectedPackage ? `Book the ${selectedPackage} package.` : "Fill in your details to book this service."}
            </DialogDescription>
          </DialogHeader>

          {showPayment ? (
            <PaymentGateway
              amount={totalPrice}
              bookingId={bookingData.id}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-medium">Select Date *</Label>
                  <div className="border rounded-lg p-4 bg-white shadow-sm">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                  }
                      className="rounded-md border-0"
                      defaultMonth={new Date()}
                      fromDate={new Date()}
                      toDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
                />
              </div>
                  {!date && (
                    <p className="text-sm text-red-500 mt-1">Please select a date to proceed</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                      className="bg-white"
                />
              </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium">Phone Number *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                      className="bg-white"
                />
              </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                    className="bg-white"
                />
              </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-base font-medium">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or instructions"
                    className="h-24 bg-white"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium">Selected Services</h4>
                  <div className="space-y-2">
                    {selectedServices.map((service) => (
                      <div key={service} className="flex justify-between text-sm">
                        <span>{service}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>Total Amount</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="bg-white p-4 sticky bottom-0 border-t">
                <div className="w-full space-y-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing || !date || selectedServices.length === 0 || !name || !phone || !email}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
            </div>
                    ) : (
                      `Pay ₹${totalPrice.toLocaleString()}`
                    )}
              </Button>
                  {(!date || selectedServices.length === 0 || !name || !phone || !email) && (
                    <p className="text-sm text-red-500 text-center">Please fill in all required fields to proceed</p>
                  )}
                </div>
            </DialogFooter>
          </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer - Reused from other pages */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">WeddingBazaar</h3>
              <p className="text-gray-300">
                India's premier wedding planning platform connecting couples with the best vendors.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/vendors" className="text-gray-300 hover:text-white">
                    Explore Vendors
                  </Link>
                </li>
                <li>
                  <Link href="/home-service" className="text-gray-300 hover:text-white">
                    Home Services
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white">
                    Wedding Blog
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/referral" className="text-gray-300 hover:text-white">
                    Referral Program
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Vendor Categories</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/vendors?category=Venue" className="text-gray-300 hover:text-white">
                    Venues
                  </Link>
                </li>
                <li>
                  <Link href="/vendors?category=Photography" className="text-gray-300 hover:text-white">
                    Photographers
                  </Link>
                </li>
                <li>
                  <Link href="/vendors?category=Makeup Artist" className="text-gray-300 hover:text-white">
                    Makeup Artists
                  </Link>
                </li>
                <li>
                  <Link href="/vendors?category=Mehndi Artist" className="text-gray-300 hover:text-white">
                    Mehndi Artists
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <address className="not-italic text-gray-300">
                <p>Email: info@weddingbazaar.in</p>
                <p>Phone: +91 98765 43210</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 WeddingBazaar. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Booking Dialog */}
      {showBooking && (
        <ServiceBooking 
          selectedServices={selectedServices}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  )
}
