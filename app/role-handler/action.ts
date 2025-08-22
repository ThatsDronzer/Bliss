"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";  // ✅ correct import
import { redirect } from "next/navigation";

export async function updateUserToVendor() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated.");
  }

  await clerkClient.users.updateUser(userId, {
    unsafeMetadata: {
      role: "vendor",
    },
  });

  redirect("/vendor-dashboard");
}
