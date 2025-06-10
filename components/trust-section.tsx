"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, CreditCard, Headphones, CheckCircle } from "lucide-react"

export function TrustSection() {
  const trustFeatures = [
    {
      icon: Shield,
      title: "Verified Vendors",
      description: "All vendors are background-checked and verified for your safety and peace of mind.",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Your payments are protected with bank-level security and encrypted transactions.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our customer support team is available round the clock to assist you.",
    },
    {
      icon: CheckCircle,
      title: "Quality Guarantee",
      description: "We guarantee the quality of services or your money back, no questions asked.",
    },
  ]

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Thousands Trust Blissmet</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your trust is our priority. Here's how we ensure a safe and reliable experience for all our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
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
