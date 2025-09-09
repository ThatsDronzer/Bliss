"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import { useAuth, useSession, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface ListingImage {
  url: string;
  public_id?: string;
}

interface ListingData {
  title: string;
  description: string;
  category: string;
  price: string;
  location: string;
  images: ListingImage[];
}

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  created_at: string;
}

export default function EditListingPage() {
  const router = useRouter()
  const { session } = useSession();
  const [token, setToken] = useState<string | null>(null)
  const params = useParams()
  const { isLoaded, isSignedIn } = useAuth();

  const { user } = useUser();
  const userRole = user?.unsafeMetadata?.role as string || "user";
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ListingData>({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    images: [],
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

  // ✅ ADD THESE FUNCTIONS INSIDE YOUR COMPONENT
  const uploadImagesOnSubmit = async (files: File[]): Promise<CloudinaryUploadResponse[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'nextjs_unsigned_upload');
      formData.append('folder', 'listings');
      formData.append('tags', 'temporary');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      return response.json();
    });

    return Promise.all(uploadPromises);
  };

  const deleteUploadedImage = async (publicId: string): Promise<void> => {
    try {
      await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  // Redirect if not authenticated as vendor
  useEffect(() => {
    if (isLoaded && (!isSignedIn || userRole !== "vendor")) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, userRole, router]);

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
          price: listing.price?.toString() || "",
          location: listing.location || "",
          images: listing.images || [],
        });
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        toast({
          title: "Error",
          description: "Failed to fetch listing details",
          variant: "destructive",
        });
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

  const handleInputChange = (field: keyof ListingData, value: string | ListingImage[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // ✅ ADD FILE SIZE VALIDATION
      const validFiles = Array.from(files).filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 10MB limit`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });

      setImageFiles(prev => [...prev, ...validFiles]);
      
      if (validFiles.length > 0) {
        toast({
          title: "Images Selected",
          description: `${validFiles.length} image(s) added for upload`,
        });
      }
    }
  }

  const handleRemoveExistingImage = (index: number, publicId: string) => {
    // Add to deletion list
    if (publicId) {
      setImagesToDelete(prev => [...prev, publicId]);
    }

    // Remove from displayed images
    handleInputChange(
      "images",
      formData.images.filter((_, i) => i !== index)
    )

    toast({
      title: "Image Removed",
      description: "Image will be deleted when you save changes",
    });
  }

  const handleRemoveNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Image Removed",
      description: "Upload cancelled for this image",
    });
  }

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      return "Please fill in all required fields (Title, Description, Category, Price)"
    }
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
      let uploadedImages: CloudinaryUploadResponse[] = [];
      
      // ✅ UPLOAD NEW IMAGES FIRST (if any)
      if (imageFiles.length > 0) {
        uploadedImages = await uploadImagesOnSubmit(imageFiles);
      }

      // ✅ PREPARE JSON DATA (not FormData)
      const requestBody = {
        listingId: params.id as string,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        location: formData.location,
        images: uploadedImages, // Newly uploaded images
        imagesToDelete: imagesToDelete, // Images to remove
        tempImageIds: uploadedImages.map(img => img.public_id) // For cleanup
      };

      const res = await fetch("/api/listing", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await res.json();

      if (!res.ok) {
        // ❌ If API fails, delete the images we just uploaded
        if (uploadedImages.length > 0) {
          await Promise.all(
            uploadedImages.map(img => deleteUploadedImage(img.public_id))
          );
        }
        throw new Error(responseData.message || "Failed to update listing");
      }

      toast({
        title: "Listing Updated",
        description: "Your listing has been successfully updated.",
      });

      router.push("/vendor-dashboard/listings");
    } catch (err: any) {
      console.error("Update error:", err);
      toast({
        title: "Error",
        description: err.message || "An error occurred while updating the listing.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn || userRole !== "vendor") {
    return null;
  }

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
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., 50000"
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
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />

                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                >
                  Choose Files
                </label>
                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG, or WEBP (Max 10MB each)
                </p>
              </div>

              {/* Existing images */}
              {formData.images.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Existing Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Listing image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center rounded-lg transition-all">
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(index, image.public_id || '')}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New images to be uploaded */}
              {imageFiles.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">New Images to Upload</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center rounded-lg transition-all">
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate">
                          {file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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