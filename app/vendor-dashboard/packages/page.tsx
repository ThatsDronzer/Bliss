"use client"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { useEffect, useState } from "react"
import { Plus, Loader2, Package as PackageIcon, Eye, EyeOff } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface VendorPackage {
  _id: string
  packageName: string
  packageType: string
  description: string
  totalPrice: number
  discount: number
  finalPrice: number
  isActive: boolean
  items: Array<{ name: string; quantity?: number }>
}

export default function VendorPackagesPage() {
  const { isAuthorized, isLoading: authLoading } = useRoleAuth("vendor")
  const [packages, setPackages] = useState<VendorPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [packageName, setPackageName] = useState("")
  const [packageType, setPackageType] = useState("")
  const [description, setDescription] = useState("")
  const [totalPrice, setTotalPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [itemName, setItemName] = useState("")
  const [items, setItems] = useState<Array<{ name: string; quantity: number }>>([])

  useEffect(() => {
    if (isAuthorized) {
      fetchPackages()
    }
  }, [isAuthorized])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/vendor/packages?includeInactive=true")
      const data = await response.json()

      if (data.success) {
        setPackages(data.data)
      } else {
        toast.error(data.error || "Failed to fetch packages")
      }
    } catch (error) {
      console.error("Error fetching packages:", error)
      toast.error("Failed to fetch packages")
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    if (itemName.trim()) {
      setItems([...items, { name: itemName.trim(), quantity: 1 }])
      setItemName("")
    }
  }

  const handleCreatePackage = async () => {
    if (!packageName || !packageType || !description || !totalPrice || items.length === 0) {
      toast.error("Please fill all required fields and add at least one item")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/vendor/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName,
          packageType,
          description,
          items,
          totalPrice: parseFloat(totalPrice),
          discount: discount ? parseFloat(discount) : 0,
          isPublic: true,
          availableForBidding: true,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Package created successfully!")
        setShowCreateDialog(false)
        resetForm()
        fetchPackages()
      } else {
        toast.error(data.error || "Failed to create package")
      }
    } catch (error) {
      console.error("Error creating package:", error)
      toast.error("Failed to create package")
    } finally {
      setSubmitting(false)
    }
  }

  const togglePackageStatus = async (packageId: string) => {
    try {
      const response = await fetch("/api/vendor/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, isActive: !packages.find((p) => p._id === packageId)?.isActive }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Package status updated")
        fetchPackages()
      } else {
        toast.error(data.error || "Failed to update package")
      }
    } catch (error) {
      console.error("Error updating package:", error)
      toast.error("Failed to update package")
    }
  }

  const resetForm = () => {
    setPackageName("")
    setPackageType("")
    setDescription("")
    setTotalPrice("")
    setDiscount("")
    setItems([])
    setItemName("")
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    )
  }

  if (!isAuthorized) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Packages</h1>
          <p className="text-sm text-gray-600 mt-1">Create and manage prebuilt packages</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Package
        </Button>
      </div>

      {packages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PackageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No packages created yet</p>
            <Button onClick={() => setShowCreateDialog(true)}>Create Your First Package</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <Card key={pkg._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{pkg.packageName}</CardTitle>
                    <CardDescription className="capitalize">{pkg.packageType}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {pkg.isActive ? (
                      <Badge className="bg-green-600"><Eye className="w-3 h-3 mr-1" />Active</Badge>
                    ) : (
                      <Badge variant="secondary"><EyeOff className="w-3 h-3 mr-1" />Inactive</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{pkg.description}</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.items.map((item, idx) => (
                    <Badge key={idx} variant="outline">{item.name}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {pkg.discount > 0 && (
                      <p className="text-sm text-gray-500 line-through">₹{pkg.totalPrice.toLocaleString()}</p>
                    )}
                    <p className="text-2xl font-bold text-primary">₹{pkg.finalPrice.toLocaleString()}</p>
                    {pkg.discount > 0 && (
                      <Badge variant="secondary" className="mt-1">{pkg.discount}% OFF</Badge>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => togglePackageStatus(pkg._id)}>
                    {pkg.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Package Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
            <DialogDescription>Build a prebuilt package for quick quoting</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Package Name *</Label>
                <Input value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="e.g., Premium Light Setup" />
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={packageType} onValueChange={setPackageType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="sound">Sound</SelectItem>
                    <SelectItem value="decoration">Decoration</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="combo">Combo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Price (₹) *</Label>
                <Input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Items *</Label>
              <div className="flex gap-2">
                <Input placeholder="Item name" value={itemName} onChange={(e) => setItemName(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addItem())} />
                <Button type="button" onClick={addItem}>Add</Button>
              </div>
              {items.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {items.map((item, idx) => (
                    <Badge key={idx} variant="secondary">
                      {item.name}
                      <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="ml-2">×</button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreatePackage} disabled={submitting}>
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : "Create Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
