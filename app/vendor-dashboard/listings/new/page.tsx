"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Plus, X, DollarSign } from "lucide-react"
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useSession } from '@clerk/clerk-react';
import { Badge } from "@/components/ui/badge"

interface Feature {
  id: string;
  name: string;
  price: string;
  description: string;
}

export default function NewListingPage() {
  const { session } = useSession();
  const [token, setToken] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(true)
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || "user"
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    capacity: "",
    images: [] as (string | File)[],
    terms: [] as string[],
    features: [] as Feature[],
  })
  const [newTerm, setNewTerm] = useState("")
  const [newFeature, setNewFeature] = useState({
    name: "",
    price: "",
    description: "",
  })

  useEffect(() => {
    const fetchToken = async () => {
      setTokenLoading(true);
      try {
        if (session) {
          const userToken = await session.getToken();
          setToken(userToken);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setTokenLoading(false);
      }
    };
    
    if (isSignedIn && session) {
      fetchToken();
    } else {
      setTokenLoading(false);
    }
  }, [session, isSignedIn]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

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

  const handleAddTerm = () => {
    if (newTerm.trim() && !formData.terms.includes(newTerm.trim())) {
      handleInputChange("terms", [...formData.terms, newTerm.trim()])
      setNewTerm("")
    }
  }

  const handleRemoveTerm = (term: string) => {
    handleInputChange(
      "terms",
      formData.terms.filter((t) => t !== term)
    )
  }

  const handleAddFeature = () => {
    if (newFeature.name.trim() && newFeature.price.trim()) {
      const feature: Feature = {
        id: Date.now().toString(),
        name: newFeature.name.trim(),
        price: newFeature.price.trim(),
        description: newFeature.description.trim(),
      }
      
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
      
      setNewFeature({
        name: "",
        price: "",
        description: "",
      })
    } else {
      toast({
        title: "Validation Error",
        description: "Please provide feature name and price",
        variant: "destructive",
      })
    }
  }

  const handleRemoveFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== featureId)
    }))
  }

  const handleFeatureInputChange = (field: string, value: string) => {
    setNewFeature(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

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
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('features', JSON.stringify(formData.features));
      
      // Append each image file
      formData.images.forEach((image) => {
        if (image instanceof File) {
          formDataToSend.append('images', image);
        }
      });

      const response = await fetch('/api/listing', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create listing');
      }

      const data = await response.json();
      toast({ title: "Success", description: "Listing created successfully!" });
      router.push("/vendor-dashboard/listings");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast({
        title: "Error",
        description: (err as Error).message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn || userRole !== "vendor" || tokenLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... (keep all your existing JSX structure) ... */}
    </div>
  );
}