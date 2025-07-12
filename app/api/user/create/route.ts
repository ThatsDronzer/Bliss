import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/config/db";
import User from "@/model/user";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role = "user" } = body;

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: userId });
    
    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: "User already exists",
        user: existingUser 
      });
    }

    // For now, we'll create with basic info
    // You can enhance this by fetching full user details from Clerk
    const newUser = await User.create({
      clerkId: userId,
      name: "User", // This will be updated when we get full user details
      email: "user@example.com", // This will be updated when we get full user details
      role: role,
      coins: 0,
      userVerified: false,
    });

    return NextResponse.json({ 
      success: true, 
      message: "User created successfully",
      user: newUser 
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ 
      error: "Failed to create user" 
    }, { status: 500 });
  }
} 