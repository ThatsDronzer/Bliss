"use client";

import { useState } from "react";
import { Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddImagesModalProps {
  listingId: string;
  token: string | null;
  onImagesAdded: () => void;
}

export default function AddImagesModal({ listingId, token, onImagesAdded }: AddImagesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files);
    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!token) {
      toast({
        title: "Unauthorized",
        description: "Please sign in to upload images",
        variant: "destructive",
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('listingId', listingId);
      
      selectedImages.forEach((image) => {
        formData.append('newImages', image);
      });

      const response = await fetch('/api/listing/add-images', {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload images');
      }

      const data = await response.json();
      
      toast({
        title: "Success!",
        description: `Added ${selectedImages.length} new image(s) to your listing`,
      });

      // Reset and refresh
      setSelectedImages([]);
      setIsOpen(false);
      onImagesAdded(); // Refresh the parent component

    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add Images
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add More Images</DialogTitle>
          <DialogDescription>
            Upload additional images for your listing. These will be added to your existing images.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <Label htmlFor="add-images" className="cursor-pointer text-blue-600 hover:text-blue-700">
              Click to select images
            </Label>
            <Input
              id="add-images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isUploading}
            />
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG, JPEG up to 10MB each
            </p>
          </div>

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Selected images ({selectedImages.length}):
              </p>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={isUploading}
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || selectedImages.length === 0}
            >
              {isUploading ? "Uploading..." : `Upload ${selectedImages.length} Image(s)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}