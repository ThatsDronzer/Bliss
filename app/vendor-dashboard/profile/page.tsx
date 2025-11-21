"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser, useClerk } from "@clerk/nextjs"
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, Building, Globe, Star, CheckCircle, Plus, RefreshCw, Trash2, Shield, Key, User, Settings, LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { CoinDisplay } from "@/components/ui/coin-display"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Common service categories
const SERVICE_CATEGORIES = [
  "Photography",
  "Videography",
  "Catering",
  "Decoration",
  "Music & DJ",
  "Venue",
  "Makeup & Hair",
  "Wedding Planning",
  "Transportation",
  "Invitations",
  "Entertainment",
  "Other"
]

export default function VendorProfilePage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    serviceName: "", // NEW: Service/Business name
    ownerName: "",   // Owner's personal name
    email: "",
    phone: "",
    category: "",    // Fixed: Using select instead of free text
    location: "",
    description: "",
    established: "",
    status: "Verified",
    totalBookings: "0",
    rating: "0",
    totalRevenue: "0",
    coins: 0,
    joinDate: new Date().toLocaleDateString(),
    isVerified: false
  })

  const userRole = user?.unsafeMetadata?.role as string || "user"

  useEffect(() => {
    if (!isLoaded || !isSignedIn || userRole !== "vendor") return

    const fetchVendorData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/vendor/${user?.id}?t=${Date.now()}`, {
          cache: 'no-store'
        })
        if (!response.ok) throw new Error('Failed to fetch vendor data')
        
        const data = await response.json()
        
        setFormData(prev => ({
          ...prev,
          serviceName: data.service_name || data.businessName || "", // NEW: Get service name
          ownerName: data.ownerName || "",
          email: data.ownerEmail || "",
          phone: data.service_phone || "",
          category: data.service_type || data.category || "",
          location: data.service_address?.City || data.location || "",
          description: data.service_description || "",
          established: data.establishedYear || "",
          coins: data.coins || 0,
          isVerified: data.isVerified || false
        }))
      } catch (error) {
        console.error("Failed to fetch vendor data", error)
        toast.error('Failed to load vendor profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendorData()
  }, [isLoaded, isSignedIn, userRole, user])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

  // Auto-refresh profile when user returns to the page
  useEffect(() => {
    const handleFocus = () => {
      if (isLoaded && isSignedIn && userRole === "vendor" && user?.id) {
        const fetchVendorData = async () => {
          try {
            const response = await fetch(`/api/vendor/${user.id}?t=${Date.now()}`, {
              cache: 'no-store'
            })
            if (response.ok) {
              const data = await response.json()
              setFormData(prev => ({
                ...prev,
                serviceName: data.service_name || data.businessName || prev.serviceName,
                ownerName: data.ownerName || prev.ownerName,
                email: data.ownerEmail || prev.email,
                phone: data.service_phone || prev.phone,
                category: data.service_type || data.category || prev.category,
                location: data.service_address?.City || data.location || prev.location,
                description: data.service_description || prev.description,
                established: data.establishedYear || prev.established,
                coins: data.coins || prev.coins,
                isVerified: data.isVerified || prev.isVerified
              }))
            }
          } catch (error) {
            console.error("Failed to refresh vendor data", error)
          }
        }
        fetchVendorData()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isLoaded, isSignedIn, userRole, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const payload = {
        service_name: formData.serviceName, // NEW: Include service name
        ownerName: formData.ownerName,
        ownerEmail: formData.email,
        service_phone: formData.phone,
        service_type: formData.category, // Fixed: Use selected category
        service_address: {
          City: formData.location,
          State: "",
          location: "",
          pinCode: ""
        },
        service_description: formData.description,
        establishedYear: formData.established,
      }

      // Update vendor data in MongoDB
      const response = await fetch(`/api/vendor/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update vendor profile')
      }

      // Update Clerk user metadata
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            serviceName: formData.serviceName, // NEW: Store service name
            vendorName: formData.ownerName,
            vendorEmail: formData.email,
            vendorPhone: formData.phone,
            vendorCategory: formData.category,
            vendorLocation: formData.location,
            vendorDescription: formData.description,
            vendorEstablished: formData.established,
          },
        })
      } catch (clerkError) {
        console.error("Failed to update Clerk metadata:", clerkError)
      }

      setIsEditing(false)
      toast.success('Vendor profile updated successfully')
    } catch (error) {
      console.error("Update error:", error)
      toast.error('Failed to update vendor profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfilePictureUpdate = async (file: File) => {
    if (!user) return;
    
    try {
      await user.setProfileImage({ file });
      toast.success('Profile picture updated successfully');
      setShowProfilePictureDialog(false);
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProfilePictureUpdate(file);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      await user.delete();
      toast.success('Account deleted successfully');
      router.push('/');
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleNewListing = () => {
    router.push("/vendor-dashboard/listings/new")
  }

  const handleRefreshProfile = async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/vendor/${user.id}?t=${Date.now()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          serviceName: data.service_name || data.businessName || prev.serviceName,
          ownerName: data.ownerName || prev.ownerName,
          email: data.ownerEmail || prev.email,
          phone: data.service_phone || prev.phone,
          category: data.service_type || data.category || prev.category,
          location: data.service_address?.City || data.location || prev.location,
          description: data.service_description || prev.description,
          established: data.establishedYear || prev.established,
          coins: data.coins || prev.coins,
          isVerified: data.isVerified || prev.isVerified
        }))
        toast.success('Profile refreshed successfully')
      }
    } catch (error) {
      console.error("Failed to refresh profile", error)
      toast.error('Failed to refresh profile')
    } finally {
      setIsLoading(false)
    }
  }

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
          <h1 className="text-3xl font-bold">Vendor Profile</h1>
          <p className="text-gray-500 mt-1">Manage your vendor information and account settings</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={handleRefreshProfile}
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {isEditing ? (
            <Button
              variant="default"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>Your vendor profile information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>
                  {formData.serviceName?.charAt(0) || user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Dialog open={showProfilePictureDialog} onOpenChange={setShowProfilePictureDialog}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                    <DialogDescription>
                      Choose a new profile picture. Supported formats: JPG, PNG, GIF (max 5MB)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Service Name Display */}
            <h3 className="text-lg font-semibold mb-1">
              {formData.serviceName || "No Service Name"}
            </h3>
            
            {/* Owner Name */}
            <p className="text-sm text-gray-600 mb-2">
              Owner: {formData.ownerName || "Not set"}
            </p>
            
            <p className="text-sm text-gray-500">{formData.email}</p>
            
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">
                {user.unsafeMetadata?.role || 'vendor'}
              </Badge>
              <Badge variant={formData.isVerified ? "default" : "secondary"}>
                {formData.isVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            
            <div className="w-full mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building className="h-4 w-4" />
                <span>Category: {formData.category || "Not set"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Location: {formData.location || "Not set"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Established: {formData.established || "Not set"}</span>
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
            <CardTitle>Vendor Information</CardTitle>
            <CardDescription>Update your vendor details and service information</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NEW: Service Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service/Business Name *</Label>
                  <Input
                    id="serviceName"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your service or business name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter owner's full name"
                    required
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                
                {/* FIXED: Service Category as Select */}
                <div className="space-y-2">
                  <Label htmlFor="category">Service Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={handleCategoryChange}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your city"
                    required
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
                    placeholder="e.g., 2020"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Service Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Describe your services, expertise, and what makes you unique..."
                  required
                />
              </div>
              
              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Rest of the components remain the same */}
        {/* Account Management */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Account Management</CardTitle>
            <CardDescription>Manage your vendor account settings and security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <User className="h-6 w-6 text-gray-500" />
                <div>
                  <h4 className="font-medium">Update Account Details</h4>
                  <p className="text-sm text-gray-500">
                    Change your profile information and password.
                  </p>
                </div>
              </div>
              <Button onClick={() => router.push('/user-profile')} variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Manage
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Key className="h-6 w-6 text-gray-500" />
                <div>
                  <h4 className="font-medium">API Keys & Integrations</h4>
                  <p className="text-sm text-gray-500">
                    Connect with external services and manage your API keys.
                  </p>
                </div>
              </div>
              <Button variant="outline" disabled>
                <Globe className="mr-2 h-4 w-4" />
                Manage
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <LogOut className="h-6 w-6 text-gray-500" />
                <div>
                  <h4 className="font-medium">Sign Out</h4>
                  <p className="text-sm text-gray-500">
                    End your current session.
                  </p>
                </div>
              </div>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Trash2 className="h-6 w-6 text-red-500" />
                <div>
                  <h4 className="font-medium text-red-600">Delete Account</h4>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
                      {isDeleting ? 'Deleting...' : 'Continue'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Wallet */}
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