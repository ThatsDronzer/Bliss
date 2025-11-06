'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Calendar, Clock, Star, BarChart, Users, BookMarked } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function VendorDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, adminVendors } = useAuth();
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/");
      return;
    }

    const foundVendor = adminVendors.find((v) => v.id === params.id);
    if (foundVendor) {
      setVendor(foundVendor);
    }
  }, [isAuthenticated, isAdmin, adminVendors, params.id, router]);

  if (!isAuthenticated || !isAdmin || !vendor) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Vendor Details</h1>
      </div>

      {/* Vendor Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative w-32 h-32">
              <Image
                src={vendor.avatar || "/placeholder.svg"}
                alt={vendor.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{vendor.name}</h2>
                  <p className="text-gray-500">{vendor.category}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                    vendor.status
                  )}`}
                >
                  {vendor.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="h-4 w-4" />
                  <Link href={`https://${vendor.website}`} target="_blank" className="hover:text-pink-600">
                    {vendor.website}
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{vendor.location}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.bookingsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.totalRevenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendor.rating} ({vendor.reviewsCount} reviews)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.joinDate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="about">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{vendor.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Established</p>
                      <p className="font-medium">{vendor.established}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="font-medium">{new Date(vendor.lastLogin).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Available Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mock services - replace with actual data */}
                  {[1, 2, 3].map((service) => (
                    <Card key={service}>
                      <CardContent className="p-4">
                        <h4 className="font-medium">Service Package {service}</h4>
                        <p className="text-sm text-gray-500 mt-1">Description of the service package</p>
                        <p className="text-pink-600 font-medium mt-2">₹XX,XXX</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  {/* Mock reviews - replace with actual data */}
                  {[1, 2, 3].map((review) => (
                    <Card key={review}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium">5.0</span>
                        </div>
                        <p className="text-gray-600">Great service! Very professional and punctual.</p>
                        <p className="text-sm text-gray-500 mt-2">- Customer Name</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Recent Bookings</h3>
                <div className="space-y-4">
                  {/* Mock bookings - replace with actual data */}
                  {[1, 2, 3].map((booking) => (
                    <Card key={booking}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Booking #{booking}</h4>
                            <p className="text-sm text-gray-500">Customer Name</p>
                            <p className="text-sm text-gray-500">Event Date: XX/XX/XXXX</p>
                          </div>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
          Deactivate Vendor
        </Button>
        <Button>Contact Vendor</Button>
      </div>
    </div>
  );
} 