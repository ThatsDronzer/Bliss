// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/config/db";
import User from "@/model/user";
import Vendor from "@/model/vendor";

// (Your ClerkEvent interface remains the same)
interface ClerkEvent {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    last_name: string;
    unsafeMetadata?: {
      role?: "user" | "vendor";
    };
  };
}


export async function POST(req: Request) {
  // ... (Payload and Svix verification code remains the same)
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
  await connectDB();

  // ✅ STEP 1: Handle Initial User Creation
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses?.[0]?.email_address ?? "";

    console.log(`New user ${id} is being created.`);

    await User.create({
      clerkId: id,
      name: `${first_name} ${last_name}`,
      email: email,
      // You can set a default role here if your schema requires it
    });

    console.log(`✅ User record created in DB for ${id}.`);
  }
  
  // ✅ STEP 2: Handle User Upgrade to Vendor
  if (eventType === "user.updated") {
    const { id, unsafeMetadata } = evt.data;
    const role = unsafeMetadata?.role as string;

    if (role === "vendor") {
      console.log(`User ${id} is being upgraded to a Vendor.`);
      
      const userRecord = await User.findOne({ clerkId: id });

      if (userRecord) {
        await Vendor.create({
          clerkId: userRecord.clerkId,
          ownerName: userRecord.name,
          ownerEmail: userRecord.email,
        });
        console.log(`Vendor record created for ${id}.`);

        // 👇 STEP 2: The Fix - Delete the original user record
        await User.findOneAndDelete({ clerkId: id });
        console.log(`✅ Original user record for ${id} deleted.`);
      } else {
        console.log(`User record for ${id} not found for migration. A vendor might have updated their profile.`);
      }
    }
  }

  // ✅ STEP 3: Handle User Deletion
  if (eventType === "user.deleted") {
    const deletedUserId = evt.data.id;
    if (deletedUserId) {
        await User.findOneAndDelete({ clerkId: deletedUserId });
        await Vendor.findOneAndDelete({ clerkId: deletedUserId });
        console.log(`🗑️ User/Vendor with clerkId ${deletedUserId} deleted from DB`);
    }
  }

  return NextResponse.json({ success: true });
}