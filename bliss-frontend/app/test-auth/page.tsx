"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function TestAuthPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const userRole = user?.unsafeMetadata?.role as string || "user";

  const testUserLogin = () => {
    router.push("/sign-in?role=user");
  };

  const testVendorLogin = () => {
    router.push("/sign-in?role=vendor");
  };

  const testAdminLogin = () => {
    router.push("/admin-login");
  };

  const testUserSignup = () => {
    router.push("/sign-up?role=user");
  };

  const testVendorSignup = () => {
    router.push("/sign-up?role=vendor");
  };

  const testDashboardAccess = () => {
    switch (userRole) {
      case "vendor":
        router.push("/vendor-dashboard");
        break;
      case "admin":
        router.push("/admin-dashboard");
        break;
      case "user":
        router.push("/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  const createTestData = async () => {
    try {
      const response = await fetch('/api/test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Test data created:', data);
    } catch (error) {
      console.error('Failed to create test data:', error);
    }
  };

  const updateTestVendor = async () => {
    try {
      const response = await fetch('/api/test-data/update-vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Vendor update response:', data);
    } catch (error) {
      console.error('Failed to update vendor:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Authentication Test Page</h1>
      
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Signed In:</span>
              <Badge variant={isSignedIn ? "default" : "secondary"}>
                {isSignedIn ? "Yes" : "No"}
              </Badge>
            </div>
            
            {isSignedIn && user && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">User ID:</span>
                  <span className="text-sm text-gray-600">{user.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-sm text-gray-600">{user.emailAddresses[0]?.emailAddress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Name:</span>
                  <span className="text-sm text-gray-600">{user.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Role:</span>
                  <Badge variant="outline">{userRole}</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={testUserLogin} variant="outline" className="w-full">
                Test User Login
              </Button>
              <Button onClick={testVendorLogin} variant="outline" className="w-full">
                Test Vendor Login
              </Button>
              <Button onClick={testAdminLogin} variant="outline" className="w-full">
                Test Admin Login
              </Button>
              <Button onClick={testUserSignup} variant="outline" className="w-full">
                Test User Signup
              </Button>
              <Button onClick={testVendorSignup} variant="outline" className="w-full">
                Test Vendor Signup
              </Button>
              {isSignedIn && (
                <>
                  <Button onClick={testDashboardAccess} className="w-full">
                    Access Dashboard
                  </Button>
                  <Button onClick={createTestData} className="w-full">
                    Create Test Data
                  </Button>
                  <Button onClick={updateTestVendor} className="w-full">
                    Update Test Vendor
                  </Button>
                  <Button 
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/test-data/cleanup', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          }
                        });
                        const data = await response.json();
                        console.log('Cleanup response:', data);
                      } catch (error) {
                        console.error('Cleanup failed:', error);
                      }
                    }} 
                    variant="destructive"
                    className="w-full"
                  >
                    Cleanup Test Data
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role-Based Access Test */}
        {isSignedIn && (
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => router.push("/dashboard")}
                  variant={userRole === "user" ? "default" : "outline"}
                  className="w-full"
                  disabled={userRole !== "user"}
                >
                  User Dashboard
                </Button>
                <Button 
                  onClick={() => router.push("/vendor-dashboard")}
                  variant={userRole === "vendor" ? "default" : "outline"}
                  className="w-full"
                  disabled={userRole !== "vendor"}
                >
                  Vendor Dashboard
                </Button>
                <Button 
                  onClick={() => router.push("/admin-dashboard")}
                  variant={userRole === "admin" ? "default" : "outline"}
                  className="w-full"
                  disabled={userRole !== "admin"}
                >
                  Admin Dashboard
                </Button>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Only the button matching your role should be enabled and highlighted.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Test User Authentication:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Click "Test User Signup" to create a new user account</li>
                <li>• Complete the signup process</li>
                <li>• Verify you're redirected to the user dashboard</li>
                <li>• Try accessing vendor or admin dashboards - should be redirected</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Test Vendor Authentication:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Sign out and click "Test Vendor Signup"</li>
                <li>• Complete the vendor signup process</li>
                <li>• Verify you're redirected to the vendor dashboard</li>
                <li>• Try accessing user or admin dashboards - should be redirected</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">3. Test Admin Authentication:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Click "Test Admin Login"</li>
                <li>• Use admin credentials (admin@blissmet.in / blissmet@admin2024)</li>
                <li>• Verify you're redirected to the admin dashboard</li>
                <li>• Try accessing user or vendor dashboards - should be redirected</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 