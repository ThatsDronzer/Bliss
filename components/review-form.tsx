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
  const { user } = useUser();
  const { session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert('You must be logged in to submit a review.');
      return;
    }

    const name = user.fullName || 'Anonymous';
    const avatar = user.imageUrl || '';

    try {
      // Get the session token
      const token = await session?.getToken();
      
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetId,
          targetType,
          rating,
          comment,
          name,
          avatar,
        }),
      });

      if (response.ok) {
        setComment('');
        setRating(5);
        window.location.reload();
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
      className="p-4 border rounded-xl bg-background mt-8"
    >
      <label className="block mb-2 font-bold text-lg">Your Rating</label>
      <div className="flex flex-col items-center mb-4">
        <div className="flex gap-2 mb-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              type="button"
              key={num}
              onClick={() => setRating(num)}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold
              ${rating === num ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-pink-600 border-pink-300'}
              hover:bg-pink-100 transition`}
              aria-label={`Rate ${num}`}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['😡', '😞', '😐', '🙂', '🤩'].map((emoji, idx) => (
            <span
              key={emoji}
              className={`w-10 h-10 flex items-center justify-center text-2xl transition
              ${rating === idx + 1 ? 'scale-125' : 'opacity-60'}`}
              aria-label={`Emoji for rating ${idx + 1}`}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
      <label className="block mb-2 font-bold text-lg">Your Review</label>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-4"
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
