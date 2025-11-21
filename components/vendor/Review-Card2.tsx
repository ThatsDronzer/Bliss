"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Trash2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog"

interface Review {
  id?: string
  _id?: string
  userId?: string
  name?: string 
  rating: number
  comment: string
  date?: string
  avatar?: string
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initial = review.name?.charAt(0)?.toUpperCase() ?? 'U' // fallback to 'U'
  const { user } = useUser();
  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if the logged-in user is the author
  const isOwnReview = user && (review.userId === user.id);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/review?id=${review._id || review.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete review');
      }
      // Optionally: trigger a refresh or callback
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
      setShowDialog(false);
    }
  };

  return (
    <Card className="bg-white/90 shadow-md hover:shadow-lg relative">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            {review.avatar ? (
              <Image
                src={review.avatar}
                alt={review.name ?? "User Avatar"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-600 text-lg font-semibold">
                {initial}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{review.name ?? "Unnamed User"}</h4>
              {review.date && (
                <span className="text-sm text-gray-500">{review.date}</span>
              )}
            </div>

            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? 'fill-pink-500 text-pink-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-gray-600">{review.comment}</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
        {/* Delete button for own review */}
        {isOwnReview && (
          <button
            className="absolute bottom-4 right-4 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow transition"
            title="Delete review"
            onClick={() => setShowDialog(true)}
            disabled={deleting}
            aria-label="Delete review"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        <ConfirmDeleteDialog
          open={showDialog}
          onConfirm={handleDelete}
          onCancel={() => setShowDialog(false)}
        />
      </CardContent>
    </Card>
  )
}
