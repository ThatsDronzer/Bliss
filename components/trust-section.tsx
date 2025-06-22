"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, CreditCard, Headphones, CheckCircle } from "lucide-react"

export function TrustSection() {
  const trustFeatures = [
    {
      icon: Shield,
      title: "Trusted & Verified",
      description: "Every vendor on our platform undergoes rigorous verification and quality checks.",
    },
    {
      icon: CreditCard,
      title: "Secure Transactions",
      description: "Bank-grade security ensures your payments and data are always protected.",
    },
    {
      icon: Headphones,
      title: "Expert Support",
      description: "Our dedicated team of event specialists is here to assist you 24/7.",
    },
    {
      icon: CheckCircle,
      title: "Satisfaction Guaranteed",
      description: "We stand behind our service quality with a 100% satisfaction guarantee.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">India's Most Trusted Event Platform</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us to make their special moments unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFeatures.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Trusted by 10,000+ customers across India</span>
          </div>
        </div>
      </div>
    </section>
  )
}
