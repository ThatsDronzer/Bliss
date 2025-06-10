"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function VendorListingsPage() {
  const router = useRouter()
  const { isAuthenticated, isVendor, vendorListings, updateVendorListing, deleteVendorListing } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)

  // Redirect if not authenticated as vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      router.push("/")
    }
  }, [isAuthenticated, isVendor, router])

  if (!isAuthenticated || !isVendor) {
    return null
  }

  // Filter listings based on search and status
  const filteredListings = vendorListings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || listing.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleToggleStatus = (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active"
    updateVendorListing(listingId, { status: newStatus })

    toast({
      title: `Listing ${newStatus}`,
      description: `The listing has been ${newStatus === "Active" ? "activated" : "deactivated"}.`,
    })
  }

  const handleDeleteClick = (listingId: string) => {
    setSelectedListing(listingId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedListing) {
      deleteVendorListing(selectedListing)
      setDeleteDialogOpen(false)

      toast({
        title: "Listing Deleted",
        description: "The listing has been permanently deleted.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-gray-500 mt-1">Manage your venue and service listings</p>
        </div>
        <Button onClick={() => router.push("/vendor-dashboard/listings/new")} className="mt-4 md:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Add New Listing
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search listings..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.title}
                  width={400}
                  height={225}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded">
                  {listing.category}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      listing.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{listing.description}</p>
                <div className="font-bold text-primary text-xl mb-3">{listing.price}</div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {listing.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {listing.features.length > 3 && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">+{listing.features.length - 3} more</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/vendor-dashboard/listings/${listing.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`flex-1 ${listing.status === "Active" ? "text-yellow-600" : "text-green-600"}`}
                    onClick={() => handleToggleStatus(listing.id, listing.status)}
                  >
                    {listing.status === "Active" ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" /> Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" /> Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDeleteClick(listing.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg font-medium">No listings found</p>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
            <Button className="mt-4" onClick={() => router.push("/vendor-dashboard/listings/new")}>
              Add New Listing
            </Button>
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
