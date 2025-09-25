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

interface ServiceItem {
  _id?: string;
  name: string;
  description: string;
  image: {
    url: string;
    public_id: string;
  };
  price: number;
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
  items?: ServiceItem[];
}

interface SelectedItem extends ServiceItem {
  isSelected: boolean;
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
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Default image constant
  const DEFAULT_IMAGE = '/default-service-placeholder.jpg';  
  const DEFAULT_ITEM_IMAGE = '/default-item-placeholder.jpg';

  // Derived state
  const mainImage = service?.images?.[0] || DEFAULT_IMAGE;
  const sideImages = service?.images?.slice(1) || [];
  const hasMoreImages = service?.images && service.images.length > 5;

  // Initialize selected items when service data loads
  useEffect(() => {
    if (service) {
      if (service.items && service.items.length > 0) {
        const initialSelectedItems: SelectedItem[] = service.items.map(item => ({
          ...item,
          isSelected: true
        }));
        setSelectedItems(initialSelectedItems);
        
        // Calculate initial total price
        const initialTotal = service.items.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(initialTotal);
      } else {
        // If no items, use base price
        setTotalPrice(service.price || 0);
        setSelectedItems([]);
      }
    }
  }, [service]);

  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!urlServiceId) {
          throw new Error('Service ID is required');
        }

        const response = await fetch(`/api/services/${urlServiceId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch service details');
        }
        
        const data = await response.json();
        console.log('Service data:', data);
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

  // Handle checkbox changes
  const handleItemToggle = (index: number) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].isSelected = !updatedItems[index].isSelected;
    setSelectedItems(updatedItems);
    
    // Calculate new total price
    const newTotal = updatedItems.reduce((sum, item) => {
      return item.isSelected ? sum + item.price : sum;
    }, 0);
    setTotalPrice(newTotal);
  };

  // Select all items
  const selectAllItems = () => {
    const updatedItems = selectedItems.map(item => ({
      ...item,
      isSelected: true
    }));
    setSelectedItems(updatedItems);
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(newTotal);
  };

  // Deselect all items
  const deselectAllItems = () => {
    const updatedItems = selectedItems.map(item => ({
      ...item,
      isSelected: false
    }));
    setSelectedItems(updatedItems);
    setTotalPrice(0);
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
          <Link href="/services">
            <Button className="mt-4">Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
          <Link href="/services">
            <Button className="mt-4">Browse Services</Button>
          </Link>
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
      <div className="grid grid-cols-1 gap-8">
        <div>
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="text-black-600 font-bold">
              by {service.vendor?.name || 'Unknown Vendor'}
            </span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {service.category || 'General'}
            </span>
          </div>
          
          <p className="text-gray-700 text-lg mb-8">{service.description}</p>
          
          {/* Service Items and Booking Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Service Items Checkboxes - Takes 2/3 width on large screens */}
            <div className="lg:col-span-2">
              {/* Service Items Checkboxes - Only show if items exist */}
              {selectedItems.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl text-black-600 font-bold">Service Items</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={selectAllItems}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        onClick={deselectAllItems}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedItems.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4 w-full">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={item.isSelected}
                            onChange={() => handleItemToggle(index)}
                            className="mt-1 w-5 h-5 text-pink-500 rounded focus:ring-pink-500 flex-shrink-0"
                          />
                          
                          {/* Item Image */}
                          <div className="flex-shrink-0">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                              <Image
                                src={item.image?.url || DEFAULT_ITEM_IMAGE}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                          </div>
                          
                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                              </div>
                              <span className="text-pink-600 font-bold text-xl whitespace-nowrap ml-4">
                                ₹{item.price}
                              </span>
                            </div>
                            
                            {/* Selection Indicator */}
                            <div className={`flex items-center gap-2 mt-2 ${item.isSelected ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-2 h-2 rounded-full ${item.isSelected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className="text-xs font-medium">
                                {item.isSelected ? 'Included' : 'Not included'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 text-lg">Total Price:</span>
                      <span className="text-3xl font-bold text-pink-600">₹{totalPrice}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedItems.filter(item => item.isSelected).length} of {selectedItems.length} items selected
                    </p>
                  </div>
                </div>
              ) : (
                // Show base price if no items are available
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl text-black-600 font-bold">Service Price</h3>
                    <span className="text-2xl font-bold text-pink-600">₹{service.price}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Section - Takes 1/3 width on large screens, positioned right next to items */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-fit lg:sticky lg:top-24">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">Book this service</h3>
                  <span className="text-pink-600 font-bold text-2xl">₹{totalPrice}</span>
                </div>
                {isSignedIn ? (
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 text-lg">
                    Book Now
                  </Button>
                ) : (
                  <Link href="/login" className="block">
                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 text-lg">
                      Login to Book
                    </Button>
                  </Link>
                )}
                {selectedItems.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Price updates based on selected items</p>
                    <p className="text-xs mt-1">
                      Selected: {selectedItems.filter(item => item.isSelected).length}/{selectedItems.length} items
                    </p>
                  </div>
                )}
                <div className="mt-4 text-xs text-gray-500">
                  <p>✓ Secure booking</p>
                  <p>✓ Instant confirmation</p>
                  <p>✓ Best price guarantee</p>
                </div>
              </div>
            </div>
          </div>
          
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