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
import { CoinDisplay } from "@/components/ui/coin-display"
import { CoinHistory } from "@/components/coin-history"
import { CoinService } from "@/lib/coin-service"

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
  const [coinBalance, setCoinBalance] = useState(0)
  const [coinTransactions, setCoinTransactions] = useState([])
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [refundPolicy, setRefundPolicy] = useState(vendor?.refundPolicy || { description: '', cancellationTerms: [] })
  const [refundDescription, setRefundDescription] = useState(refundPolicy.description || '')
  const [cancellationTerms, setCancellationTerms] = useState(refundPolicy.cancellationTerms || [])

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
      // Fetch wallet info
      CoinService.getUserBalance(vendor.id).then(setCoinBalance)
      CoinService.getUserTransactions(vendor.id).then(setCoinTransactions)
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

  const handleSaveRefundPolicy = () => {
    // Save refund policy (should call updateVendorProfile or similar API)
    setRefundPolicy({ description: refundDescription, cancellationTerms })
    setRefundDialogOpen(false)
    toast({
      title: "Refund Policy updated",
      description: "Your refund policy has been updated successfully",
    })
    // TODO: Persist refund policy to backend/profile
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
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>Your coin balance and transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <CoinDisplay balance={coinBalance} />
            </div>
            <CoinHistory transactions={coinTransactions} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Refund Policy</CardTitle>
              <CardDescription>Manage your business refund and cancellation policy</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setRefundDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="font-semibold">Description:</span>
              <p className="text-gray-700 mt-1">{refundPolicy.description || 'No refund policy set.'}</p>
            </div>
            <div>
              <span className="font-semibold">Cancellation Terms:</span>
              <ul className="list-disc ml-6 mt-1">
                {refundPolicy.cancellationTerms && refundPolicy.cancellationTerms.length > 0 ? (
                  refundPolicy.cancellationTerms.map((term, idx) => (
                    <li key={idx} className="text-gray-700">
                      {term.daysBeforeEvent} days before event: {term.refundPercentage}% refund
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No terms set.</li>
                )}
              </ul>
            </div>
          </CardContent>
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

      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Refund Policy</DialogTitle>
            <DialogDescription>Update your refund policy and cancellation terms</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="refund-description">Description</Label>
              <Textarea
                id="refund-description"
                value={refundDescription}
                onChange={e => setRefundDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Cancellation Terms</Label>
              <ul className="space-y-2">
                {cancellationTerms.map((term, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={term.daysBeforeEvent}
                      onChange={e => {
                        const updated = [...cancellationTerms]
                        updated[idx].daysBeforeEvent = Number(e.target.value)
                        setCancellationTerms(updated)
                      }}
                      className="w-24"
                      placeholder="Days before"
                    />
                    <span>days before event:</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={term.refundPercentage}
                      onChange={e => {
                        const updated = [...cancellationTerms]
                        updated[idx].refundPercentage = Number(e.target.value)
                        setCancellationTerms(updated)
                      }}
                      className="w-20"
                      placeholder="% refund"
                    />
                    <span>% refund</span>
                    <Button variant="ghost" size="icon" onClick={() => setCancellationTerms(cancellationTerms.filter((_, i) => i !== idx))}>
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-2" onClick={() => setCancellationTerms([...cancellationTerms, { daysBeforeEvent: 1, refundPercentage: 0 }])}>
                + Add Term
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRefundPolicy}>Save Policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
