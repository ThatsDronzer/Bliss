"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { CoinDisplay } from "@/components/ui/coin-display"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  // Demo coin amount - replace with actual user coins from backend
  const [userCoins] = useState(1500)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    weddingDate: user?.weddingDate || "",
    partner: user?.partner || "",
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
    updateProfile(formData)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 md:mt-0"
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Your profile photo and basic info</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="w-full mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Wedding Date: {user.weddingDate || "Not set"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Location: {user.location || "No location added"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CoinDisplay amount={userCoins} />
                <span>Available Balance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
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
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding Date</Label>
                <Input
                  id="weddingDate"
                  name="weddingDate"
                  type="date"
                  value={formData.weddingDate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partner">Partner</Label>
                <Input
                  id="partner"
                  name="partner"
                  value={formData.partner}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your account settings and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">
                  Receive updates about your bookings, messages, and important announcements
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Privacy Settings</h4>
                <p className="text-sm text-gray-500">
                  Control what information is visible to vendors and other users
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Language & Region</h4>
                <p className="text-sm text-gray-500">
                  Set your preferred language and regional preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
