import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/config/db";
import User from "@/model/user";
import Vendor from "@/model/vendor";

interface ClerkCreatedEvent {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    last_name: string;
    unsafe_metadata?: {
      role?: "user" | "vendor";
    };
  };
}

export async function POST(req: Request) {
  const payload = await req.json();
  const headersList = headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: ClerkCreatedEvent;
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": (await headersList).get("svix-id")!,
      "svix-timestamp": (await headersList).get("svix-timestamp")!,
      "svix-signature": (await headersList).get("svix-signature")!,
    }) as ClerkCreatedEvent;
  } catch (err) {
    return new NextResponse("Invalid webhook", { status: 400 });
  }

  const eventType = evt.type;
  const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
  const email = email_addresses?.[0]?.email_address ?? "";
  const role = unsafe_metadata?.role;


  if ((eventType === "user.created" || eventType === "user.updated") && role) {
    await connectDB();

    if (role === "vendor") {
      const vendorExists = await Vendor.findOne({ clerkId: id });
      if (!vendorExists) {
        await Vendor.create({
          clerkId: id,
          ownerName: `${first_name} ${last_name}`,
          ownerEmail: email,
        });
      }
    } else if (role === "user") {
      const userExists = await User.findOne({ clerkId: id });
      if (!userExists) {
        await User.create({
          clerkId: id,
          name: `${first_name} ${last_name}`,
          email: email,
        });
      }
    }
  }

  if (eventType === "user.deleted") {
    await User.findOneAndDelete({ clerkId: evt.data.id });
    await Vendor.findOneAndDelete({ clerkId: evt.data.id });
  }

  return NextResponse.json({ success: true });
}
