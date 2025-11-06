"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "user";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl={`/sign-up?role=${role}`}
        forceRedirectUrl={"/"}
        appearance={{
          elements: {
            formButtonPrimary: "bg-pink-600 hover:bg-pink-700",
          },
        }}
        unsafeMetadata={{
          role: role, // ✅ Set role immediately at signup
        }}
      />
    </div>
  );
}
