"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MoreHorizontal, PlusCircle, Trash2, Edit, CheckCircle, XCircle } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { isAuthenticated, isAdmin, adminCategories, updateCategoryStatus, addCategory } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"activate" | "deactivate" | "add" | "edit" | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    icon: "Tag",
    status: "Active",
  })

  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  // Filter categories based on search and status
  const filteredCategories = adminCategories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || category.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (categoryId: string, newStatus: string) => {
    updateCategoryStatus(categoryId, newStatus)
    setDialogOpen(false)

    toast({
      title: `Category ${newStatus}`,
      description: `The category has been ${newStatus.toLowerCase()}.`,
    })
  }

  const handleActionClick = (category: any, action: "activate" | "deactivate" | "edit") => {
    setSelectedCategory(category)
    setActionType(action)

    if (action === "edit") {
      setNewCategory({
        name: category.name,
        icon: category.icon,
        status: category.status,
      })
    }

    setDialogOpen(true)
  }

  const handleAddCategory = () => {
    setActionType("add")
    setNewCategory({
      name: "",
      icon: "Tag",
      status: "Active",
    })
    setDialogOpen(true)
  }

  const handleSaveCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Missing information",
        description: "Please enter a category name.",
        variant: "destructive",
      })
      return
    }

    if (actionType === "add") {
      addCategory(newCategory)
      toast({
        title: "Category Added",
        description: "The new category has been added successfully.",
      })
    } else if (actionType === "edit" && selectedCategory) {
      updateCategoryStatus(selectedCategory.id, newCategory.status)
      toast({
        title: "Category Updated",
        description: "The category has been updated successfully.",
      })
    }

    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <Button onClick={handleAddCategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search categories..."
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Vendors</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.icon}</TableCell>
                  <TableCell>{category.vendorCount}</TableCell>
                  <TableCell>{category.createdAt}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        category.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.status}
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
                        <DropdownMenuItem onClick={() => handleActionClick(category, "edit")}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {category.status === "Active" ? (
                          <DropdownMenuItem onClick={() => handleActionClick(category, "deactivate")}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleActionClick(category, "activate")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Activate
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
                <TableCell colSpan={6} className="h-24 text-center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {actionType === "add" || actionType === "edit" ? (
            <>
              <DialogHeader>
                <DialogTitle>{actionType === "add" ? "Add Category" : "Edit Category"}</DialogTitle>
                <DialogDescription>
                  {actionType === "add" ? "Add a new category to the platform." : "Edit the selected category details."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={newCategory.icon}
                    onValueChange={(value) => setNewCategory({ ...newCategory, icon: value })}
                  >
                    <SelectTrigger id="icon">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tag">Tag</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Camera">Camera</SelectItem>
                      <SelectItem value="Utensils">Utensils</SelectItem>
                      <SelectItem value="Palette">Palette</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Users">Users</SelectItem>
                      <SelectItem value="Gift">Gift</SelectItem>
                      <SelectItem value="Ring">Ring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {actionType === "edit" && (
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newCategory.status}
                      onValueChange={(value) => setNewCategory({ ...newCategory, status: value })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory}>{actionType === "add" ? "Add Category" : "Save Changes"}</Button>
              </DialogFooter>
            </>
          ) : selectedCategory && (actionType === "activate" || actionType === "deactivate") ? (
            <>
              <DialogHeader>
                <DialogTitle>{actionType === "activate" ? "Activate Category" : "Deactivate Category"}</DialogTitle>
                <DialogDescription>
                  {actionType === "activate"
                    ? "Are you sure you want to activate this category? It will be visible to all users."
                    : "Are you sure you want to deactivate this category? It will be hidden from all users."}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="font-medium">Category: {selectedCategory.name}</p>
                <p className="text-sm text-gray-500">Vendors: {selectedCategory.vendorCount}</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant={actionType === "activate" ? "default" : "destructive"}
                  onClick={() =>
                    handleStatusChange(selectedCategory.id, actionType === "activate" ? "Active" : "Inactive")
                  }
                >
                  {actionType === "activate" ? "Activate Category" : "Deactivate Category"}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
