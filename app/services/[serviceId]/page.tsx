'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import ReviewForm from '@/components/review-form';
import { ReviewCard } from '@/components/vendor/Review-Card2';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
  userName: string;
  userImage?: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  features: string[];
  isActive: boolean;
  vendor: {
    _id: string;
    name: string;
    image?: string;
  };
  category: string;
}

export default function ServiceDetailPage() {
  // Get route params and auth
  const params = useParams();
  const urlServiceId = params.serviceId as string;
  const { isSignedIn, user: currentUser } = useUser();

  // State declarations
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  // Store the actual service ID from the API
  const [serviceId] = useState(params.serviceId);

    // Default image constant
  const DEFAULT_IMAGE = '/default-service-placeholder.jpg';  

  // Derived state
  const mainImage = service?.images?.[0] || DEFAULT_IMAGE;
  const sideImages = service?.images?.slice(1) || [];
  const hasMoreImages = service?.images && service.images.length > 5;

  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/services/${serviceId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch service details');
        }
        
        setService(data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError(err instanceof Error ? err.message : 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    if (urlServiceId) {
      fetchServiceDetails();
    }
  }, [urlServiceId]);

  // Function to fetch reviews
  const fetchReviews = async () => {
    if (!urlServiceId) return;
    
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/review?targetType=service&targetId=${urlServiceId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await res.json();
      setReviews(
        (data.reviews || []).map((review: Review) => ({
          ...review,
          date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : undefined,
        }))
      );
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Initial fetch of reviews and listen for review submissions
  useEffect(() => {
    if (urlServiceId) {
      fetchReviews();
      
      // Listen for review submissions
      const handleReviewSubmitted = () => {
        fetchReviews();
      };
      
      window.addEventListener('reviewSubmitted', handleReviewSubmitted);
      
      return () => {
        window.removeEventListener('reviewSubmitted', handleReviewSubmitted);
      };
    }
  }, [urlServiceId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center py-10">
          <p className="text-gray-600">Service not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.name}</h1>
      
      {/* Service Rating Summary */}
      {reviews && reviews.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => {
              const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
              return (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating)
                      ? 'text-pink-500 fill-current'
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            })}
          </div>
          <span className="text-lg font-medium text-gray-900">
            {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
          </span>
          <span className="text-gray-600">({reviews.length} reviews)</span>
        </div>
      )}

      {/* Images Section */}
      <div className="relative mb-8">
        <div className="grid grid-cols-4 gap-2 h-[400px] md:h-[500px]">
          {/* Main large image */}
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={service.images?.[0] || DEFAULT_IMAGE}
              alt={service.name}
              fill
              className="object-cover rounded-l-lg"
              sizes="50vw"
              priority
            />
          </div>
          
          {/* Top right images */}
          <div className="relative">
            <Image
              src={service.images?.[1] || DEFAULT_IMAGE}
              alt={`${service.name} 2`}
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
          <div className="relative">
            <Image
              src={service.images?.[2] || DEFAULT_IMAGE}
              alt={`${service.name} 3`}
              fill
              className="object-cover rounded-tr-lg"
              sizes="25vw"
            />
          </div>
          
          {/* Bottom right images */}
          <div className="relative">
            <Image
              src={service.images?.[3] || DEFAULT_IMAGE}
              alt={`${service.name} 4`}
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
          <div className="relative">
            <Image
              src={service.images?.[4] || DEFAULT_IMAGE}
              alt={`${service.name} 5`}
              fill
              className="object-cover rounded-br-lg"
              sizes="25vw"
            />
          </div>
        </div>
        
        {/* Show all photos button */}
        {service.images && service.images.length > 0 && (
          <button
            onClick={() => setShowAllImages(true)}
            className="absolute bottom-4 right-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-md 
                     text-white font-medium text-sm shadow-lg 
                     transition-colors flex items-center gap-2 z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Show all photos
          </button>
        )}
      </div>

      {/* Service Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="text-black-600 font-bold">by {service.vendor.name}</span>
            <span className="text-pink-600 font-bold text-2xl">₹{service.price}</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{service.category}</span>
          </div>
          
          <p className="text-gray-700 text-lg mb-8">{service.description}</p>
          
          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl text-black-600 font-bold mb-4">Features & Inclusions</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 mt-1 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
        </div>
        
        {/* Booking Section */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit md:sticky md:top-24">
          <h3 className="text-xl font-semibold mb-4">Book this service</h3>
          {isSignedIn ? (
            <Button className="w-full" variant="default">
              Book Now
            </Button>
          ) : (
            <Link href="/login" className="block">
              <Button className="w-full" variant="default">
                Login to Book
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Reviews and Ratings Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Reviews & Ratings</h2>
        
        {/* Review Form */}
        {isSignedIn ? (
          <div className="w-full bg-gray-50 p-5 rounded-lg">
            <h4 className="text-lg font-semibold mb-3">Write a Review</h4>
            <ReviewForm 
              targetId={urlServiceId} 
              targetType="service" 
            />
          </div>
        ) : (
          <div className="w-full p-5 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-3">Sign in to write a review</p>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        )}

        {/* Review Statistics */}
        {reviews.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:gap-8 w-full">
              {/* Average Rating Display */}
              <div className="text-center mb-6 md:mb-0 md:w-48">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                </div>
                <div className="flex justify-center mb-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
                    return (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(averageRating)
                            ? 'text-pink-500 fill-current'
                            : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    );
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(review => review.rating === rating).length;
                  const percentage = (count / reviews.length) * 100;
                  return (
                    <div key={rating} className="flex items-center gap-2 mb-2">
                      <div className="text-sm text-gray-600 w-16">{rating} stars</div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600 w-16 text-right">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Existing Reviews */}
        <div className="mt-8">
          {reviews.length > 0 && (
            <h4 className="text-lg font-semibold mb-4">Customer Reviews</h4>
          )}
          {loadingReviews ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">No reviews yet. Be the first to review!</div>
          )}
        </div>
      </div>
    </div>
  );
}
