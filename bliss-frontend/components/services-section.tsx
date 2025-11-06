"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Camera, Utensils, Palette, Music, Home } from "lucide-react"
import Link from "next/link"

export function ServicesSection() {
  const services = [
    {
      icon: Building,
      title: "Venue Booking",
      description:
        "Find and book the perfect venue for your event from our extensive collection of banquet halls, hotels, and outdoor spaces.",
      features: ["Banquet Halls", "Hotels", "Outdoor Venues", "Community Centers"],
      link: "/vendors?category=Venue",
    },
    {
      icon: Camera,
      title: "Photography & Videography",
      description:
        "Capture your precious moments with professional photographers and videographers who specialize in event coverage.",
      features: ["Event Photography", "Videography", "Pre-event Shoots", "Drone Coverage"],
      link: "/vendors?category=Photography",
    },
    {
      icon: Utensils,
      title: "Catering Services",
      description:
        "Delight your guests with delicious food from our network of experienced caterers offering diverse cuisines.",
      features: ["Multi-cuisine", "Live Counters", "Dessert Stations", "Custom Menus"],
      link: "/vendors?category=Catering",
    },
    {
      icon: Palette,
      title: "Decoration & Design",
      description:
        "Transform your venue with stunning decorations and themes that match your vision and style preferences.",
      features: ["Theme Decoration", "Floral Arrangements", "Lighting", "Stage Setup"],
      link: "/vendors?category=Decoration",
    },
    {
      icon: Music,
      title: "Entertainment",
      description:
        "Keep your guests entertained with professional DJs, live bands, and performers for all types of events.",
      features: ["DJ Services", "Live Bands", "Performers", "Sound Systems"],
      link: "/vendors?category=DJ",
    },
    {
      icon: Home,
      title: "Home Services",
      description:
        "Bring the celebration to your home with our specialized home event services and intimate gathering packages.",
      features: ["Home Decoration", "Small Gatherings", "Intimate Parties", "Custom Packages"],
      link: "/home-service",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Services We Offer</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From planning to execution, we provide comprehensive event management services to make your celebration
            perfect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={service.link}>
                  <Button variant="outline" className="w-full">
                    Explore {service.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
