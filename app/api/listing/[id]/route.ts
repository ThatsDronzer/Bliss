import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const listing = await Listing.findById(params.id);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing }, { status: 200 });
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
