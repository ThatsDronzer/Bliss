'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import ReviewForm from '@/components/review-form';
import { ReviewCard } from '@/components/vendor/Review-Card2';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useRazorpay } from '@/hooks/useRazorpay';

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

interface Address {
  houseNo: string;
  areaName: string;
  landmark: string;
  state: string;
  pin: string;
}

interface BookingFormData {
  address: Address;
  bookingDate: string;
  bookingTime: string;
  specialInstructions: string;
}

interface BookingStatus {
  status: 'idle' | 'pending' | 'accepted' | 'rejected' | 'cancelled';
  requestId?: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const urlServiceId = params.serviceId as string;
  const { isSignedIn, user: currentUser } = useUser();
  const { loading: paymentLoading, initiatePayment } = useRazorpay();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>({ status: 'idle' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [acceptedMessageId, setAcceptedMessageId] = useState<string | null>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  
  const DEFAULT_IMAGE = '/default-service-placeholder.jpg';  
  const DEFAULT_ITEM_IMAGE = '/default-item-placeholder.jpg';

  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    address: {
      houseNo: '',
      areaName: '',
      landmark: '',
      state: '',
      pin: ''
    },
    bookingDate: '',
    bookingTime: '09:00',
    specialInstructions: ''
  });

  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const mainImage = service?.images?.[0] || DEFAULT_IMAGE;
  const sideImages = service?.images?.slice(1) || [];
  const hasMoreImages = service?.images && service.images.length > 5;

  // Enhanced booking status check
  useEffect(() => {
    const checkBookingStatus = async () => {
      if (!isSignedIn || !currentUser || !urlServiceId) {
        setCheckingStatus(false);
        return;
      }

      try {
        const response = await fetch(`/api/booking-status?serviceId=${urlServiceId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.booking) {
            setBookingStatus({
              status: data.booking.status,
              requestId: data.booking._id
            });
            
            // Set payment-related states
            if (data.booking.status === 'accepted') {
              setAcceptedMessageId(data.booking._id);
              setCanMakePayment(data.booking.canMakePayment || false);
            }
          }
        } else {
          const errorData = await response.json();
          console.error('Error fetching booking status:', errorData);
        }
      } catch (error) {
        console.error('Error checking booking status:', error);
        toast.error('Failed to check booking status');
      } finally {
        setCheckingStatus(false);
      }
    };

    checkBookingStatus();
  }, [isSignedIn, currentUser, urlServiceId]);

  useEffect(() => {
    if (service) {
      if (service.items && service.items.length > 0) {
        const initialSelectedItems: SelectedItem[] = service.items.map(item => ({
          ...item,
          isSelected: true
        }));
        setSelectedItems(initialSelectedItems);
        
        const initialTotal = service.items.reduce((sum, item) => sum + item.price, 0);
        setTotalPrice(initialTotal);
      } else {
        setTotalPrice(service.price || 0);
        setSelectedItems([]);
      }
    }
  }, [service]);

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

  const handleItemToggle = (index: number) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].isSelected = !updatedItems[index].isSelected;
    setSelectedItems(updatedItems);
    
    const newTotal = updatedItems.reduce((sum, item) => {
      return item.isSelected ? sum + item.price : sum;
    }, 0);
    setTotalPrice(newTotal);
  };

  const selectAllItems = () => {
    const updatedItems = selectedItems.map(item => ({
      ...item,
      isSelected: true
    }));
    setSelectedItems(updatedItems);
    
    const newTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(newTotal);
  };

  const deselectAllItems = () => {
    const updatedItems = selectedItems.map(item => ({
      ...item,
      isSelected: false
    }));
    setSelectedItems(updatedItems);
    setTotalPrice(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setBookingForm(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setBookingForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTimeChange = (value: string) => {
    setBookingForm(prev => ({
      ...prev,
      bookingTime: value
    }));
  };

  // Enhanced Pay Now handler
  const handlePayNow = async () => {
    if (!acceptedMessageId || !currentUser || !canMakePayment) {
      toast.error('Unable to process payment. Please try again.');
      return;
    }

    try {
      console.log('Initiating payment for message:', acceptedMessageId);
      
      await initiatePayment(
        acceptedMessageId, 
        {
          name: currentUser.fullName || 'Customer',
          email: currentUser.primaryEmailAddress?.emailAddress || '',
          phone: currentUser.primaryPhoneNumber?.phoneNumber || ''
        },
        service?.name
      );
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  const handleServiceRequest = async () => {
    if (!isSignedIn || !currentUser || !service) return;

    setIsSubmitting(true);
    try {
      const selectedItemNames = selectedItems
        .filter(item => item.isSelected)
        .map(item => item.name);

      const requestData = {
        userId: currentUser.id,
        vendorId: service.vendor._id,
        listingId: service._id,
        selectedItems: selectedItemNames,
        totalPrice: totalPrice,
        address: bookingForm.address,
        bookingDate: bookingForm.bookingDate,
        bookingTime: bookingForm.bookingTime,
        specialInstructions: bookingForm.specialInstructions
      };

      console.log('Sending booking request:', requestData);

      const response = await fetch('/api/message-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server response error:', responseData);
        throw new Error(responseData.message || responseData.details || 'Failed to send service request');
      }

      setBookingStatus({
        status: 'pending',
        requestId: responseData.data._id
      });
      setIsDialogOpen(false);
      
      // Reset form
      setBookingForm({
        address: {
          houseNo: '',
          areaName: '',
          landmark: '',
          state: '',
          pin: ''
        },
        bookingDate: '',
        bookingTime: '09:00',
        specialInstructions: ''
      });

      toast.success('Service request sent successfully!', {
        description: 'The vendor will review your request shortly.'
      });

      console.log('Service request sent successfully:', responseData);
    } catch (error) {
      console.error('Error sending service request:', error);
      toast.error('Failed to send service request', {
        description: error instanceof Error ? error.message : 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced booking cancellation
  const handleCancelBooking = async () => {
    if (!bookingStatus.requestId) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/booking-status/${bookingStatus.requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        const result = await response.json();
        setBookingStatus({ status: 'idle' });
        setAcceptedMessageId(null);
        setCanMakePayment(false);
        setIsCancelDialogOpen(false);
        
        toast.success('Booking cancelled successfully', {
          description: 'Your service request has been cancelled.'
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking', {
        description: error instanceof Error ? error.message : 'Please try again later.'
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const isFormValid = () => {
    return (
      bookingForm.address.houseNo &&
      bookingForm.address.areaName &&
      bookingForm.address.landmark &&
      bookingForm.address.state &&
      bookingForm.address.pin &&
      bookingForm.bookingDate &&
      bookingForm.bookingTime
    );
  };

  useEffect(() => {
    if (urlServiceId) {
      fetchReviews();
      
      const handleReviewSubmitted = () => {
        fetchReviews();
      };
      
      window.addEventListener('reviewSubmitted', handleReviewSubmitted);
      
      return () => {
        window.removeEventListener('reviewSubmitted', handleReviewSubmitted);
      };
    }
  }, [urlServiceId]);

  // Enhanced booking button logic
  const getBookingButton = () => {
    if (checkingStatus) {
      return (
        <Button className="w-full bg-gray-500 text-white font-semibold py-3 text-lg" disabled>
          Checking Status...
        </Button>
      );
    }

    switch (bookingStatus.status) {
      case 'pending':
        return (
          <div className="space-y-3">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 text-lg" disabled>
              ⏳ Request Pending
            </Button>
            <p className="text-sm text-yellow-600 text-center">
              Waiting for vendor approval
            </p>
          </div>
        );
      
      case 'accepted':
        return (
          <div className="space-y-3">
            <Button 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 text-lg"
              onClick={handlePayNow}
              disabled={paymentLoading || !canMakePayment}
            >
              {paymentLoading ? 'Processing...' : `Pay Now - ₹${totalPrice}`}
            </Button>
            
            {!canMakePayment && (
              <p className="text-sm text-orange-600 text-center">
                Payment already processed or not available
              </p>
            )}
            
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 text-lg"
                >
                  Cancel Booking
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Booking</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this booking? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex space-x-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsCancelDialogOpen(false)}
                    disabled={isCancelling}
                  >
                    Keep Booking
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancelBooking}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      
      case 'rejected':
      case 'cancelled':
      case 'idle':
      default:
        return (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 text-lg">
                Request Service - ₹{totalPrice}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Request Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Service Summary</h4>
                  <p className="text-sm text-gray-600">{service?.name}</p>
                  <p className="text-lg font-bold text-pink-600">₹{totalPrice}</p>
                  {selectedItems.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Selected Items:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {selectedItems.filter(item => item.isSelected).map((item, index) => (
                          <li key={index}>{item.name} - ₹{item.price}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="houseNo">House No./Building Name *</Label>
                    <Input
                      id="houseNo"
                      name="address.houseNo"
                      value={bookingForm.address.houseNo}
                      onChange={handleInputChange}
                      placeholder="Enter house number or building name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaName">Area Name *</Label>
                    <Input
                      id="areaName"
                      name="address.areaName"
                      value={bookingForm.address.areaName}
                      onChange={handleInputChange}
                      placeholder="Enter area name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark *</Label>
                    <Input
                      id="landmark"
                      name="address.landmark"
                      value={bookingForm.address.landmark}
                      onChange={handleInputChange}
                      placeholder="Enter nearby landmark"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="address.state"
                      value={bookingForm.address.state}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pin">PIN Code *</Label>
                    <Input
                      id="pin"
                      name="address.pin"
                      value={bookingForm.address.pin}
                      onChange={handleInputChange}
                      placeholder="Enter PIN code"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bookingDate">Preferred Date *</Label>
                    <Input
                      id="bookingDate"
                      name="bookingDate"
                      type="date"
                      value={bookingForm.bookingDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bookingTime">Preferred Time *</Label>
                    <Select value={bookingForm.bookingTime} onValueChange={handleTimeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={bookingForm.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special requirements or instructions..."
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Booking Summary</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Date:</strong> {bookingForm.bookingDate || 'Not selected'}</p>
                    <p><strong>Time:</strong> {bookingForm.bookingTime}</p>
                    <p><strong>Total Price:</strong> ₹{totalPrice}</p>
                  </div>
                </div>

                <Button
                  onClick={handleServiceRequest}
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 text-lg"
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Service Request'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        );
    }
  };

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
      
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <span className="text-gray-600 font-medium">
          by {service.vendor?.name || 'Unknown Vendor'}
        </span>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
          {service.category || 'General'}
        </span>
      </div>
      
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
          <p className="text-gray-700 text-lg mb-8">{service.description}</p>
          
          {/* Vendor Profile Card */}
          {service.vendor && (
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl shadow-md border border-pink-100 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About the Vendor
              </h3>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Vendor Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={service.vendor.image || '/placeholder.svg?height=96&width=96&text=Vendor'}
                      alt={service.vendor.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </div>
                
                {/* Vendor Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-2xl font-bold text-gray-900">{service.vendor.name}</h4>
                    {service.vendor && 'verified' in service.vendor && (service.vendor as any).verified && (
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Vendor Stats */}
                  <div className="flex flex-wrap gap-4 mb-3 text-sm">
                    {/* Rating */}
                    {'rating' in service.vendor && (
                      <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold text-gray-900">{(service.vendor as any).rating}</span>
                        <span className="text-gray-600">Rating</span>
                      </div>
                    )}
                    
                    {/* Location */}
                    {'location' in service.vendor && (
                      <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-700">{(service.vendor as any).location}</span>
                      </div>
                    )}
                    
                    {/* Reviews Count */}
                    {'reviewsCount' in service.vendor && (service.vendor as any).reviewsCount > 0 && (
                      <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span className="text-gray-700">{(service.vendor as any).reviewsCount} reviews</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Vendor Description */}
                  {'description' in service.vendor && (service.vendor as any).description && (
                    <p className="text-gray-700 mb-4 line-clamp-2">{(service.vendor as any).description}</p>
                  )}
                  
                  {/* View Profile Button */}
                  <Link href={`/vendors/${service.vendor._id}`}>
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all hover:shadow-lg flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Full Vendor Profile
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* Service Items and Booking Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Service Items Checkboxes */}
            <div className="lg:col-span-2">
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
                          <input
                            type="checkbox"
                            checked={item.isSelected}
                            onChange={() => handleItemToggle(index)}
                            className="mt-1 w-5 h-5 text-pink-500 rounded focus:ring-pink-500 flex-shrink-0"
                          />
                          
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
                  
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedItems.filter(item => item.isSelected).length} of {selectedItems.length} items selected
                  </p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl text-black-600 font-bold">Service Price</h3>
                    <span className="text-2xl font-bold text-pink-600">₹{service.price}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md h-fit lg:sticky lg:top-24">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">Request this service</h3>
                  <span className="text-pink-600 font-bold text-2xl">₹{totalPrice}</span>
                </div>
                
                {isSignedIn ? (
                  getBookingButton()
                ) : (
                  <Link href="/login" className="block">
                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 text-lg">
                      Login to Request
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

                {bookingStatus.status !== 'idle' && (
                  <div className={`mt-4 p-3 rounded-lg text-sm ${
                    bookingStatus.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                    bookingStatus.status === 'accepted' ? 'bg-green-50 text-green-800 border border-green-200' :
                    bookingStatus.status === 'cancelled' ? 'bg-gray-50 text-gray-800 border border-gray-200' :
                    'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {bookingStatus.status === 'pending' && 'Your request has been sent and is pending approval.'}
                    {bookingStatus.status === 'accepted' && 'Your service request has been accepted! You can now proceed with payment.'}
                    {bookingStatus.status === 'rejected' && 'Your service request has been declined.'}
                    {bookingStatus.status === 'cancelled' && 'Your booking has been cancelled.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Features Section */}
          {service.features && service.features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl text-black-600 font-bold mb-4">What's Included</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
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
            </div>
          )}
        </div>
      </div>

       {/* Reviews and Ratings Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Reviews & Ratings</h2>
        
        {/* Review Form */}
        {isSignedIn ? (
          <div className="w-full bg-gray-50 p-5 rounded-lg mb-8">
            <h4 className="text-lg font-semibold mb-3">Write a Review</h4>
            <ReviewForm 
              targetId={urlServiceId} 
              targetType="service" 
            />
          </div>
        ) : (
          <div className="w-full p-5 bg-gray-50 rounded-lg text-center mb-8">
            <p className="text-gray-600 mb-3">Sign in to write a review</p>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        )}

        {/* Review Statistics */}
        {reviews.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
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