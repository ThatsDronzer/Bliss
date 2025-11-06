"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, Store, Download, Trash2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

import { useRoleAuth } from "@/hooks/use-role-auth"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function AdminVendorsPage() {
  const router = useRouter()
  const { isAuthorized, isLoading } = useRoleAuth("admin")
  const { adminVendors, updateVendorStatus } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedVendor, setSelectedVendor] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"verify" | "reject" | "deactivate" | null>(null)

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Return null if not authorized (will redirect via useRoleAuth hook)
  if (!isAuthorized) {
    return null
  }

  // Get unique categories
  const categories = Array.from(new Set(adminVendors.map((vendor) => vendor.category)))

  // Filter vendors based on search, status, and category
  const filteredVendors = adminVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || vendor.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesCategory = categoryFilter === "all" || vendor.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleStatusChange = (vendorId: string, newStatus: string) => {
    updateVendorStatus(vendorId, newStatus)
    setDialogOpen(false)

    toast({
      title: `Vendor ${newStatus}`,
      description: `The vendor has been ${newStatus.toLowerCase()}.`,
    })
  }

  const handleActionClick = (vendor: any, action: "verify" | "reject" | "deactivate") => {
    setSelectedVendor(vendor)
    setActionType(action)
    setDialogOpen(true)
  }

  const handleExportVendors = () => {
    toast({
      title: "Export Started",
      description: "Vendors data export has been initiated. You'll receive a download link shortly.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vendors Management</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportVendors}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Store className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vendors..."
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
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.category}</TableCell>
                  <TableCell>{vendor.location}</TableCell>
                  <TableCell>{vendor.bookingsCount}</TableCell>
                  <TableCell>{vendor.totalRevenue}</TableCell>
                  <TableCell>{vendor.rating > 0 ? `${vendor.rating} (${vendor.reviewsCount})` : "N/A"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        vendor.status === "Verified"
                          ? "bg-green-100 text-green-800"
                          : vendor.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/admin-dashboard/vendors/${vendor.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        {vendor.status === "Pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleActionClick(vendor, "verify")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              Verify
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleActionClick(vendor, "reject")}>
                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {vendor.status === "Verified" && (
                          <DropdownMenuItem onClick={() => handleActionClick(vendor, "deactivate")}>
                            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                            Deactivate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No vendors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Status Change Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedVendor && actionType && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {actionType === "verify"
                    ? "Verify Vendor"
                    : actionType === "reject"
                      ? "Reject Vendor"
                      : "Deactivate Vendor"}
                </DialogTitle>
                <DialogDescription>
                  {actionType === "verify"
                    ? "Are you sure you want to verify this vendor? They will be able to list their services on the platform."
                    : actionType === "reject"
                      ? "Are you sure you want to reject this vendor? They will not be able to list their services on the platform."
                      : "Are you sure you want to deactivate this vendor? Their listings will be hidden from the platform."}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {selectedVendor.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedVendor.name}</h3>
                    <p className="text-gray-500">{selectedVendor.category}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant={actionType === "verify" ? "default" : "destructive"}
                  onClick={() =>
                    handleStatusChange(
                      selectedVendor.id,
                      actionType === "verify" ? "Verified" : actionType === "reject" ? "Rejected" : "Inactive",
                    )
                  }
                >
                  {actionType === "verify"
                    ? "Verify Vendor"
                    : actionType === "reject"
                      ? "Reject Vendor"
                      : "Deactivate Vendor"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
