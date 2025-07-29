"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, MapPin, Edit2, Save } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { CoinDisplay } from "@/components/ui/coin-display"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const { user: clerkUser, isLoaded, isSignedIn } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.push("/")
      return
    }

    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/user/${clerkUser.id}`)
        if (!response.ok) throw new Error('Failed to fetch user data')
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error("Failed to fetch user data", error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [isLoaded, isSignedIn, clerkUser?.id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setUserData((prev: any) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else {
      setUserData((prev: any) => ({ ...prev, [name]: value }))
    }
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!clerkUser?.id || !userData) return
  
  setIsLoading(true)
  try {
    const response = await fetch(`/api/user/${clerkUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userData.name,
        phone: userData.phone,
        address: {
          State: userData.address?.State || '',
          City: userData.address?.City || '',
          location: userData.address?.location || '',
          pinCode: userData.address?.pinCode || ''
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update profile')
    }

    const updatedData = await response.json()
    setUserData(updatedData)
    setIsEditing(false)
    toast.success('Profile updated successfully')
  } catch (error) {
    console.error("Update error:", error)
    toast.error('Failed to update profile')
  } finally {
    setIsLoading(false)
  }
}

  if (!isLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold">No user data found</h2>
          <p className="text-gray-500 mt-2">We couldn't find any profile information</p>
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
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => isEditing ? handleSubmit({ preventDefault: () => {} } as React.FormEvent) : setIsEditing(true)}
          className="mt-4 md:mt-0"
          disabled={isLoading}
        >
          {isLoading ? (
            "Processing..."
          ) : isEditing ? (
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
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Your profile photo and basic info</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={clerkUser?.imageUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  {clerkUser?.firstName?.[0]}
                  {clerkUser?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 rounded-full"
                  disabled={isLoading}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <h3 className="text-lg font-semibold">
              {userData.name || `${clerkUser?.firstName} ${clerkUser?.lastName}`}
            </h3>
            <p className="text-sm text-gray-500">
              {userData.email || clerkUser?.emailAddresses[0]?.emailAddress}
            </p>
            <div className="w-full mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Role: {userData.role || "user"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CoinDisplay balance={userData.coins || 0} />
                <span>Available Balance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Referral Code: {userData.referralCode || "None"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Status: {userData.userVerified ? "Verified" : "Not Verified"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['name', 'email', 'phone'].map((field) => (
                  <div className="space-y-2" key={field}>
                    <Label htmlFor={field}>
                      {field === 'name' ? 'Full Name' : 
                       field === 'email' ? 'Email Address' : 
                       'Phone Number'}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      value={userData[field] || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || field === 'email' || isLoading}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['State', 'City', 'location', 'pinCode'].map((field) => (
                  <div className="space-y-2" key={field}>
                    <Label htmlFor={`address.${field}`}>
                      {field === 'pinCode' ? 'PIN Code' : 
                       field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={`address.${field}`}
                      name={`address.${field}`}
                      value={userData.address?.[field] || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode">Referral Code</Label>
                <Input
                  id="referralCode"
                  name="referralCode"
                  value={userData.referralCode || ''}
                  disabled
                />
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
              <CoinDisplay balance={userData.coins || 0} />
              <span className="text-lg font-semibold">{userData.coins || 0} Coins</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}