import { NextRequest, NextResponse } from 'next/server';
import Vendor from '@/model/vendor'; // adjust path as per your structure
import connectDB from '@/lib/config/db'; // your MongoDB connection util

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // connect to DB
    const body = await req.json();
    const {
      clerkId,
      ownerName,
      owner_contactNo,
      ownerEmail,
      ownerImage,
      owner_address,
      ownerAadhar,
      service_name,
      service_email,
      service_phone,
      service_address,
      service_description,
      establishedYear,
      service_type,
      gstNumber,
      panNumber,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName
    } = body;

    if (!clerkId) {
      return NextResponse.json({ error: 'clerkId is required' }, { status: 400 });
    }

    // Validate required fields
    if (!ownerName || !ownerEmail || !service_name) {
      return NextResponse.json({ 
        error: 'Required fields missing: ownerName, ownerEmail, and service_name are required' 
      }, { status: 400 });
    }

    const updatedVendor = await Vendor.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          ownerName,
          owner_contactNo: owner_contactNo || [],
          ownerEmail,
          ownerImage: ownerImage || "https://www.emamiltd.in/wp-content/themes/emami/images/Fair-and-Handsome02-mob-new.jpg",
          owner_address: owner_address || { State: "", City: "", location: "", pinCode: "" },
          ownerAadhar: ownerAadhar || "",
          service_name,
          service_email: service_email || "",
          service_phone: service_phone || "",
          service_address: service_address || { State: "", City: "", location: "", pinCode: "" },
          service_description: service_description || "",
          establishedYear: establishedYear || "",
          service_type: service_type || "",
          gstNumber: gstNumber || "",
          panNumber: panNumber || "",
          bankName: bankName || "",
          accountNumber: accountNumber || "",
          ifscCode: ifscCode || "",
          accountHolderName: accountHolderName || "",
          isVerified: true,
          updatedAt: new Date(),
        },
      },
      { new: true, upsert: true } // upsert: true will create if doesn't exist
    );

    return NextResponse.json({ success: true, vendor: updatedVendor }, { status: 200 });

  } catch (error) {
    console.error('[VERIFY_VENDOR_ERROR]', error);
    
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
    }, { status: 500 });
  }
}