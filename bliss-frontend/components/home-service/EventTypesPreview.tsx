"use client";

import { eventTypes } from "@/lib/data/event-types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EventTypesPreview() {
  // Show first 8 event types
  const previewEvents = eventTypes.slice(0, 8);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
      {previewEvents.map((eventType) => (
        <Link 
          key={eventType.id} 
          href={`/home-service/events/${eventType.slug}`}
        >
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden h-full">
            <div className="relative h-40 md:h-48 overflow-hidden">
              <Image
                src={eventType.image}
                alt={eventType.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-3xl mb-1">{eventType.icon}</div>
                <h3 className="text-white text-base md:text-lg font-bold line-clamp-1">
                  {eventType.name}
                </h3>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-2">
                {eventType.description}
              </p>
              <div className="flex items-center text-pink-600 text-xs md:text-sm font-medium">
                Explore <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
