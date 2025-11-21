// "use client";

// import { useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function RoleHandler() {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const role = searchParams.get("role") || "user";

//   const getDashboardRedirect = (userRole: string) => {
//     switch (userRole) {
//       case "vendor":
//         return "/vendor-dashboard";
//       case "admin":
//         return "/admin-dashboard";
//       case "user":
//         return "/dashboard";
//       default:
//         return "/";
//     }
//   };

//   useEffect(() => {
//     const handleRoleAndRedirect = async () => {
//       if (isLoaded && user) {
//         const currentRole = user.unsafeMetadata?.role as string;
//         console.log('Current user role:', currentRole);
//         console.log('Requested role:', role);
        
//         // If user doesn't have a role set, or if the requested role is different
//         if (!currentRole || currentRole !== role) {
//           console.log('Updating user role from', currentRole, 'to', role);
          
//           // Update user metadata with the new role
//           await user.update({
//             unsafeMetadata: {
//               role: role,
//             },
//           });

//           // Create or update user in MongoDB
//           try {
//             const response = await fetch('/api/user/create', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({ role }),
//             });

//             if (response.ok) {
//               const result = await response.json();
//               console.log('User updated in MongoDB:', result);
//             } else {
//               console.error('Failed to update user in MongoDB');
//             }
//           } catch (error) {
//             console.error('Error updating user:', error);
//           }
//         } else {
//           console.log('User already has correct role:', currentRole);
//         }

//         // Redirect to appropriate dashboard based on the final role
//         const finalRole = currentRole || role;
//         const redirectUrl = getDashboardRedirect(finalRole);
//         console.log(`Redirecting to: ${redirectUrl} for role: ${finalRole}`);
//         router.push(redirectUrl);
//       }
//     };

//     handleRoleAndRedirect();
//   }, [isLoaded, user, role, router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
//         <p className="text-gray-600">Setting up your {role} account...</p>
//       </div>
//     </div>
//   );
// }


// app/role-handler/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RoleHandlerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "user";

  useEffect(() => {
    // This gives the webhook a moment to process in the background
    // before redirecting the user.
    const timer = setTimeout(() => {
      if (role === 'vendor') {
        router.push('/vendor-dashboard');
      } else if (role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/dashboard');
      }
    }, 2000); // 2-second delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Finalizing your account setup...</p>
      </div>
    </div>
  );
}
