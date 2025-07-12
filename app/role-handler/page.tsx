"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function RoleHandler() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role") || "user";

  useEffect(() => {
    const setRole = async () => {
      if (isLoaded && user) {
        await user.update({
          unsafeMetadata: {
            role: role,
          },
        });

        // Create user in MongoDB
        try {
          const response = await fetch('/api/user/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log('User created in MongoDB:', result);
          } else {
            console.error('Failed to create user in MongoDB');
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }

        router.push("/");
      }
    };

    setRole();
  }, [isLoaded, user, role]);

  return <p>Setting up your account...</p>;
}
