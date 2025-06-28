import { EnhancedSearchBar } from "@/components/enhanced-search-bar"
import { FeaturedVendors } from "@/components/featured-vendors"
import { TestimonialsSection } from "@/components/testimonials-section"
import { TrustSection } from "@/components/trust-section"
import { ServicesSection } from "@/components/services-section"
import { HomeServiceAdvertisement } from "@/components/home-service-advertisement"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Gift, Cake, Music, Camera, Utensils, MapPin } from "lucide-react"
import Image from "next/image"
import { Star } from "lucide-react"
import { NewsletterSection } from "@/components/newsletter-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/guest_party.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find the
              <span className="text-white">   </span>
              <span className="text-pink-500">
                Best Vendors
              </span>
              <span className="block text-white">
                for Your All Events
              </span> 
             
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Find top vendors for venues, catering, decor & more — make every moment unforgettable.
            </p>

            {/* Search Bar Container */}
            <div className="w-full max-w-4xl mx-auto relative">
              <div className="absolute inset-0 bg-pink-500/20 blur-xl"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-full shadow-xl p-1">
                <EnhancedSearchBar />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="relative mb-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl p-8">
            {/* <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Categories</h2> */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <Link 
                href="/vendors?category=venues" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-pink-50 transition-colors"
              >
                <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-pink-200 transition-colors">
                  <MapPin className="w-8 h-8 text-pink-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Wedding Venues</span>
                <span className="text-xs text-gray-500 mt-1">200+ Options</span>
              </Link>

              <Link 
                href="/vendors?category=anniversary" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-purple-50 transition-colors"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <Gift className="w-8 h-8 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Anniversary</span>
                <span className="text-xs text-gray-500 mt-1">150+ Options</span>
              </Link>

              <Link 
                href="/vendors?category=birthday" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                  <Cake className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Birthday</span>
                <span className="text-xs text-gray-500 mt-1">180+ Options</span>
              </Link>

              <Link 
                href="/vendors?category=music" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                  <Music className="w-8 h-8 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Music & DJ</span>
                <span className="text-xs text-gray-500 mt-1">120+ Options</span>
              </Link>

              <Link 
                href="/vendors?category=photography" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <div className="w-16 h-16 bg-rose-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-rose-200 transition-colors">
                  <Camera className="w-8 h-8 text-rose-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Photography</span>
                <span className="text-xs text-gray-500 mt-1">250+ Options</span>
              </Link>

              <Link 
                href="/vendors?category=catering" 
                className="group flex flex-col items-center p-4 rounded-xl hover:bg-amber-50 transition-colors"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-200 transition-colors">
                  <Utensils className="w-8 h-8 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Catering</span>
                <span className="text-xs text-gray-500 mt-1">160+ Options</span>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <Link href="/vendors">
                <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50">
                  View All Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service-Based Exploration Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Find Vendors by Specific Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Search for specific services like "wedding photography" or "catering" and discover vendors who offer exactly what you need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Photography & Videography</h3>
              <p className="text-gray-600 mb-4">Find professional photographers and videographers for your special moments</p>
              <Link href="/explore-services?service=photography">
                <Button variant="outline" className="w-full text-pink-600 border-pink-200 hover:bg-pink-50">
                  Explore Photography
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Catering Services</h3>
              <p className="text-gray-600 mb-4">Discover caterers offering various cuisines and dining experiences</p>
              <Link href="/explore-services?service=catering">
                <Button variant="outline" className="w-full text-purple-600 border-purple-200 hover:bg-purple-50">
                  Explore Catering
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Decoration & Florist</h3>
              <p className="text-gray-600 mb-4">Transform your venue with beautiful decorations and floral arrangements</p>
              <Link href="/explore-services?service=decoration">
                <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                  Explore Decoration
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Music & Entertainment</h3>
              <p className="text-gray-600 mb-4">Find DJs, live bands, and entertainment for your events</p>
              <Link href="/explore-services?service=music">
                <Button variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50">
                  Explore Entertainment
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wedding Venues</h3>
              <p className="text-gray-600 mb-4">Discover perfect venues for your wedding and special events</p>
              <Link href="/explore-services?service=venue">
                <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50">
                  Explore Venues
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Cake className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Beauty & Makeup</h3>
              <p className="text-gray-600 mb-4">Find professional makeup artists and beauty services</p>
              <Link href="/explore-services?service=makeup">
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  Explore Beauty
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link href="/explore-services">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl">
                Explore All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Featured Vendors</h2>
            <Link href="/vendors" passHref>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 py-3">View All</Button>
            </Link>
          </div>
          <FeaturedVendors />
        </div>
      </section>

      {/* Home Services Advertisement */}
      <HomeServiceAdvertisement />

      {/* Trust Section */}
      <TrustSection />

      {/* Services We Offer */}
      <ServicesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* CTA Section */}
      <section className="py-20 bg-pink-600 text-white relative">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Ready to Create Unforgettable Events?</h2>
          <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Join thousands of satisfied customers who have found the perfect vendors for their special occasions
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-pink-600 hover:bg-pink-50 font-semibold px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book a Vendor Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-pink-600 font-semibold px-10 py-4 rounded-2xl transition-all duration-300"
            >
              Become a Vendor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}