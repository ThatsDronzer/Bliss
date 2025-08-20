"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SignIn, SignInButton, useSignIn } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { setLocalStorage, removeLocalStorage } from "@/lib/localStorage";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") || "user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    // Update the role whenever search params change
    const currentRole = searchParams.get("role") || "user";
    setRole(currentRole);
    
    // Check for error parameters
    const error = searchParams.get("error");
    const errorReason = searchParams.get("reason");
    
    if (error === "auth_failed") {
      if (errorReason?.includes("timed out")) {
        setErrorMessage("Authentication timed out. Please try signing in again.");
      } else {
        setErrorMessage("Authentication failed. Please try signing in again.");
      }
      
      // Clear any lingering OAuth state using our helper
      removeLocalStorage("clerk-oauth-state");
    }
  }, [searchParams]);

  // Toggle between user and vendor
  const toggleRole = () => {
    const newRole = role === "user" ? "vendor" : "user";
    setRole(newRole);
    router.push(`/sign-in?role=${newRole}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    try {
      setLoading(true);
      setErrorMessage("");
      
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Redirect based on role
        router.push(role === "vendor" ? "/vendor-dashboard" : "/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.errors?.[0]?.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state if Clerk isn't loaded yet
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Sign in to Blissmet</CardTitle>
          
          {/* Role toggle switch - improved sizing and spacing */}
          <div className="flex items-center justify-center mt-6 mb-2 w-full max-w-xs mx-auto">
            <div className="bg-muted rounded-full p-1.5 w-full grid grid-cols-2 gap-1">
              <button
                className={`py-2.5 rounded-full text-sm font-medium transition-all ${
                  role === "user"
                    ? "bg-primary text-white shadow-sm"
                    : "hover:bg-muted-foreground/10"
                }`}
                onClick={() => role !== "user" && toggleRole()}
                type="button"
              >
                User
              </button>
              <button
                className={`py-2.5 rounded-full text-sm font-medium transition-all ${
                  role === "vendor"
                    ? "bg-primary text-white shadow-sm"
                    : "hover:bg-muted-foreground/10"
                }`}
                onClick={() => role !== "vendor" && toggleRole()}
                type="button"
              >
                Vendor
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email or Phone number</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button 
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="text-xs text-primary hover:underline"
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={async () => {
                if (!isLoaded) return;
                setLoading(true);
                
                try {
                  // Store the role in localStorage for persistence
                  setLocalStorage("preferredRole", role);
                  
                  // Use a simpler approach with fewer parameters
                  await signIn.authenticateWithRedirect({
                    strategy: "oauth_google",
                    redirectUrl: `/sso-callback?role=${role}`,
                  });
                } catch (err) {
                  console.error("OAuth error:", err);
                  setErrorMessage("Failed to sign in with Google. Please try again.");
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <FaGoogle className="mr-1" /> Google
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={async () => {
                if (!isLoaded) return;
                setLoading(true);
                
                try {
                  // Store the role in localStorage for persistence
                  setLocalStorage("preferredRole", role);
                  
                  // Use a simpler approach with fewer parameters
                  await signIn.authenticateWithRedirect({
                    strategy: "oauth_facebook",
                    redirectUrl: `/sso-callback?role=${role}`,
                  });
                } catch (err) {
                  console.error("OAuth error:", err);
                  setErrorMessage("Failed to sign in with Facebook. Please try again.");
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <FaFacebook className="mr-1" /> Facebook
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t p-4">
          <div className="text-sm text-center">
            Don't have an account?{" "}
            <Link href={`/sign-up?role=${role}`} className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
