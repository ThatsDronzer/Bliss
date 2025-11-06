"use client"

import { SignIn } from "@clerk/nextjs"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignIn path="/admin-login" routing="path" signUpUrl="/sign-up?role=admin" redirectUrl="/role-handler?role=admin" appearance={{ variables: { colorPrimary: '#db2777' } }} />
      </div>
    </div>
  )
} 
