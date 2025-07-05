import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { NextResponse } from 'next/server';
import connectDB from "@/lib/config/db"
import User from '@/model/user';

interface ClerkUserCreatedEvent {
  type: "user.created";
  data: {
    id: string;
    username: string;
    email_addresses: { email_address: string }[];
    phone_no : number
  };
}

export async function POST(req: Request) {
  const payload = await req.json();
  const headersList = headers();

  const svix_id = (await headersList).get("svix-id")!;
  const svix_timestamp = (await headersList).get("svix-timestamp")!;
  const svix_signature = (await headersList).get("svix-signature")!;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt:ClerkUserCreatedEvent;
  console.log("Webhook triggered by Clerk:", payload);

  try {
     evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkUserCreatedEvent; // 👈 Type assertion here
  } catch (err) {
    return new NextResponse("Webhook verification failed", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username,phone_no } = evt.data;

    await connectDB();

    const userExists = await User.findOne({ clerkId: id });
    if (!userExists) {
      await User.create({
        clerkId: id,
        name: username,
        email: email_addresses[0].email_address,
        phone : phone_no,
      });
    }
    
  }

  return NextResponse.json({ message: "Webhook received!" });
}
