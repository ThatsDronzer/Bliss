"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import {toast} from "sonner";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  PowerOff,
  AlertCircle,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@clerk/clerk-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

export default function VendorListingsPage() {
  const { session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [listingsData, setListingsData] = useState<{
    active: Listing[];
    draft: Listing[];
    inactive: Listing[];
  }>({
    active: [],
    draft: [],
    inactive: [],
  });
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("active");
  interface Listing {
    _id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    rating: number;
    reviews: number;
    bookings: number;
    isActive: boolean;
    status: "active" | "inactive" | "draft";
    createdAt: string;
    // Add any other fields you expect
  }

  // Get user role from Clerk metadata
  const userRole = (user?.unsafeMetadata?.role as string) || "user";

  const formatDate = (isoString: string) => {
    if (!isoString) {
      console.warn("No createdAt value passed to formatDate");
      return "N/A";
    }
    const date = new Date(isoString);

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return formattedDate;
  };

  // Check verification status
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/vendor-verification?clerkId=${user.id}`);
          const data = await response.json();
          if (response.ok) {
            setIsVerified(data.isVerified);
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
        } finally {
          setCheckingVerification(false);
        }
      } else {
        setCheckingVerification(false);
      }
    };

    checkVerificationStatus();
  }, [user?.id]);

  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in?role=vendor");
    } else if (isLoaded && isSignedIn && userRole !== "vendor") {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, userRole, router]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!session) {
        console.log("No session, skipping fetch.");
        return;
      }

      const userToken = await session.getToken();
      setToken(userToken);

      try {
        const res = await fetch("/api/listing", {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        let listingsArray: Listing[] = data.listings;


        if (!Array.isArray(listingsArray)) {
          console.error(
            "Expected listings to be an array but got:",
            listingsArray
          );
          return;
        }

        // ✅ Add status to each listing
        listingsArray = listingsArray.map((l: any) => ({
          ...l,
          status: l.isActive ? "active" : "inactive",
        }));

        const active = listingsArray.filter((l: any) => l.status === "active");
        const inactive = listingsArray.filter(
          (l: any) => l.status === "inactive"
        );

        setListingsData({
          active,
          draft: [],
          inactive,
        });
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [session]);

  if (!isLoaded || !isSignedIn || userRole !== "vendor") {
    return null;
  }

  if (checkingVerification) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking verification status...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show verification required message if not verified
  if (!isVerified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Required</h1>
            <p className="text-gray-600 mb-6">
              You need to complete your business verification before you can create and manage listings.
            </p>
            <Button onClick={() => router.push("/vendor-dashboard/verification")}>
              Complete Verification
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const listings = listingsData;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
 const handleDelete = async (listingId: string) => {
  if (!token) {
    toast.error("User not authenticated");
    return;
  }

  // Create a toast promise that shows loading until the operation completes
  toast.promise(
    (async () => {
      try {
        const res = await fetch("/api/listing", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ listingId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to delete listing");
        }

        // Update UI
        setListingsData((prev) => ({
          ...prev,
          active: prev.active.filter((l) => l._id !== listingId),
          inactive: prev.inactive.filter((l) => l._id !== listingId),
          draft: prev.draft.filter((l) => l._id !== listingId),
        }));

        return "Listing deleted successfully";
      } catch (error:any) {
        throw new Error(error.message || "An error occurred while deleting the listing");
      }
    })(),
    {
      loading: "Deleting listing...",
      success: (message) => message,
      error: (error) => error.message,
    }
  );
};



  const ListingCard = ({ listing }: { listing: Listing }) => {
    const [openDeactivate, setOpenDeactivate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    return (

    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Image</span>
           
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              <CardDescription className="mb-2">
                {listing.description}
              </CardDescription>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3" />
                  {listing.location}
                </div>
                <div className="flex items-center">
                  <Star className="mr-1 h-3 w-3" />
                  {listing.rating > 0
                    ? `${listing.rating} (${listing.reviews})`
                    : "No reviews"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {listing.bookings} bookings
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              ₹{listing.price.toLocaleString()}
            </div>
            {getStatusBadge(listing.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Created: {formatDate(listing.createdAt)}
          </div>
          <div className="flex space-x-2">
                         <Button 
               variant="outline" 
               size="sm"
               onClick={() => router.push(`/services/${listing._id}`)}
             >
               <Eye className="mr-1 h-3 w-3" />
               View Service
             </Button>
           
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/vendor-dashboard/listings/${listing._id}/edit`)
              }
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this listing? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setOpenDelete(false);
                      handleDelete(listing._id);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {listing.status === "active" && (
              <AlertDialog open={openDeactivate} onOpenChange={setOpenDeactivate}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <PowerOff className="mr-1 h-3 w-3" />
                    Deactivate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate Listing</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to deactivate this listing? It will no longer be visible to customers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setOpenDeactivate(false);
                        toast.success("Deactivate functionality not implemented yet.");
                      }}
                    >
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
          <p className="text-gray-600">
            Manage your service listings and packages
          </p>
        </div>
        {isVerified && (
          <Button
            className="mt-4 md:mt-0"
            onClick={() => router.push("/vendor-dashboard/listings/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Listings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings.active.length +
                    listings.draft.length +
                    listings.inactive.length}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings.active.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings.draft.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {listings.inactive.length}
                </p>
              </div>
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listings Tabs */}
      <div className="space-y-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "active"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Active ({listings.active.length})
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "draft"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Draft ({listings.draft.length})
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "inactive"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Inactive ({listings.inactive.length})
          </button>
        </div>

        <div className="space-y-4">
          {activeTab === "active" && (
            <>
              {listings.active.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No active listings
                    </h3>
                    <p className="text-gray-500">
                      You don't have any active listings at the moment.
                    </p>
                    {isVerified && (
                      <Button
                        className="mt-4"
                        onClick={() =>
                          router.push("/vendor-dashboard/listings/new")
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Listing
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                listings.active.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))
              )}
            </>
          )}

          {activeTab === "draft" && (
            <>
              {listings.draft.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No draft listings
                    </h3>
                    <p className="text-gray-500">
                      You don't have any draft listings.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                listings.draft.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))
              )}
            </>
          )}

          {activeTab === "inactive" && (
            <>
              {listings.inactive.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No inactive listings
                    </h3>
                    <p className="text-gray-500">
                      You don't have any inactive listings.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                listings.inactive.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
