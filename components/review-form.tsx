'use client';

import { useState } from 'react';
import { useUser, useSession } from '@clerk/nextjs';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

export default function ReviewForm({
  targetId,
  targetType,
}: {
  targetId: string;
  targetType: 'service' | 'vendor';
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isLoaded: userLoaded } = useUser();
  const { session } = useSession();

  if (!targetId || !targetType) {
    console.error('ReviewForm: Missing required props', { targetId, targetType });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Early validation of user session
    if (!user || !session) {
      alert('You must be logged in to submit a review.');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    // Log user data for debugging
    console.log('User data:', {
      isLoaded: !!user,
      hasFullName: !!user.fullName,
      hasImageUrl: !!user.imageUrl
    });

    setLoading(true);
    
    // Get user details with fallbacks
    const name = user.fullName || user.firstName || user.username || 'Anonymous';
    const avatar = user.imageUrl || '/placeholder-user.jpg';
    
    // Log submission data
    console.log('Submission data:', {
      targetId,
      targetType,
      rating,
      commentLength: comment.length,
      name,
      hasAvatar: !!avatar
    });

    try {
      // Get the session token
      const token = await session?.getToken();
      
      // Validate all required fields are present
      if (!targetId || !targetType || !rating || !comment || !name) {
        console.error('Missing fields:', {
          targetId,
          targetType,
          rating,
          comment,
          name,
          avatar
        });
        alert('Please fill in all required fields');
        return;
      }
      
      const requestBody = {
        targetId,
        targetType,
        rating,
        comment,
        name,
        avatar: avatar || '/placeholder-user.jpg', // Provide default avatar
      };
      
      console.log('Submitting review with data:', requestBody);
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      if (response.ok) {
        setComment('');
        setRating(5);
        // Trigger a fetch to update reviews
        const event = new CustomEvent('reviewSubmitted');
        window.dispatchEvent(event);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6"
    >
      <div className="space-y-4">
        <label className="block font-semibold text-lg text-gray-900">Your Rating</label>
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setRating(num)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold
                ${rating === num ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-pink-600 border-pink-300'}
                hover:bg-pink-100 transition-all duration-200 transform hover:scale-105`}
                aria-label={`Rate ${num}`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            {['😡', '😞', '😐', '🙂', '🤩'].map((emoji, idx) => (
              <span
                key={emoji}
                className={`w-12 h-12 flex items-center justify-center text-2xl transition-all duration-200
                ${rating === idx + 1 ? 'scale-125' : 'opacity-60 hover:opacity-80'}`}
                aria-label={`Emoji for rating ${idx + 1}`}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block font-semibold text-lg text-gray-900">Your Review</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full min-h-[120px] p-4 text-base resize-y border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          placeholder="Share your experience with this service..."
          required
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full md:w-auto px-8 py-2 bg-pink-600 text-white hover:bg-pink-700 transition-colors"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          'Submit Review'
        )}
      </Button>
    </form>
  );
}
