"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Star, MessageSquare } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { mockVendorReviews } from "@/lib/auth"

export default function VendorReviewsPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const userRole = user?.unsafeMetadata?.role as string || "user"
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [responseFilter, setResponseFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [responseText, setResponseText] = useState("")

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor")
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/")
    }
  }, [isLoaded, isSignedIn, userRole, router])

  // Function to respond to a review
  const respondToReview = (reviewId: string, responseText: string) => {
    // In a real app, this would make an API call to update the review
    console.log(`Responding to review ${reviewId}: ${responseText}`)
    // For demo purposes, we'll update the reviews in memory
    const updatedReviews = [...vendorReviews]
    const reviewIndex = updatedReviews.findIndex(r => r.id === reviewId)
    if (reviewIndex !== -1) {
      updatedReviews[reviewIndex] = {
        ...updatedReviews[reviewIndex],
        response: responseText,
        hasResponse: true
      }
    }
  }

  if (!isLoaded || !isSignedIn || userRole !== "vendor") {
    return null
  }

  // Use the mock vendor reviews for demonstration
  const vendorReviews = mockVendorReviews
  
  // Filter reviews based on search, rating, and response status
  const filteredReviews = vendorReviews.filter((review) => {
    const matchesSearch =
      review.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.clientName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRating = ratingFilter === "all" || review.rating === Number.parseInt(ratingFilter)

    const matchesResponse =
      responseFilter === "all" ||
      (responseFilter === "responded" && review.hasResponse) ||
      (responseFilter === "pending" && !review.hasResponse)

    return matchesSearch && matchesRating && matchesResponse
  })

  const handleRespondClick = (review: any) => {
    setSelectedReview(review)
    setResponseText(review.response || "")
    setDialogOpen(true)
  }

  const handleSubmitResponse = () => {
    if (!selectedReview || !responseText.trim()) return

    respondToReview(selectedReview.id, responseText)
    setDialogOpen(false)

    toast({
      title: "Response Submitted",
      description: "Your response to the review has been saved.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-gray-500 mt-1">Manage and respond to client reviews</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={responseFilter} onValueChange={setResponseFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Response status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="pending">Needs Response</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={review.clientImage || "/placeholder.svg"}
                      alt={review.clientName}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{review.clientName}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      {!review.hasResponse && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Needs Response
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-gray-700">{review.review}</p>

                    {review.hasResponse && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium">Your Response</h4>
                          <span className="text-xs text-gray-500">
                            {/* For demo purposes, we'll use a static date */}
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{review.response}</p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant={review.hasResponse ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleRespondClick(review)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {review.hasResponse ? "Edit Response" : "Respond"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Respond to Review</DialogTitle>
            <DialogDescription>Your response will be visible to all users viewing your profile.</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="py-4">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={selectedReview.clientImage || "/placeholder.svg"}
                      alt={selectedReview.clientName}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedReview.clientName}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= selectedReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{selectedReview.review}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="response" className="text-sm font-medium">
                  Your Response
                </label>
                <Textarea
                  id="response"
                  placeholder="Write your response here..."
                  rows={5}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitResponse} disabled={!responseText.trim()}>
              Submit Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
