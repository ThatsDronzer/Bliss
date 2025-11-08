"use client";

import { eventTypes } from "@/lib/data/event-types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { ArrowRight } from "lucide-react";

export default function EventTypesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            All Experiences
          </h1>
          <p className="text-center text-lg text-white/90 max-w-2xl mx-auto">
            Choose from our curated collection of event decorations and experiences
          </p>
        </div>
      </section>

      {/* Event Types Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {eventTypes.map((eventType) => (
            <Link 
              key={eventType.id} 
              href={`/home-service/events/${eventType.slug}`}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={eventType.image}
                    alt={eventType.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-4xl mb-2">{eventType.icon}</div>
                    <h3 className="text-white text-xl font-bold">{eventType.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {eventType.description}
                  </p>
                  <div className="mt-3 flex items-center text-pink-600 text-sm font-medium">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
