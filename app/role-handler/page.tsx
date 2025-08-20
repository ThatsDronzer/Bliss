"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { getLocalStorage, setLocalStorage, removeLocalStorage } from "@/lib/localStorage";

export default function RoleHandler() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isForced, setIsForced] = useState(false);

  const role = searchParams.get("role") || "user";
  const forced = searchParams.get("forced") === "true";

  const getDashboardRedirect = (userRole: string) => {
    switch (userRole) {
      case "vendor":
        return "/vendor-dashboard";
      case "admin":
        return "/admin-dashboard";
      case "user":
        return "/dashboard";
      default:
        return "/";
    }
  };

  useEffect(() => {
    // Set isForced state based on URL param
    setIsForced(forced);
  }, [forced]);

  useEffect(() => {
    const handleRoleAndRedirect = async () => {
      // Only proceed if Clerk is loaded or if this is a forced redirect
      if (!isLoaded && !isForced) return;
      
      // If no user after loading, redirect to sign-in (unless forced)
      if (!user && !isForced) {
        console.error('No user found in role handler');
        // Wait a bit to see if user loads
        setTimeout(() => {
          if (!user) {
            console.error('Still no user after waiting, redirecting to sign-in');
            router.push('/sign-in');
          }
        }, 3000);
        return;
      }
      
      try {
        // Get role from localStorage if it exists (for OAuth flows)
        let finalRole = getLocalStorage("preferredRole", role);
        
        // Fallback to default role
        finalRole = finalRole || "user";
        
        // Save the final role to localStorage for future reference
        setLocalStorage("preferredRole", finalRole);
        
        // Add defensive checks for user properties
        console.log('User details:', {
          id: user?.id || 'undefined',
          createdAt: user?.createdAt || 'undefined',
          emailAddresses: user?.emailAddresses?.length || 0,
          unsafeMetadata: !!user?.unsafeMetadata
        });
        
        const currentRole = user?.unsafeMetadata?.role as string;
        console.log('Current user role:', currentRole);
        console.log('Requested role:', finalRole);
        
        // Check if this is a new user from OAuth or if role needs updating
        const isNewOAuthUser = user.createdAt && 
          (new Date().getTime() - new Date(user.createdAt).getTime()) < 60000; // Within 60 seconds
        
        // If user doesn't have a role set, or if the requested role is different, or if it's a new OAuth user
        if (!currentRole || currentRole !== finalRole || isNewOAuthUser) {
          console.log('Updating user role from', currentRole, 'to', finalRole);
          
          // Update user metadata with the new role
          try {
            if (user && typeof user.update === 'function') {
              await user.update({
                unsafeMetadata: {
                  role: finalRole,
                  lastUpdated: new Date().toISOString()
                },
              });
            } else {
              console.error("User object or update method not available");
            }
            
            // After successful update, clear localStorage - use our helper
            removeLocalStorage("preferredRole");
          } catch (updateErr) {
            console.error('Error updating user metadata:', updateErr);
          }

          // Create or update user in MongoDB
          try {
            const response = await fetch('/api/user/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ role: finalRole }),
            });

            if (response.ok) {
              const result = await response.json();
              console.log('User updated in MongoDB:', result);
            } else {
              console.error('Failed to update user in MongoDB');
            }
          } catch (error) {
            console.error('Error updating user in database:', error);
          }
        } else {
          console.log('User already has correct role:', currentRole);
        }

        // Redirect to appropriate dashboard based on the final role
        // Use the current role from the user if it exists, otherwise use the requested role
        let roleForRedirect = finalRole;
        
        if (user?.unsafeMetadata?.role) {
          // Use the role from user metadata if available
          roleForRedirect = user.unsafeMetadata?.role as string;
        } else if (isForced) {
          // For forced redirects without user, use the saved role
          console.log("Forced redirect using saved role:", finalRole);
        }
        
        const redirectUrl = getDashboardRedirect(roleForRedirect);
        console.log(`Redirecting to: ${redirectUrl} for role: ${roleForRedirect}`);
        
        // Small delay to ensure everything is processed
        setTimeout(() => {
          setIsProcessing(false);
          router.push(redirectUrl);
        }, 500);
        
      } catch (err) {
        console.error("Error in role handler:", err);
        // Fallback to default dashboard
        router.push("/dashboard");
      }
    };

    handleRoleAndRedirect();
  }, [isLoaded, user, role, router, isForced]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="text-center max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {isForced ? "Completing your sign-in" : "Setting up your account"}
        </h3>
        <p className="text-gray-600 mb-3">
          {isForced 
            ? "Finalizing authentication and preparing your dashboard..." 
            : `Configuring your ${role} preferences...`}
        </p>
        <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="animate-[loading_1.5s_ease-in-out_infinite] h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" 
               style={{ width: isForced ? '95%' : '80%' }}></div>
        </div>
      </div>
    </div>
  );
}
