"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Clock, Shield } from "lucide-react"

export function AboutSection() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "10,000+" },
    { icon: Award, label: "Verified Vendors", value: "2,500+" },
    { icon: Clock, label: "Events Completed", value: "15,000+" },
    { icon: Shield, label: "Cities Covered", value: "50+" },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">About Blissmet</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Blissmet is India's leading event management platform that connects you with the best vendors for all your
            celebration needs. From intimate gatherings to grand celebrations, we make event planning effortless and
            enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Why Choose Blissmet?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <strong>Verified Vendors:</strong> All our vendors are thoroughly vetted and verified for quality and
                  reliability.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <strong>Best Prices:</strong> Compare prices from multiple vendors and get the best deals for your
                  budget.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <strong>24/7 Support:</strong> Our dedicated support team is always ready to help you plan the perfect
                  event.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <strong>Quick Booking:</strong> Book vendors instantly with our streamlined booking process.
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg">
            <h4 className="text-xl font-bold mb-4">Our Mission</h4>
            <p className="text-gray-600 mb-4">
              To make event planning accessible, affordable, and stress-free for everyone. We believe that every
              celebration deserves to be perfect, regardless of size or budget.
            </p>
            <p className="text-gray-600">
              Join thousands of satisfied customers who have trusted Blissmet to make their special moments
              unforgettable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
