// /app/api/vendor-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Vendor from '@/model/vendor'; // adjust path as per your structure
import connectDB from '@/lib/config/db'; // your MongoDB connection util

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'clerkId is required' }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ clerkId });
    
    if (!vendor) {
      return NextResponse.json({ 
        isVerified: false, 
        message: 'Vendor not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      isVerified: vendor.isVerified || false,
      vendor: vendor
    }, { status: 200 });

  } catch (error) {
    console.error('[GET_VENDOR_VERIFICATION_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // connect to DB
    const body = await req.json();
    const {
      clerkId,
      businessName,
      businessType,
      businessAddress,
      businessCity,
      businessState,
      businessPincode,
      businessPhone,
      businessEmail,
      businessDescription,
      establishedYear,
      gstNumber,
      panNumber,
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerCity,
      ownerState,
      ownerPincode,
      ownerAadhar,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName
    } = body;

    if (!clerkId) {
      return NextResponse.json({ error: 'clerkId is required' }, { status: 400 });
    }

    // Check if vendor exists
    let vendor = await Vendor.findOne({ clerkId });
    
    if (!vendor) {
      // Create new vendor if doesn't exist
      vendor = new Vendor({
        clerkId,
        ownerName: ownerName || businessName,
        ownerEmail: ownerEmail || businessEmail,
        service_name: businessName,
        service_email: businessEmail,
        service_phone: businessPhone,
        service_address: {
          City: businessCity,
          State: businessState,
          location: businessAddress,
          pinCode: businessPincode
        },
        service_description: businessDescription,
        establishedYear: establishedYear,
        service_type: businessType,
        gstNumber: gstNumber,
        panNumber: panNumber,
        bankName: bankName,
        accountNumber: accountNumber,
        ifscCode: ifscCode,
        accountHolderName: accountHolderName,
        owner_address: {
          City: ownerCity,
          State: ownerState,
          location: "",
          pinCode: ownerPincode
        },
        ownerAadhar: ownerAadhar,
        isVerified: true, // Set to true when verification is submitted
        updatedAt: new Date(),
      });
    } else {
      // Update existing vendor
      vendor.ownerName = ownerName || vendor.ownerName;
      vendor.ownerEmail = ownerEmail || vendor.ownerEmail;
      vendor.service_name = businessName || vendor.service_name;
      vendor.service_email = businessEmail || vendor.service_email;
      vendor.service_phone = businessPhone || vendor.service_phone;
      vendor.service_address = {
        City: businessCity || vendor.service_address?.City,
        State: businessState || vendor.service_address?.State,
        location: businessAddress || vendor.service_address?.location,
        pinCode: businessPincode || vendor.service_address?.pinCode
      };
      vendor.service_description = businessDescription || vendor.service_description;
      vendor.establishedYear = establishedYear || vendor.establishedYear;
      vendor.service_type = businessType || vendor.service_type;
      vendor.gstNumber = gstNumber || vendor.gstNumber;
      vendor.panNumber = panNumber || vendor.panNumber;
      vendor.bankName = bankName || vendor.bankName;
      vendor.accountNumber = accountNumber || vendor.accountNumber;
      vendor.ifscCode = ifscCode || vendor.ifscCode;
      vendor.accountHolderName = accountHolderName || vendor.accountHolderName;
      vendor.owner_address = {
        City: ownerCity || vendor.owner_address?.City,
        State: ownerState || vendor.owner_address?.State,
        location: vendor.owner_address?.location || "",
        pinCode: ownerPincode || vendor.owner_address?.pinCode
      };
      vendor.ownerAadhar = ownerAadhar || vendor.ownerAadhar;
      vendor.isVerified = true; // Set to true when verification is submitted
      vendor.updatedAt = new Date();
    }

    await vendor.save();

    return NextResponse.json({ 
      success: true, 
      vendor: vendor,
      message: "Verification submitted successfully. Your application has been verified."
    }, { status: 200 });

  } catch (error) {
    console.error('[VERIFY_VENDOR_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}