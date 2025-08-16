'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { mockVendorData } from '@/lib/types/vendor';
import { useUser, useSession } from '@clerk/nextjs';
import ReviewForm from '@/components/review-form';
import { ReviewCard } from '@/components/vendor/Review-Card2';

export default function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = React.use(params);
  const service = mockVendorData.services.find(s => s.id === Number(serviceId));

  if (!service) {
    return <div className="max-w-2xl mx-auto py-10 px-4 text-center text-red-500">Service not found.</div>;
  }

  const images = mockVendorData.gallery;
  const [showAllImages, setShowAllImages] = useState(false);
  const imagesToShow = showAllImages ? images : images.slice(0, 6);
  const mainImage = images[0];
  const sideImages = images.slice(1, 5);
  const hasMoreImages = images.length > 5;

  const { user } = useUser();

  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setLoadingReviews(true);
      try {
        const res = await fetch(`/api/review?targetType=service&targetId=${serviceId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await res.json();
        setReviews(
          (data.reviews || []).map((review: any) => ({
            ...review,
            date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : undefined,
          }))
        );
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchReviews();
  }, [serviceId, user]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Info Section */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900">{service.name}</h1>
        
        {/* Service Rating Summary */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(
                        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                      )
                        ? 'text-pink-500 fill-current'
                        : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
              </span>
              <span className="text-gray-600">({reviews.length} reviews)</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 grid-rows-2 gap-3 rounded-2xl overflow-hidden mb-8 shadow-lg bg-white">
        <div className="col-span-2 row-span-2 relative">
          <img src={mainImage} alt="Main service" className="w-full h-full object-cover min-h-[320px] max-h-[420px]" />
        </div>
        {sideImages.map((img, idx) => (
          <div key={idx} className="relative">
            <img src={img} alt={`Service image ${idx + 2}`} className="w-full h-full object-cover min-h-[100px] max-h-[200px]" />
            {hasMoreImages && idx === sideImages.length - 1 && !showAllImages && (
              <button
                className="absolute right-3 bottom-3 bg-pink-600 text-white text-base font-semibold rounded-full px-5 py-2 shadow-lg transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                style={{ zIndex: 2 }}
                onClick={() => setShowAllImages(true)}
              >
                Show all photos
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Description and Booking */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-2">
            <span className="font-bold text-small text-gray-500">by {mockVendorData.name}</span>
            <span className="text-pink-600 font-bold text-xl">₹{service.price}</span>
            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-sm font-semibold">{mockVendorData.category}</span>
          </div>
          <p className="text-gray-700 text-lg mb-2 font-bold">{service.description}</p>
        </div>
        <div className="w-full md:w-80">
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 flex flex-col gap-8">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Book This Service</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">{service.name}</span>
                <span className="text-pink-600 font-bold text-lg">₹{service.price}</span>
              </div>
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg mt-4">Book Now</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customizations */}
      {service.customizations && service.customizations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Customizations</h2>
          <div className="bg-white rounded-xl shadow p-4">
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              {service.customizations.map((c) => (
                <li key={c.id}>
                  <span className="font-bold text-lg">{c.name}</span>: {c.description} (+₹{c.price})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {user ? (
          <ReviewForm targetId={service.id.toString()} targetType="service" />
        ) : (
          <p className="text-center text-gray-500 py-8">Sign in to leave a review.</p>
        )}
        <h2 className="text-2xl font-semibold mb-4 mt-8"> Existing Reviews</h2>
        
        {/* Average Rating Display */}
        {reviews.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                                      <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.round(
                        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                      )
                        ? 'text-pink-500 fill-current'
                        : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  ))}
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                  <span className="text-gray-600 ml-2">out of 5</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </div>
                <div className="text-sm text-gray-500">
                  {reviews.filter(r => r.rating === 5).length} five-star reviews
                </div>
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-4">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pink-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="mt-8">
          {loadingReviews ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
             
              
              {reviews.map((review: any, index: number) => (
                <div 
                  key={review._id || review.id} 
                  className={`${index % 2 === 0 ? 'lg:pr-6' : 'lg:pl-6'}`}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet for this service.</p>
          )}
        </div>
      </div>
    </div>
  );
}
