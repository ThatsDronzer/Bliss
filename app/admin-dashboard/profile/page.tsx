"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Camera, Mail, Phone, MapPin, Calendar, Shield, Key } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export default function AdminProfilePage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, admin } = useAuth()

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  const handleUpdateProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleChangePassword = () => {
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button onClick={handleUpdateProfile}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src={admin?.avatar || "/placeholder.svg"}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-semibold">{admin?.name || "Admin User"}</h3>
                <p className="text-sm text-gray-500">Super Administrator</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={admin?.firstName || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={admin?.lastName || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center space-x-2">
                  <Input id="email" type="email" defaultValue={admin?.email || ""} />
                  {admin?.emailVerified && (
                    <Shield className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue={admin?.phone || ""} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue={admin?.address || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                defaultValue={admin?.bio || ""}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Account Status</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Member Since</p>
                  <p className="text-sm text-gray-500">
                    {admin?.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString()
                      : "January 2024"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Last Password Change</p>
                  <p className="text-sm text-gray-500">30 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="w-full" onClick={handleChangePassword}>
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 