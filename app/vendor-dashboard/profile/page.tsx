"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Mail, Phone, MapPin, Calendar, Edit, Globe } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function VendorProfilePage() {
  const router = useRouter()
  const { vendor, isAuthenticated, isVendor, updateVendorProfile } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    category: "",
    description: "",
    established: "",
    website: "",
  })

  // Set initial profile data when vendor is loaded
  useEffect(() => {
    if (vendor) {
      setProfileData({
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        location: vendor.location,
        category: vendor.category,
        description: vendor.description,
        established: vendor.established,
        website: vendor.website,
      })
    }
  }, [vendor])

  // Redirect if not authenticated as vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      router.push("/")
    }
  }, [isAuthenticated, isVendor, router])

  if (!isAuthenticated || !isVendor || !vendor) {
    return null
  }

  const handleSaveProfile = () => {
    // Validate inputs
    if (!profileData.name || !profileData.email || !profileData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Update profile
    updateVendorProfile(profileData)
    setDialogOpen(false)
    toast({
      title: "Profile updated",
      description: "Your business profile information has been updated successfully",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Business Profile</h1>
          <p className="text-gray-500 mt-1">Manage your business information</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="mt-4 md:mt-0">
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto w-32 h-32 relative mb-4">
              <Image
                src={vendor.avatar || "/placeholder.svg"}
                alt={vendor.name}
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-white shadow"
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2">
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <CardTitle>{vendor.name}</CardTitle>
            <CardDescription>{vendor.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{vendor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{vendor.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{vendor.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Established</p>
                  <p>{vendor.established}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p>{vendor.website}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>Information about your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">About</h3>
                <p className="text-gray-700">{vendor.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Services</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-gray-500">Main Hall</p>
                    <p className="font-medium">₹2,50,000</p>
                    <p className="text-xs text-gray-500 mt-1">Capacity: 500 guests</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-gray-500">Garden Area</p>
                    <p className="font-medium">₹1,75,000</p>
                    <p className="text-xs text-gray-500 mt-1">Capacity: 300 guests</p>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <p className="text-sm text-gray-500">Banquet Hall</p>
                    <p className="font-medium">₹1,50,000</p>
                    <p className="text-xs text-gray-500 mt-1">Capacity: 150 guests</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>By Appointment</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/vendor-dashboard/listings")}>
              Manage Listings
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Business Profile</DialogTitle>
            <DialogDescription>Update your business information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={profileData.category}
                onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={profileData.description}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="established">Established Year</Label>
              <Input
                id="established"
                value={profileData.established}
                onChange={(e) => setProfileData({ ...profileData, established: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
