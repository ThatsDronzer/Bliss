"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, X, Plus, IndianRupee } from "lucide-react"

import { useAuth, useSession, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { deleteUploadedImage } from "@/lib/client-side-upload"
import { Badge } from "@/components/ui/badge"

interface ListingImage {
  url: string;
  public_id?: string;
}

interface ListingItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: ListingImage;
  _id?: string;
}

interface ListingData {
  title: string;
  description: string;
  category: string;
  price: string;
  location: string;
  images: ListingImage[];
  features: string[];
  items: ListingItem[];
}

interface CloudinaryUploadResponse {
  url: string;
  public_id: string;
  [key: string]: any;
}

interface NewItem {
  id: string;
  name: string;
  price: string;
  description: string;
  image: File | null;
  imagePreview: string;
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
    features: [],
    items: [],
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [newItem, setNewItem] = useState<NewItem>({
    id: "",
    name: "",
    price: "",
    description: "",
    image: null,
    imagePreview: "",
  })
  const [itemImagesToDelete, setItemImagesToDelete] = useState<string[]>([])

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
          features: listing.features || [],
          items: listing.items || [],
        });
      } catch (err) {
        console.error("Failed to fetch listing:", err);
        toast.error("Failed to load listing data. Please try again.");
      }
    }

    if (params?.id) {
      fetchListing();
    }
  }, [params?.id]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (newItem.imagePreview) {
        URL.revokeObjectURL(newItem.imagePreview);
      }
    };
  }, [newItem.imagePreview]);

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

  const handleInputChange = (field: keyof ListingData, value: string | string[] | ListingImage[] | ListingItem[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setImageFiles(prev => [...prev, ...Array.from(files)]);
      toast.success(`${files.length} image(s) selected for upload.`);
    }
  }

  const handleRemoveExistingImage = (index: number, publicId: string) => {
    if (publicId) {
      setImagesToDelete(prev => [...prev, publicId]);
    }

    handleInputChange(
      "images",
      formData.images.filter((_, i) => i !== index)
    )

    toast.success("Image marked for deletion");
  }

  const handleRemoveNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    toast.success("Image removed from upload list");
  }

  // Features functions
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    } else {
      toast.error("Feature cannot be empty")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleFeatureKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  }

  // Items functions
  const handleItemImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size exceeds 10MB limit");
        return;
      }

      const preview = URL.createObjectURL(file);
      setNewItem(prev => ({
        ...prev,
        image: file,
        imagePreview: preview
      }));
    }
  };

  const handleRemoveItemImage = () => {
    if (newItem.imagePreview) {
      URL.revokeObjectURL(newItem.imagePreview);
    }
    setNewItem(prev => ({
      ...prev,
      image: null,
      imagePreview: ""
    }));
  };

  const handleAddItem = () => {
    if (newItem.name.trim() && newItem.price.trim() && newItem.image) {
      const item: NewItem = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        price: newItem.price.trim(),
        description: newItem.description.trim(),
        image: newItem.image,
        imagePreview: newItem.imagePreview
      }
//@ts-ignore
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, item]
      }))

      setNewItem({
        id: "",
        name: "",
        price: "",
        description: "",
        image: null,
        imagePreview: ""
      })
    } else {
      toast.error("Please fill in all required item fields and select an image")
    }
  }

  const handleRemoveItem = (index: number, itemId?: string, imagePublicId?: string) => {
    if (imagePublicId) {
      setItemImagesToDelete(prev => [...prev, imagePublicId]);
    }

    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleItemInputChange = (field: string, value: string) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      return "Please fill in all required fields (Title, Description, Category, Price)"
    }
    return null
  }

const uploadImagesOnSubmit = async (files: File[]): Promise<CloudinaryUploadResponse[]> => {
  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'nextjs_unsigned_upload');
    formData.append('folder', 'listings');
    formData.append('tags', 'temporary'); // Add this line

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

const uploadItemImagesToCloudinary = async (items: NewItem[]): Promise<{ url: string, public_id: string }[]> => {
  const uploadPromises = items.map(async (item) => {
    if (!item.image) {
      throw new Error(`No image found for item: ${item.name}`);
    }

    const formData = new FormData();
    formData.append('file', item.image);
    formData.append('upload_preset', 'nextjs_unsigned_upload');
    formData.append('folder', 'listings/items');
    formData.append('tags', 'temporary,item'); // Add temporary tag

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Image upload failed for item: ${item.name}`);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      public_id: data.public_id
    };
  });

  return Promise.all(uploadPromises);
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationError = validateForm();
  if (validationError) {
    toast.error(validationError);
    return;
  }

  setIsLoading(true);

  try {
    let uploadedImages: CloudinaryUploadResponse[] = [];
    let uploadedItemImages: { url: string, public_id: string }[] = [];
    
    // Upload new main images
    if (imageFiles.length > 0) {
      const uploadResult = await uploadImagesOnSubmit(imageFiles);
      uploadedImages = uploadResult;
    }

    // Upload new item images (only for items without _id)
    const newItems = formData.items.filter(item => !item._id);
    if (newItems.length > 0) {
      // Convert NewItem[] to the format expected by upload function
      const itemsToUpload = newItems.map(item => ({
        ...item,
        image: (item as any).image // Type assertion for the upload function
      }));
      //@ts-ignore
      
      const itemUploadResult = await uploadItemImagesToCloudinary(itemsToUpload);
      uploadedItemImages = itemUploadResult;
    }

    // Prepare items data with proper image handling
    const itemsWithImages = formData.items.map((item, index) => {
      // If it's an existing item with _id, keep the existing image
      if (item._id) {
        return {
          _id: item._id,
          name: item.name,
          description: item.description,
          price: parseFloat(item.price.toString().replace(/[^0-9.-]+/g, "")) || 0,
          image: item.image
        };
      }
      
      // If it's a new item, use the uploaded image
      const newItemIndex = newItems.findIndex(newItem => (newItem as any).id === (item as any).id);
      if (newItemIndex !== -1 && uploadedItemImages[newItemIndex]) {
        return {
          name: item.name,
          description: item.description,
          price: parseFloat(item.price.toString().replace(/[^0-9.-]+/g, "")) || 0,
          image: uploadedItemImages[newItemIndex]
        };
      }
      
      return item;
    });

    // Prepare request body
    const requestBody = {
      listingId: params.id as string,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      location: formData.location,
      features: formData.features,
      items: itemsWithImages,
      images: uploadedImages,
      imagesToDelete: imagesToDelete,
      itemImagesToDelete: itemImagesToDelete,
      tempImageIds: uploadedImages.map(img => img.public_id),
      tempItemImageIds: uploadedItemImages.map(img => img.public_id)
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
      // Cleanup uploaded images if API fails
      if (uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map(img => deleteUploadedImage(img.public_id))
        );
      }
      if (uploadedItemImages.length > 0) {
        await Promise.all(
          uploadedItemImages.map(img => deleteUploadedImage(img.public_id))
        );
      }
      throw new Error(responseData.message || "Failed to update listing");
    }

    toast.success("Listing updated successfully");

    router.push("/vendor-dashboard/listings");
  } catch (err: any) {
    console.error("Update error:", err);
    toast.error(err.message || "An error occurred while updating the listing. Please try again.");
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
              <CardTitle>Listing Images</CardTitle>
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

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Update key features or amenities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={handleFeatureKeyPress}
                  placeholder="Enter a feature (e.g., Air Conditioning)"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddFeature}
                  disabled={!newFeature.trim()}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {formData.features.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Features:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items & Services</CardTitle>
              <CardDescription>Update individual items or services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Item Form */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-4">Add New Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name *</Label>
                    <Input
                      id="item-name"
                      value={newItem.name}
                      onChange={(e) => handleItemInputChange("name", e.target.value)}
                      placeholder="e.g., Photography, Catering, Decoration"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price">Price *</Label>
                    <Input
                      id="item-price"
                      value={newItem.price}
                      onChange={(e) => handleItemInputChange("price", e.target.value)}
                      placeholder="e.g., ₹10,000 or ₹500 per person"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-description">Description</Label>
                    <Input
                      id="item-description"
                      value={newItem.description}
                      onChange={(e) => handleItemInputChange("description", e.target.value)}
                      placeholder="Brief description of the item"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-image">Item Image *</Label>
                    <Input
                      id="item-image"
                      type="file"
                      accept="image/*"
                      onChange={handleItemImageSelect}
                    />
                    {newItem.imagePreview && (
                      <div className="relative mt-2">
                        <img
                          src={newItem.imagePreview}
                          alt="Item preview"
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveItemImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!newItem.name.trim() || !newItem.price.trim() || !newItem.image}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {/* Display Existing Items */}
              {formData.items.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Current Items</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.items.map((item, index) => (
                      <div key={item._id || index} className="border rounded-lg p-4 bg-white relative">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index, item._id, item.image.public_id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {item.image?.url && (
                          <div className="mb-2">
                            <img
                              src={item.image.url}
                              alt={item.name}
                              className="w-full h-16 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                          <IndianRupee className="h-4 w-4 text-green-600" />
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {item.price}
                          </Badge>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {formData.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <IndianRupee className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No items added yet. Add your first item above.</p>
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