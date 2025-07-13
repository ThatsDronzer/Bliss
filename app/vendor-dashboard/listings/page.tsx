"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import { Plus, Edit, Eye, Trash2, Star, MapPin, Calendar, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function VendorListingsPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("active")

  // Get user role from Clerk metadata
  const userRole = user?.unsafeMetadata?.role as string || "user"

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

  if (!isLoaded || !isSignedIn || userRole !== "vendor") {
    return null
  }

  // Mock listings data - in a real app, you'd fetch this from your database
  const listings = {
    active: [
      {
        id: "1",
        title: "Premium Wedding Photography Package",
        category: "Photography",
        location: "Delhi NCR",
        price: 25000,
        rating: 4.8,
        reviews: 24,
        bookings: 12,
        status: "active",
        image: "/placeholder.jpg",
        description: "Professional wedding photography with premium editing and album",
        createdAt: "2024-01-15"
      },
      {
        id: "2",
        title: "Luxury Wedding Venue",
        category: "Venue",
        location: "Mumbai",
        price: 150000,
        rating: 4.9,
        reviews: 18,
        bookings: 8,
        status: "active",
        image: "/placeholder.jpg",
        description: "Exclusive wedding venue with stunning views and amenities",
        createdAt: "2024-01-10"
      }
    ],
    draft: [
      {
        id: "3",
        title: "Catering Services Package",
        category: "Catering",
        location: "Bangalore",
        price: 75000,
        rating: 0,
        reviews: 0,
        bookings: 0,
        status: "draft",
        image: "/placeholder.jpg",
        description: "Complete catering services for weddings and events",
        createdAt: "2024-01-20"
      }
    ],
    inactive: [
      {
        id: "4",
        title: "Decoration Services",
        category: "Decoration",
        location: "Chennai",
        price: 45000,
        rating: 4.5,
        reviews: 15,
        bookings: 6,
        status: "inactive",
        image: "/placeholder.jpg",
        description: "Professional decoration services for all occasions",
        createdAt: "2023-12-01"
      }
    ]
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

  const ListingCard = ({ listing }: { listing: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Image</span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              <CardDescription className="mb-2">{listing.description}</CardDescription>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3" />
                  {listing.location}
                </div>
                <div className="flex items-center">
                  <Star className="mr-1 h-3 w-3" />
                  {listing.rating > 0 ? `${listing.rating} (${listing.reviews})` : "No reviews"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {listing.bookings} bookings
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">₹{listing.price.toLocaleString()}</div>
            {getStatusBadge(listing.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Created: {listing.createdAt}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-1 h-3 w-3" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/vendor-dashboard/listings/${listing.id}/edit`)}>
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
          <p className="text-gray-600">Manage your service listings and packages</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={() => router.push("/vendor-dashboard/listings/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Listing
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings.active.length + listings.draft.length + listings.inactive.length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{listings.active.length}</p>
        </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
        </div>
      </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">{listings.draft.length}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
              </div>
                </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{listings.inactive.length}</p>
                </div>
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
                </div>

      {/* Listings Tabs */}
      <div className="space-y-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "active"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Active ({listings.active.length})
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "draft"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Draft ({listings.draft.length})
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "inactive"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Inactive ({listings.inactive.length})
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === "active" && (
            <>
              {listings.active.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active listings</h3>
                    <p className="text-gray-500">You don't have any active listings at the moment.</p>
                    <Button className="mt-4" onClick={() => router.push("/vendor-dashboard/listings/new")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Listing
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                listings.active.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))
              )}
            </>
          )}

          {activeTab === "draft" && (
            <>
              {listings.draft.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No draft listings</h3>
                    <p className="text-gray-500">You don't have any draft listings.</p>
                  </CardContent>
                </Card>
              ) : (
                listings.draft.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))
              )}
                      </>
                    )}

          {activeTab === "inactive" && (
            <>
              {listings.inactive.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No inactive listings</h3>
                    <p className="text-gray-500">You don't have any inactive listings.</p>
              </CardContent>
            </Card>
              ) : (
                listings.inactive.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))
              )}
            </>
          )}
          </div>
      </div>
    </div>
  )
}
