'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h2>
        <p className="text-gray-600 mb-8">
          The package category you're looking for doesn't exist.
        </p>
        <Link href="/home-service">
          <Button variant="default" className="bg-pink-600 hover:bg-pink-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home Service
          </Button>
        </Link>
      </div>
    </div>
  )
} 