"use client"
import AddImagesModal from "@/components/add-images-modal";
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import { useSession } from "@clerk/clerk-react"
import { ArrowLeft, Edit, Star, MapPin, Calendar, DollarSign, Eye, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Listing {
  _id: string
  title: string
  description: string
  location: string
  price: number
  rating: number
  reviews: number
  bookings: number
  isActive: boolean
  status: "active" | "inactive" | "draft"
  createdAt: string
  category: string
  features: string[]
}

export default function ListingViewPage() {
  const { session } = useSession()
  const [token, setToken] = useState<string | null>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Moved inside the component
  const router = useRouter()
  const params = useParams()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || "user"

  useEffect(() => {
    const fetchToken = async () => {
      if (session) {
        const userToken = await session.getToken()
        setToken(userToken)
      }
    }
    fetchToken()
  }, [session])

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

  useEffect(() => {
    const fetchListing = async () => {
      if (!session || !params.id) return

      const userToken = await session.getToken()
      setToken(userToken)

      try {
        const res = await fetch(`/api/listing/${params.id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch listing")
        }

        const data = await res.json()
        setListing(data.listing)
      } catch (error) {
        console.error("Error fetching listing:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isSignedIn && userRole === "vendor") {
      fetchListing()
    }
  }, [session, params.id, isSignedIn, userRole, refreshTrigger]); // Add refreshTrigger here


  if (!isLoaded || !isSignedIn || userRole !== "vendor") {
    return null
  }
  // Add this function to trigger refresh
  const handleImagesAdded = () => {
    setRefreshTrigger(prev => prev + 1); // This will trigger the useEffect to re-fetch
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading listing...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => router.push("/vendor-dashboard/listings")}>
            Back to Listings
          </Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A"
    const date = new Date(isoString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/vendor-dashboard/listings")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Listing Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {listing.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Created {formatDate(listing.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(listing.status)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/vendor-dashboard/listings/${listing._id}/edit`)}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              {/* for adding images////////////////////////////////////////////////////////
              // //////////////////////
              // /////////////
              // ////////////  */}
              <AddImagesModal
                listingId={listing._id}
                token={token}
                onImagesAdded={handleImagesAdded}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features & Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {listing.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ₹{listing.price.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Starting price</p>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Rating</span>
                  </div>
                  <span className="font-semibold">
                    {listing.rating > 0 ? `${listing.rating}/5` : "No ratings"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Reviews</span>
                  </div>
                  <span className="font-semibold">{listing.reviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Bookings</span>
                  </div>
                  <span className="font-semibold">{listing.bookings}</span>
                </div>
              </CardContent>
            </Card>

            {/* Category Card */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-sm">
                  {listing.category}
                </Badge>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getStatusBadge(listing.status)}
                  <p className="text-sm text-gray-600">
                    {listing.status === "active" && "Your listing is visible to customers"}
                    {listing.status === "inactive" && "Your listing is hidden from customers"}
                    {listing.status === "draft" && "Your listing is saved as a draft"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 