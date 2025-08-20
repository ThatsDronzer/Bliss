"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SignUpButton, useSignUp } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { setLocalStorage } from "@/lib/localStorage";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") || "user");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    // Update the role whenever search params change
    const currentRole = searchParams.get("role") || "user";
    setRole(currentRole);
  }, [searchParams]);
  
  // Simplified approach for CAPTCHA
  useEffect(() => {
    if (isLoaded && !verifying) {
      // Simply ensure the CAPTCHA element exists
      // Clerk will automatically find and use it when needed
      const captchaEl = document.getElementById('clerk-captcha');
      if (!captchaEl) {
        console.warn('CAPTCHA element not found in the DOM');
      }
    }
  }, [isLoaded, verifying]);

  // Toggle between user and vendor
  const toggleRole = () => {
    const newRole = role === "user" ? "vendor" : "user";
    setRole(newRole);
    router.push(`/sign-up?role=${newRole}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    try {
      setLoading(true);
      setErrorMessage("");
      
      // Start the sign-up process
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          role: role
        }
      });
      
      // Send the email verification code
      // Clerk will automatically handle CAPTCHA verification using the clerk-captcha element
      await signUp.prepareEmailAddressVerification({ 
        strategy: "email_code"
      });
      
      // Switch to verification view
      setVerifying(true);
    } catch (err: any) {
      console.error("Sign up error:", err);
      setErrorMessage(err.errors?.[0]?.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    try {
      setLoading(true);
      setErrorMessage("");
      
      // Attempt to verify the email code
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Redirect to the role handler to update role metadata
        router.push(`/role-handler?role=${role}`);
      } else {
        // Handle other status
        setErrorMessage("Verification is not complete yet. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.errors?.[0]?.message || "An error occurred during verification");
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
          <CardTitle className="text-2xl font-bold">
            {verifying ? "Verify your email" : "Sign up to Blissmet"}
          </CardTitle>
          <CardDescription>
            {verifying 
              ? "We've sent a verification code to your email" 
              : "Create your account"}
          </CardDescription>
          
          {!verifying && (
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
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
              {errorMessage}
            </div>
          )}
          
          {verifying ? (
            <form onSubmit={handleVerification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter the code sent to your email"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Check your email inbox for the verification code
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
              
              <div className="flex justify-center">
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await signUp.prepareEmailAddressVerification({
                        strategy: "email_code"
                      });
                      setErrorMessage("New verification code sent!");
                      setTimeout(() => setErrorMessage(""), 3000);
                    } catch (err: any) {
                      setErrorMessage(err.errors?.[0]?.message || "Failed to resend code");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Resend verification code
                </button>
              </div>
            </form>
          ) : (
            <>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                {/* Clerk's recommended CAPTCHA placement */}
                <div id="clerk-captcha" className="mt-2 mb-4 flex justify-center"></div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  data-testid="clerk-sign-up-button" // Add Clerk's test ID to help it find the button
                >
                  {loading ? "Creating account..." : "Sign up"}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="text-primary hover:underline">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                </p>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or sign up with
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
                      await signUp.authenticateWithRedirect({
                        strategy: "oauth_google",
                        redirectUrl: `/sso-callback?role=${role}`,
                        // We'll handle metadata setting in role-handler
                      });
                    } catch (err) {
                      console.error("OAuth error:", err);
                      setErrorMessage("Failed to sign up with Google. Please try again.");
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
                      await signUp.authenticateWithRedirect({
                        strategy: "oauth_facebook",
                        redirectUrl: `/sso-callback?role=${role}`,
                        // We'll handle metadata setting in role-handler
                      });
                    } catch (err) {
                      console.error("OAuth error:", err);
                      setErrorMessage("Failed to sign up with Facebook. Please try again.");
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  <FaFacebook className="mr-1" /> Facebook
                </Button>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center border-t p-4">
          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link href={`/sign-in?role=${role}`} className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
