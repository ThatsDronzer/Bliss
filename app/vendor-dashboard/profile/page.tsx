"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import Image from "next/image"
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, Building, Globe, Star, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { CoinDisplay } from "@/components/ui/coin-display"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CoinService } from "@/lib/coin-service"

export default function VendorProfilePage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [coinBalance, setCoinBalance] = useState(0)
  const [coinTransactions, setCoinTransactions] = useState([])

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

  // Mock vendor data - in a real app, you'd fetch this from your database
  const vendorData = {
    name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Vendor",
    email: user.emailAddresses[0]?.emailAddress || "vendor@example.com",
    phone: user.phoneNumbers[0]?.phoneNumber || "+91 98765 43210",
    category: "Wedding Services",
    location: "Delhi NCR",
    description: "Professional wedding service provider with years of experience in making special days memorable.",
    established: "2018",
    website: "www.vendorwebsite.com",
    status: "Verified",
    joinDate: "2024-01-15",
    rating: 4.8,
    totalBookings: 156,
    totalRevenue: "₹2,45,000",
  }

  const [formData, setFormData] = useState({
    name: vendorData.name,
    email: vendorData.email,
    phone: vendorData.phone,
    category: vendorData.category,
    location: vendorData.location,
    description: vendorData.description,
    established: vendorData.established,
    website: vendorData.website,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd update the vendor profile in your database
    console.log("Profile updated:", formData)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Profile</h1>
        <p className="text-gray-600">Manage your vendor profile and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your business details and contact information</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
              />
            </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                      name="email"
                type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
              />
            </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Service Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={!isEditing}
              />
            </div>
                  <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
              />
            </div>
                  <div className="space-y-2">
              <Label htmlFor="established">Established Year</Label>
              <Input
                id="established"
                      name="established"
                      value={formData.established}
                      onChange={handleInputChange}
                      disabled={!isEditing}
              />
            </div>
                </div>
                <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
              />
            </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
              <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
              />
            </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Business Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Business Statistics</CardTitle>
              <CardDescription>Your performance metrics and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">{vendorData.totalBookings}</div>
                  <div className="text-sm text-gray-500">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">{vendorData.rating}</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">{vendorData.totalRevenue}</div>
                  <div className="text-sm text-gray-500">Total Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.imageUrl} alt={vendorData.name} />
                  <AvatarFallback className="text-2xl">
                    {vendorData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{vendorData.name}</h3>
                  <p className="text-sm text-gray-500">{vendorData.category}</p>
                  <Badge className="mt-2" variant="secondary">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {vendorData.status}
                  </Badge>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{vendorData.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{vendorData.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{vendorData.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span>Joined {vendorData.joinDate}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Building className="mr-2 h-4 w-4 text-gray-400" />
                  <span>Est. {vendorData.established}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Globe className="mr-2 h-4 w-4 text-gray-400" />
                  <span>{vendorData.website}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Information */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Available Balance</span>
                  <CoinDisplay balance={coinBalance} />
                </div>
                <Button variant="outline" className="w-full">
                  View Transaction History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" />
                View Reviews
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="mr-2 h-4 w-4" />
                Verification Status
              </Button>
            </CardContent>
          </Card>
            </div>
          </div>
    </div>
  )
}
