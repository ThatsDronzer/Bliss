"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "user";

  return (
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl={`/sign-up?role=${role}`}
      redirectUrl="/"
    />
  );
}
