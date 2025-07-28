"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, Plus, X } from "lucide-react"

import { useAuth, useSession, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"

export default function EditListingPage() {
  const router = useRouter()
    const { session } = useSession();
  const [token, setToken] = useState<string | null>(null)
  const params = useParams()
  const { isLoaded, isSignedIn } = useAuth();
  
  const { user } = useUser();
  const userRole = user?.unsafeMetadata?.role as string || "user";
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    // capacity: "",
    images: [] as string[],
    // terms: [] as string[],
  })
  const [newTerm, setNewTerm] = useState("")

  // Redirect if not authenticated as vendor
  useEffect(() => {
    if (isLoaded && (!isSignedIn || userRole !== "vendor")) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, userRole, router]);

  if (!isLoaded || !isSignedIn || userRole !== "vendor") {
    return null;
  }
  useEffect(() => {
    const fetchToken = async () => {
      if (session) {
        const userToken = await session.getToken();
        setToken(userToken);
      }
    };
    fetchToken();
  }, [session]);

 useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listing/${params.id}`);
        const data = await res.json();
        const listing = data.listing;

        setFormData({
          title: listing.title || "",
          description: listing.description || "",
          category: listing.category || "",
          price: listing.price || "",
          location: listing.location || "",
          // capacity: listing.capacity || "",
          images: listing.images || [],  
          // terms: listing.terms || [],
        });
      } catch (err) {
        console.error("Failed to fetch listing:", err);
      }
    }

    if (params?.id) {
      fetchListing();
    }
  }, [params?.id]);

  const categories = [
    "Wedding Venue",
    "Photography",
    "Catering",
    "Decoration",
    "Music & DJ",
    "Transportation",
    "Beauty & Makeup",
    "Florist",
    "Wedding Planner",
    "Other",
  ]

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // const handleAddTerm = () => {
  //   if (newTerm.trim() && !formData.terms.includes(newTerm.trim())) {
  //     handleInputChange("terms", [...formData.terms, newTerm.trim()])
  //     setNewTerm("")
  //   }
  // }

  // const handleRemoveTerm = (term: string) => {
  //   handleInputChange(
  //     "terms",
  //     formData.terms.filter((t) => t !== term)
  //   )
  // }

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files
  //   if (files) {
  //     // For demo purposes, we'll just add placeholder URLs
  //     const newImages = Array.from(files).map((file) => `/placeholder.svg?text=${file.name}`)
  //     handleInputChange("images", [...formData.images, ...newImages])
  //   }
  // }

  // const handleRemoveImage = (index: number) => {
  //   handleInputChange(
  //     "images",
  //     formData.images.filter((_, i) => i !== index)
  //   )
  // }

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      return "Please fill in all required fields (Title, Description, Category, Price)"
    }
    // if (formData.terms.length === 0) {
    //   return "Please add at least one term or condition"
    // }
    return null
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();


  const validationError = validateForm();
  if (validationError) {
    toast({
      title: "Validation Error",
      description: validationError,
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);
  

  try {

    const res = await fetch("/api/listing", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Auth header
      },
      body: JSON.stringify({
        listingId: params.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        location: formData.location,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to update listing");
    }

    toast({
      title: "Listing Updated",
      description: "Your listing has been successfully updated.",
    });

    router.push("/vendor-dashboard/listings");
  } catch (err) {
    toast({
      title: "Error",
      description: "An error occurred while updating the listing.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/vendor-dashboard/listings")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Listing</h1>
          <p className="text-gray-500 mt-1">Update your venue or service listing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the essential details about your listing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter listing title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., ₹50,000 or Starting from ₹25,000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter location"
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange("capacity", e.target.value)}
                    placeholder="e.g., 200 guests"
                  />
                </div> */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your service or venue in detail..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Upload images of your venue or service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Click to upload images</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  // onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    Choose Files
                  </Button>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Listing image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        // onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
              <CardDescription>Add any specific terms or conditions for your service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  placeholder="Add a term or condition"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTerm())}
                />
                <Button type="button" onClick={handleAddTerm} disabled={!newTerm.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.terms.length > 0 && (
                <div className="space-y-2">
                  {formData.terms.map((term, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox checked={true} disabled />
                      <span className="flex-1">{term}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTerm(term)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card> */}

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/vendor-dashboard/listings")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 