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

        router.push("/");
      }
    };

    setRole();
  }, [isLoaded, user, role]);

  return <p>Setting up your account...</p>;
}
