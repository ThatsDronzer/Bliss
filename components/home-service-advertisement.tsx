'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Star, Shield, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HomeServiceAdvertisement() {
  return (
    <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm">
              <Home className="w-4 h-4" />
              <span>New Service Launch</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Introducing Home Services for Your
              <span className="text-pink-600"> Special Events</span>
            </h2>
            
            <p className="text-lg text-gray-600">
              Transform your home into the perfect celebration venue. Professional services for birthdays, anniversaries, and all your special moments.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Premium Quality</h3>
                  <p className="text-sm text-gray-600">Verified professionals for top-notch service</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Safe & Secure</h3>
                  <p className="text-sm text-gray-600">Fully insured and vetted service providers</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Flexible Timing</h3>
                  <p className="text-sm text-gray-600">Services at your preferred schedule</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Customizable</h3>
                  <p className="text-sm text-gray-600">Packages tailored to your needs</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/home-service">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
                  Explore Home Services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/home-service-preview.jpg"
                alt="Home Services"
                fill
                className="object-cover"
                priority
              />
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6">
                <Card className="w-48 bg-white/95 backdrop-blur-sm p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">4.9/5 Rating</span>
                  </div>
                  <p className="text-sm text-gray-600">From 1,000+ happy customers</p>
                </Card>
              </div>
              <div className="absolute -top-6 -right-6">
                <Card className="w-48 bg-white/95 backdrop-blur-sm p-4 shadow-lg">
                  <div className="font-semibold mb-1">Starting from</div>
                  <div className="text-2xl font-bold text-pink-600">₹999</div>
                  <p className="text-sm text-gray-600">All-inclusive packages</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 