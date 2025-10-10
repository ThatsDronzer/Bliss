// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/config/db";
import User from "@/model/user";
import Vendor from "@/model/vendor";

// Your ClerkEvent interface...
interface ClerkEvent {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    last_name: string;
    unsafe_metadata?: {
      role?: "user" | "vendor" | "admin";
    };
  };
}

export async function POST(req: Request) {
  // ... Webhook verification code ...
  const payload = await req.json();
  const headersList = headers();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: ClerkEvent;
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": (await headersList).get("svix-id")!,
      "svix-timestamp": (await headersList).get("svix-timestamp")!,
      "svix-signature": (await headersList).get("svix-signature")!,
    }) as ClerkEvent;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid webhook", { status: 400 });
  }

  const eventType = evt.type;

  try {
    await connectDB();

    // Handle user creation and re-linking
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address ?? "";

      // 👇 THE FIX: Find by clerkId OR email to handle orphaned users
      await User.findOneAndUpdate(
        { $or: [{ clerkId: id }, { email: email }] },
        {
          $set: { // Use $set to update all fields, including the clerkId
            clerkId: id,
            name: `${first_name} ${last_name}`,
            email: email,
          },
        },
        { upsert: true, new: true } // Create if no user is found by either key
      );
      console.log(`[Webhook] User record created or updated for ${id}.`);
    }

    // Handle vendor upgrade and admin role
   if (eventType === "user.updated") {
  const { id, unsafe_metadata } = evt.data;
  const role = unsafe_metadata?.role;

  console.log("[Webhook] Role detected:", role);

  if (role === "vendor") {
    const userRecord = await User.findOne({ clerkId: id });
    if (!userRecord) {
      console.log(`[Webhook] ❌ No User found with clerkId ${id}. Vendor not created.`);
      return;
    }

    await Vendor.create({
      clerkId: userRecord.clerkId,
      ownerName: userRecord.name,
      ownerEmail: userRecord.email,
    });

    await User.findOneAndDelete({ clerkId: id });
    console.log(`[Webhook] ✅ User ${id} successfully migrated to Vendor.`);
  }

  if (role === "admin") {
    // Update existing user record to have admin role
    await User.findOneAndUpdate(
      { clerkId: id },
      { $set: { role: "admin" } },
      { upsert: false }
    );
    console.log(`[Webhook] ✅ User ${id} role updated to admin.`);
  }
}

    // Handle user deletion
    if (eventType === "user.deleted") {
      const deletedUserId = evt.data.id;
      if (deletedUserId) {
        await User.findOneAndDelete({ clerkId: deletedUserId });
        await Vendor.findOneAndDelete({ clerkId: deletedUserId });
        console.log(`[Webhook] 🗑️ User/Vendor with clerkId ${deletedUserId} deleted.`);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[Webhook] A CRITICAL ERROR OCCURRED:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}