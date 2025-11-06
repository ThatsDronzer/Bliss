'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Phone, Calendar, Clock, Star, BookMarked, CreditCard, MapPin, User } from "lucide-react";
import Image from "next/image";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, adminUsers } = useAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/");
      return;
    }

    const foundUser = adminUsers.find((u) => u.id === params.id);
    if (foundUser) {
      setUser(foundUser);
    }
  }, [isAuthenticated, isAdmin, adminUsers, params.id, router]);

  if (!isAuthenticated || !isAdmin || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
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
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative w-32 h-32">
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-500">User ID: {user.id}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Wedding Date: {user.weddingDate || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location || 'Location not specified'}</span>
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
            <div className="text-2xl font-bold">{user.bookingsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{user.totalSpent || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.reviewsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.joinDate}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="bookings">
            <TabsList>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Booking History</h3>
                <div className="space-y-4">
                  {/* Mock bookings - replace with actual data */}
                  {[1, 2, 3].map((booking) => (
                    <Card key={booking}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Booking #{booking}</h4>
                            <p className="text-sm text-gray-500">Vendor Name</p>
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

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Reviews Given</h3>
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
                        <p className="text-sm text-gray-500 mt-2">- For: Vendor Name</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Payment History</h3>
                <div className="space-y-4">
                  {/* Mock payments - replace with actual data */}
                  {[1, 2, 3].map((payment) => (
                    <Card key={payment}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Payment #{payment}</h4>
                            <p className="text-sm text-gray-500">To: Vendor Name</p>
                            <p className="text-sm text-gray-500">Date: XX/XX/XXXX</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-pink-600">₹XX,XXX</p>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {/* Mock activity - replace with actual data */}
                  {[1, 2, 3].map((activity) => (
                    <Card key={activity}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-gray-600">Activity description goes here</p>
                            <p className="text-sm text-gray-500 mt-1">XX/XX/XXXX XX:XX PM</p>
                          </div>
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
        {user.status === "Active" ? (
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            Deactivate User
          </Button>
        ) : (
          <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
            Activate User
          </Button>
        )}
        <Button>Contact User</Button>
      </div>
    </div>
  );
}
