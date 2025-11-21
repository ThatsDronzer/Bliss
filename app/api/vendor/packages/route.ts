import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import {
  createVendorPackage,
  getVendorPackages,
  updateVendorPackage,
  deleteVendorPackage,
} from '@/lib/packageService';
import Vendor from '@/model/vendor';

/**
 * GET /api/vendor/packages
 * Get all packages for the authenticated vendor
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get vendor by clerkId
    const vendor = await Vendor.findOne({ clerkId: userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Get query parameter
    const searchParams = req.nextUrl.searchParams;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Get vendor's packages
    const result = await getVendorPackages(vendor._id.toString(), includeInactive);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching vendor packages:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vendor/packages
 * Create a new package
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get vendor by clerkId
    const vendor = await Vendor.findOne({ clerkId: userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const body = await req.json();

    const {
      packageName,
      packageType,
      description,
      items,
      totalPrice,
      discount,
      images,
      specifications,
      isPublic,
      availableForBidding,
    } = body;

    // Validate required fields
    if (!packageName || !packageType || !description || !items || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items must be a non-empty array' },
        { status: 400 }
      );
    }

    // Create the package
    const result = await createVendorPackage({
      vendorId: vendor._id.toString(),
      packageName,
      packageType,
      description,
      items,
      totalPrice,
      discount,
      images,
      specifications,
      isPublic,
      availableForBidding,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Package created successfully',
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/vendor/packages
 * Update an existing package (requires packageId in body)
 */
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get vendor by clerkId
    const vendor = await Vendor.findOne({ clerkId: userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { packageId, ...updateData } = body;

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Update the package
    const result = await updateVendorPackage(
      packageId,
      vendor._id.toString(),
      updateData
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Package updated successfully',
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/vendor/packages
 * Delete/deactivate a package (requires packageId in body)
 */
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get vendor by clerkId
    const vendor = await Vendor.findOne({ clerkId: userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { packageId } = body;

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Delete the package
    const result = await deleteVendorPackage(packageId, vendor._id.toString());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
