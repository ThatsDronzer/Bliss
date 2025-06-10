import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceholderImage } from './PlaceholderImage';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full">
      <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
        <PlaceholderImage
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
          onClick={previousImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
} 