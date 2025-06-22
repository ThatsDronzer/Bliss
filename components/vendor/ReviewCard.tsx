"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

interface Review {
  id?: string
  name: string
  rating: number
  comment: string
  date?: string
  avatar?: string
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            {review.avatar ? (
              <Image
                src={review.avatar}
                alt={review.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-pink-100 text-pink-600 text-lg font-semibold">
                {review.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{review.name}</h4>
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
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-gray-600">{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 