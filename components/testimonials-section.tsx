"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { testimonials } from "@/lib/data"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience with
            Blissmet.
          </p>
        </div>
        <div className="relative overflow-x-hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              containScroll: 'trimSnaps',
            }}
            className="w-full"
          >
            <CarouselPrevious className="z-20 left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="z-20 right-2 top-1/2 -translate-y-1/2" />
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="sm:basis-1/2 lg:basis-1/3 flex-shrink-0 flex-grow-0"
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                      <div className="flex items-center gap-3">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">{testimonial.event}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
