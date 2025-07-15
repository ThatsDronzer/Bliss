"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "user";

  return (
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl={`/sign-in?role=${role}`}
      forceRedirectUrl={`/role-handler?role=${role}`}  // 👈 handle role update
      redirectUrl="/"
    />
  );
}
