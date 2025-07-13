import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const useRoleAuth = (requiredRole?: string) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userRole = user?.unsafeMetadata?.role as string || "user";

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // Redirect to sign-in with appropriate role
      const signInUrl = requiredRole ? `/sign-in?role=${requiredRole}` : "/sign-in";
      router.push(signInUrl);
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on actual role
      const redirectUrl = getRoleBasedRedirect(userRole);
      router.push(redirectUrl);
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [isLoaded, isSignedIn, userRole, requiredRole, router]);

  const getRoleBasedRedirect = (role: string) => {
    switch (role) {
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

  return {
    isAuthorized,
    isLoading: !isLoaded || isLoading,
    userRole,
    user,
    isSignedIn,
  };
}; 