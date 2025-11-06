import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/config/db";
import User from "@/model/user";
import Vendor from "@/model/vendor";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role = "user" } = body;

    await connectDB();

    if (role === "vendor") {
      // Handle vendor creation/update
      const existingVendor = await Vendor.findOne({ clerkId: userId });
      
      if (existingVendor) {
        // Update existing vendor role if needed
        if (existingVendor.role !== role) {
          existingVendor.role = role;
          await existingVendor.save();
        }
        return NextResponse.json({ 
          success: true, 
          message: "Vendor already exists",
          vendor: existingVendor 
        });
      }

      // Create new vendor
      const newVendor = await Vendor.create({
        clerkId: userId,
        ownerName: "Vendor", // This will be updated when we get full user details
        ownerEmail: "vendor@example.com", // This will be updated when we get full user details
        role: role,
      });

      return NextResponse.json({ 
        success: true, 
        message: "Vendor created successfully",
        vendor: newVendor 
      });
    } else {
      // Handle user creation/update
      const existingUser = await User.findOne({ clerkId: userId });
      
      if (existingUser) {
        // Update existing user role if needed
        if (existingUser.role !== role) {
          existingUser.role = role;
          await existingUser.save();
        }
        return NextResponse.json({ 
          success: true, 
          message: "User already exists",
          user: existingUser 
        });
      }

      // Create new user
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
    }

  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json({ 
      error: "Failed to create/update user" 
    }, { status: 500 });
  }
} 