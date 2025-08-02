"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { CoinDisplay } from "@/components/ui/coin-display"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const { isLoaded, user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      houseNo: "",
      areaName: "",
      landmark: "",
      postOffice: "",
      state: "",
      pin: ""
    },
    coins: 0
  })

  useEffect(() => {
    if (!isLoaded || !user) return

    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/user/${user.id}`)
        if (!response.ok) throw new Error('Failed to fetch user data')
        const data = await response.json()
        
        setFormData({
          name: data.name || user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
          phone: data.phone || "",
          address: {
            houseNo: data.address?.houseNo || "",
            areaName: data.address?.areaName || "",
            landmark: data.address?.landmark || "",
            postOffice: data.address?.postOffice || "",
            state: data.address?.state || "",
            pin: data.address?.pin || ""
          },
          coins: data.coins || 0
        })
      } catch (error) {
        console.error("Failed to fetch user data", error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [isLoaded, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user?.id) return;
  
  setIsLoading(true);
  try {
    // Ensure all address fields are included in payload
    const payload = {
      name: formData.name,
      phone: formData.phone,
      address: {
        houseNo: formData.address.houseNo,
        areaName: formData.address.areaName,
        landmark: formData.address.landmark,
        postOffice: formData.address.postOffice,
        state: formData.address.state,
        pin: formData.address.pin
      }
    };

    const response = await fetch(`/api/user/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update profile');
    }

    const updatedData = await response.json();
    
    // Update the form state with the complete response
    setFormData(prev => ({
      ...prev,
      name: updatedData.name || prev.name,
      phone: updatedData.phone || prev.phone,
      address: {
        houseNo: updatedData.address?.houseNo || prev.address.houseNo,
        areaName: updatedData.address?.areaName || prev.address.areaName,
        landmark: updatedData.address?.landmark || prev.address.landmark,
        postOffice: updatedData.address?.postOffice || prev.address.postOffice,
        state: updatedData.address?.state || prev.address.state,
        pin: updatedData.address?.pin || prev.address.pin
      },
      coins: updatedData.coins || prev.coins
    }));

    setIsEditing(false);
    toast.success('Profile updated successfully');
  } catch (error) {
    console.error("Update error:", error);
    toast.error(error instanceof Error ? error.message : 'Failed to update profile');
  } finally {
    setIsLoading(false);
  }
};

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      )
    }
  }

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router])

  if (!isLoaded || isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        {isEditing ? (
          <Button
            variant="default"
            onClick={handleSaveClick}
            disabled={isLoading}
            className="mt-4 md:mt-0"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="mt-4 md:mt-0"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
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
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
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
            <h3 className="text-lg font-semibold">{formData.name}</h3>
            <p className="text-sm text-gray-500">{formData.email}</p>
            <div className="w-full mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Location: {formData.address.areaName || "No location added"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CoinDisplay balance={formData.coins} />
                <span>Available Balance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                    disabled
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="houseNo">House No.</Label>
                  <Input
                    id="houseNo"
                    name="address.houseNo"
                    value={formData.address.houseNo}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="areaName">Area Name</Label>
                  <Input
                    id="areaName"
                    name="address.areaName"
                    value={formData.address.areaName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    name="address.landmark"
                    value={formData.address.landmark}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postOffice">Post Office</Label>
                  <Input
                    id="postOffice"
                    name="address.postOffice"
                    value={formData.address.postOffice}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin">Pin</Label>
                  <Input
                    id="pin"
                    name="address.pin"
                    value={formData.address.pin}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>Your wallet and coin balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <CoinDisplay balance={formData.coins} />
              <span className="text-lg font-semibold">{formData.coins} Coins</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}