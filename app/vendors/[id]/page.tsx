"use client"

import { mockVendorData, type VendorDetails } from '@/lib/types/vendor'
import { useState } from "react"
import { ServiceCard } from '@/components/vendor/ServiceCard'
import { ReviewCard } from '@/components/vendor/ReviewCard'
import { SelectedServicesSummary } from '@/components/vendor/SelectedServicesSummary'
import { ImageGallery } from '@/components/vendor/ImageGallery'
import { PaymentGateway } from "@/components/payment-gateway"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useServiceSelection } from '@/hooks/useServiceSelection'
import { ServiceBooking } from "@/components/home-service/ServiceBooking"
import { Phone, Mail, MapIcon, Star, Heart } from "lucide-react"
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"] })

export default function VendorDetailsPage() {
  // Always use mockVendorData for demo
  const [vendor] = useState<VendorDetails>(mockVendorData)
  const [showBooking, setShowBooking] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const { totalPrice, toggleService, isServiceSelected, selectedServices } = useServiceSelection()

  const handleProceedToBook = () => setShowBooking(true)
  const handleToggleFavorite = () => setIsFavorite((f) => !f)
  const handlePaymentSuccess = () => { setShowPayment(false); setShowBooking(false) }
  const handlePaymentCancel = () => setShowPayment(false)
  const handleServiceSelect = (serviceId: string) => { toggleService(serviceId) }

  return (
    <div className={"min-h-screen bg-gradient-to-br from-gray-50 to-white " + inter.className}>
      {/* Hero Section */}
      <section className="relative w-full h-[380px] md:h-[420px] flex items-end">
        <img
          src={vendor.coverImage || vendor.image}
          alt={vendor.name}
          className="absolute inset-0 w-full h-full object-cover object-center rounded-b-3xl shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-3xl" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-3">{vendor.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-base mb-4">
              <span className="flex items-center gap-1"><MapIcon className="h-5 w-5" />{vendor.location}</span>
              <span className="flex items-center gap-1"><Star className="h-5 w-5 text-yellow-400" />{vendor.rating} Rating</span>
              <Badge variant="secondary" className="bg-white/90 text-gray-900 font-medium px-3 py-1 rounded-full shadow">{vendor.category}</Badge>
            </div>
            <p className="text-lg text-white/80 max-w-2xl mb-3 font-medium">{vendor.shortDescription}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a href={`tel:${vendor.contact?.phone}`} className="hover:underline flex items-center gap-1 text-white/90"><Phone className="h-5 w-5" />Call</a>
              <a href={`mailto:${vendor.contact?.email}`} className="hover:underline flex items-center gap-1 text-white/90"><Mail className="h-5 w-5" />Email</a>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        {/* Left/Main Column */}
        <section className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-10">
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="mb-6 flex gap-2 bg-gray-100 rounded-lg p-1">
                <TabsTrigger value="services" className="flex-1 px-4 py-2 rounded-lg text-base font-semibold data-[state=active]:bg-pink-600 data-[state=active]:text-white">Services</TabsTrigger>
                <TabsTrigger value="about" className="flex-1 px-4 py-2 rounded-lg text-base font-semibold data-[state=active]:bg-pink-600 data-[state=active]:text-white">About</TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1 px-4 py-2 rounded-lg text-base font-semibold data-[state=active]:bg-pink-600 data-[state=active]:text-white">Gallery</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 px-4 py-2 rounded-lg text-base font-semibold data-[state=active]:bg-pink-600 data-[state=active]:text-white">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="services" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vendor.services?.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={isServiceSelected(service.id)}
                      onSelect={() => toggleService(service)}
                      duration={service.duration}
                      availability={service.availability}
                      className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-gray-50"
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="about">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-3 text-gray-900">About {vendor.name}</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-2">{vendor.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">Business Hours</h3>
                      <p className="text-gray-600">{vendor.businessHours}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">Availability</h3>
                      <p className="text-gray-600">{vendor.availability && vendor.availability.length > 0 ? 'Available on select dates. Advance booking required.' : 'Contact for availability.'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">Refund Policy</h3>
                      <p className="text-gray-600">{typeof vendor.refundPolicy === 'string' ? vendor.refundPolicy : vendor.refundPolicy?.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-800">Contact Information</h3>
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{vendor.contact?.phone}</p>
                        <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{vendor.contact?.email}</p>
                        <p className="flex items-center gap-2"><MapIcon className="h-4 w-4" />{vendor.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="gallery">
                <div className="mb-4">
                  <ImageGallery images={vendor.gallery} />
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-lg font-semibold">{vendor.rating}</span>
                  <span className="text-gray-500">({vendor.reviews?.length || 0} reviews)</span>
                </div>
                <div className="space-y-4">
                  {vendor.reviews?.length > 0 ? (
                    vendor.reviews.map((review, index) => (
                      <ReviewCard key={index} review={review} />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No reviews yet</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        {/* Right/Sidebar Column */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 flex flex-col gap-8 sticky top-8">
            <Card className="shadow-none border-0 p-0">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <SelectedServicesSummary
                  selectedServices={selectedServices}
                  totalPrice={totalPrice}
                  onProceedToBook={handleProceedToBook}
                />
                <Button
                  variant="outline"
                  onClick={handleToggleFavorite}
                  className={cn("w-full border-gray-300 text-gray-700 font-semibold text-lg py-3 rounded-lg mt-4", isFavorite ? "bg-pink-50 border-pink-300" : "")}
                >
                  {isFavorite ? (
                    <span className="flex items-center gap-2"><Heart className="h-4 w-4 fill-current text-pink-600" />Remove from Favorites</span>
                  ) : (
                    <span className="flex items-center gap-2"><Heart className="h-4 w-4" />Add to Favorites</span>
                  )}
                </Button>
              </CardContent>
            </Card>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full flex items-center gap-1"><Star className="h-4 w-4 mr-1 text-yellow-400" />Top Rated</Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full">Verified</Badge>
              <Badge variant="secondary" className="bg-pink-100 text-pink-800 font-medium px-3 py-1 rounded-full">Premium Vendor</Badge>
            </div>
          </div>
        </aside>
      </main>
      {/* Service Booking Dialog */}
      {showBooking && (
        <ServiceBooking
          selectedServices={selectedServices}
          onClose={() => setShowBooking(false)}
        />
      )}
      {/* Payment Dialog */}
      {showPayment && bookingData && (
        <PaymentGateway
          amount={bookingData.amount}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </div>
  )
} 