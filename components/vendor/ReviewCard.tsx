import { Review } from '@/lib/types/vendor';
import { Card, CardContent } from '@/components/ui/card';
import { Star, StarHalf } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    return stars;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{review.name}</h4>
            <div className="flex items-center space-x-1 mt-1">
              {renderStars(review.rating)}
            </div>
          </div>
          <time className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</time>
        </div>
        <p className="mt-3 text-gray-600">{review.comment}</p>
      </CardContent>
    </Card>
  );
} 