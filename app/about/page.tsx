import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Target, Heart, Award, MapPin, Calendar, Star, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  const stats = [
    { label: "Happy Customers", value: "50,000+", icon: Users },
    { label: "Verified Vendors", value: "5,000+", icon: Award },
    { label: "Events Completed", value: "25,000+", icon: Calendar },
    { label: "Cities Covered", value: "100+", icon: MapPin },
  ]

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make is centered around creating the best experience for our customers.",
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description:
        "We rigorously vet all vendors to ensure they meet our high standards of service and professionalism.",
    },
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously evolve our platform with cutting-edge technology to simplify event planning.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in building strong relationships between customers, vendors, and our team.",
    },
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Former event planner with 15+ years of experience in the industry.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Tech entrepreneur passionate about creating seamless digital experiences.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Operations expert ensuring smooth vendor partnerships and customer satisfaction.",
    },
    {
      name: "David Kim",
      role: "Head of Marketing",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Marketing strategist focused on connecting the right customers with perfect vendors.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-pink-100 text-pink-700 hover:bg-pink-200">About Blissmet</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Making Every Event
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                {" "}
                Unforgettable
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're on a mission to transform how people plan and execute their special moments by connecting them with
              the perfect vendors and services, all in one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
                <Link href="/vendors" className="flex items-center">
                  Explore Vendors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-pink-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-xl text-gray-600">Born from the frustration of planning events the hard way</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">The Problem We Solved</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Planning an event used to mean endless phone calls, scattered vendor information, and the constant
                  worry of whether you're making the right choices. We experienced this firsthand and knew there had to
                  be a better way.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  In 2020, we set out to create a platform that would bring transparency, convenience, and trust to the
                  event planning industry. Today, Blissmet is the go-to platform for thousands of customers and vendors
                  across the country.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center"
                      >
                        <Star className="h-4 w-4 text-pink-600 fill-current" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold">4.9/5 Customer Rating</div>
                    <div>Based on 10,000+ reviews</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Team working together"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-pink-600">2020</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-200 transition-colors">
                      <value.icon className="h-8 w-8 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
              <p className="text-xl text-gray-600">The passionate people behind Blissmet</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-pink-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Plan Your Perfect Event?</h2>
            <p className="text-xl text-pink-100 mb-8 leading-relaxed">
              Join thousands of satisfied customers who trust Blissmet for their special moments. Start exploring our
              verified vendors today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                <Link href="/vendors" className="flex items-center">
                  Browse Vendors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-pink-600">
                <Link href="/become-vendor">Become a Vendor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
