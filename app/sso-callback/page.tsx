"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/lib/localStorage";

export default function SSOCallback() {
  const { isLoaded, userId, sessionId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const clerk = useClerk();
  const client = clerk?.client;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [timeoutCounter, setTimeoutCounter] = useState(0);
  
  // Set a global timeout as ultimate fallback
  useEffect(() => {
    const absoluteTimeout = setTimeout(() => {
      setTimeoutCounter(prev => prev + 1);
      
      if (!error) {
        console.log("ABSOLUTE TIMEOUT: Forcing redirect after extended wait");
        const savedRole = getLocalStorage("preferredRole", "user");
        router.push(`/role-handler?role=${savedRole}&forced=true`);
      }
    }, 45000); // 45 seconds absolute maximum wait
    
    return () => clearTimeout(absoluteTimeout);
  }, [router, error]);
  
  useEffect(() => {
    // Get role from URL params - using router search params is safer for SSR
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role") || "user";
    
    // Store role in localStorage for fallback
    if (role) {
      setLocalStorage("preferredRole", role);
    }
    
    // Function to redirect to role handler
    const redirectToRoleHandler = () => {
      const savedRole = getLocalStorage("preferredRole", role || "user");
      console.log("Redirecting to role handler with role:", savedRole);
      router.push(`/role-handler?role=${savedRole}`);
    };
    
    // Function to handle errors
    const handleAuthError = (msg: string) => {
      console.error(msg);
      setError(msg || "Authentication failed. Please try again.");
      setIsProcessing(false);
      
      // Clear any OAuth state
      removeLocalStorage("clerk-oauth-state");
      
      // Set timeout for redirect
      setTimeout(() => {
        const savedRole = getLocalStorage("preferredRole", "user");
        router.push(`/sign-in?role=${savedRole}&error=auth_failed&reason=${encodeURIComponent(msg)}`);
      }, 3000);
    };
    
    // Main handler
    const handleCallback = async () => {
      // Wait for Clerk to fully load
      if (!isLoaded || !isUserLoaded) return;
      
      try {
        console.log("SSO Callback - Auth state:", { 
          userId, 
          user: !!user, 
          client: !!client,
          clerk: !!clerk
        });
        
        // Check if clerk client is missing and provide fallback
        if (!client) {
          console.warn("Clerk client is undefined, using fallback strategy");
          // If we have userId despite missing client, we can still proceed
          if (userId) {
            console.log("User ID is available despite missing client, continuing");
            redirectToRoleHandler();
            return;
          }
          
          // Give clerk a chance to initialize by waiting
          setTimeout(() => {
            if (userId) {
              redirectToRoleHandler();
            } else {
              handleAuthError("Authentication service unavailable");
            }
          }, 3000);
          return;
        }
        
        // Success case 1: We have a user ID
        if (userId && user) {
          console.log("User is authenticated, redirecting to role handler");
          redirectToRoleHandler();
          return;
        }
        
        // Need to wait for auth to complete - increasing timeout duration
        const maxWaitTime = 30000; // 30 seconds max wait
        const startTime = Date.now();
        let retryCount = 0;
        const maxRetries = 10; // Increased number of retries
        
        // Enhanced manual retry mechanism
        const attemptManualRetry = async () => {
          console.log("Attempting manual auth verification...");
          try {
            // Direct check - if userId is available now, we can proceed
            if (userId) {
              console.log("User ID is now available, proceeding with redirect");
              redirectToRoleHandler();
              return true;
            }
            
            // Check if client and session are available
            if (client && client.session) {
              try {
                // Try to refresh the auth state
                await client.session.refresh();
                const currentUser = client.session?.userId;
                
                if (currentUser) {
                  console.log("Manual verification succeeded through session refresh");
                  redirectToRoleHandler();
                  return true;
                }
              } catch (refreshErr) {
                console.error("Session refresh failed:", refreshErr);
                // Continue to other methods
              }
              
              // Try to get session directly
              try {
                const session = await clerk?.getSession();
                if (session) {
                  console.log("Retrieved session directly from clerk");
                  redirectToRoleHandler();
                  return true;
                }
              } catch (sessionErr) {
                console.error("Get session failed:", sessionErr);
              }
            } else {
              console.log("Client or session is not available, trying alternative methods");
            }
            
            // Last resort - check localStorage for auth token and assume success
            const hasClerkToken = getLocalStorage("__clerk_client_jwt", false) || 
                                 getLocalStorage("__clerk_db", false);
                                 
            if (hasClerkToken) {
              console.log("Found Clerk token in localStorage, assuming auth success");
              redirectToRoleHandler();
              return true;
            }
          } catch (e) {
            console.error("Manual verification failed:", e);
          }
          return false;
        };
        
        // Enhanced polling for authentication
        const checkAuthInterval = setInterval(async () => {
          retryCount++;
          console.log(`Auth check attempt ${retryCount}/${maxRetries}`);
          
          // Check if we've exceeded max wait time
          const timeElapsed = Date.now() - startTime;
          const percentageComplete = Math.min(100, Math.round((timeElapsed / maxWaitTime) * 100));
          console.log(`Auth time elapsed: ${timeElapsed}ms (${percentageComplete}% of max wait time)`);
          
          if (timeElapsed > maxWaitTime) {
            clearInterval(checkAuthInterval);
            console.log("Max wait time exceeded, attempting final verification");
            
            // Try multiple final attempts with exponential backoff
            let finalAttempt = 1;
            let success = false;
            
            while (finalAttempt <= 3 && !success) {
              console.log(`Final attempt ${finalAttempt}/3...`);
              success = await attemptManualRetry();
              if (!success && finalAttempt < 3) {
                // Wait with exponential backoff between attempts
                const backoffTime = Math.pow(2, finalAttempt) * 1000;
                console.log(`Waiting ${backoffTime}ms before next attempt`);
                await new Promise(resolve => setTimeout(resolve, backoffTime));
              }
              finalAttempt++;
            }
            
            if (!success) {
              handleAuthError("Authentication process timed out. Please try signing in again.");
            }
            return;
          }
          
          // Check if user is now authenticated
          if (userId) {
            clearInterval(checkAuthInterval);
            console.log("User authenticated during polling");
            redirectToRoleHandler();
            return;
          }
          
          // Increase manual retry frequency as we approach timeout
          const shouldTryManual = retryCount % 2 === 0 || 
                                timeElapsed > (maxWaitTime * 0.7); // More aggressive near timeout
          
          if (shouldTryManual && retryCount <= maxRetries) {
            console.log(`Manual verification attempt ${retryCount}`);
            const success = await attemptManualRetry();
            if (success) {
              clearInterval(checkAuthInterval);
            }
          }
        }, 1200); // Check less frequently to reduce load but not too slow
        
        // Cleanup interval
        return () => clearInterval(checkAuthInterval);
      } catch (err) {
        handleAuthError(`Error in SSO callback: ${err}`);
      }
    };
    
    handleCallback();
  }, [isLoaded, userId, router, client, clerk, user, isUserLoaded]);

  // Use state for role information to prevent hydration mismatch
  const [displayRole, setDisplayRole] = useState("user");
  
  // Get role from localStorage or URL in an effect
  useEffect(() => {
    const savedRole = getLocalStorage("preferredRole", null);
    const urlParams = new URLSearchParams(window.location.search);
    const roleFromUrl = urlParams.get("role");
    setDisplayRole(roleFromUrl || savedRole || "user");
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="text-center max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        {error ? (
          <>
            <div className="text-red-500 text-3xl mb-3">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Authentication Failed</h3>
            <p className="text-red-500 font-medium mb-3">{error}</p>
            <div className="animate-pulse">
              <p className="text-gray-500">Redirecting you back to sign in...</p>
            </div>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {isProcessing ? "Authenticating..." : "Setting up your account..."}
            </h3>
            <p className="text-gray-600">
              {userId ? "Authentication successful! Setting up your account..." : "Validating your credentials..."}
            </p>
            <p className="text-gray-400 text-sm mt-3">
              You'll be redirected to the {displayRole} dashboard shortly
            </p>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="animate-[loading_1.5s_ease-in-out_infinite] h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" style={{ width: '50%' }}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
