"use client";

import { useParams } from "next/navigation";
import { eventTypes, eventThemes } from "@/lib/data/event-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Star, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventThemesPage() {
  const params = useParams();
  const eventTypeSlug = params.eventType as string;
  
  const eventType = eventTypes.find(et => et.slug === eventTypeSlug);
  const themes = eventThemes.filter(theme => 
    eventType && theme.eventTypeId === eventType.id
  );

  if (!eventType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Event type not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/home-service/events">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Events
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-5xl">{eventType.icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold">
              {eventType.name}
            </h1>
          </div>
          <p className="text-lg text-white/90 max-w-2xl">
            {eventType.description}
          </p>
        </div>
      </section>

      {/* Themes Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">All Experiences</h2>
          <p className="text-gray-600">{themes.length} decoration themes available</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {themes.map((theme) => (
            <Link 
              key={theme.id} 
              href={`/home-service/experience/${theme.id}/${theme.location.toLowerCase().replace(/\s+/g, '-')}/${theme.slug}`}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden h-full">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={theme.images[0]}
                    alt={theme.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {theme.tags && theme.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex gap-2">
                      {theme.tags.map((tag) => (
                        <Badge key={tag} className="bg-pink-600 hover:bg-pink-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{theme.location}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {theme.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{theme.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({theme.reviewCount} Reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {theme.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{theme.originalPrice}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-pink-600">
                      ₹{theme.price}
                    </span>
                    <span className="text-gray-600 text-sm">/ decoration</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {themes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No themes available for this event type yet. Check back soon!
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
