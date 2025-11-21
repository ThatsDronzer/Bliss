import VendorPackage from '@/model/vendorPackage';
import Vendor from '@/model/vendor';
import mongoose from 'mongoose';

/**
 * Create a new vendor package
 */
export async function createVendorPackage(data: {
  vendorId: string;
  packageName: string;
  packageType: string;
  description: string;
  items: any[];
  totalPrice: number;
  discount?: number;
  images?: any[];
  specifications?: any;
  isPublic?: boolean;
  availableForBidding?: boolean;
}) {
  try {
    // Verify vendor exists
    const vendor = await Vendor.findById(data.vendorId);

    if (!vendor) {
      return {
        success: false,
        error: 'Vendor not found',
      };
    }

    // Create the package
    const vendorPackage = await VendorPackage.create({
      vendor: data.vendorId,
      packageName: data.packageName,
      packageType: data.packageType,
      description: data.description,
      items: data.items,
      totalPrice: data.totalPrice,
      discount: data.discount || 0,
      images: data.images || [],
      specifications: data.specifications || {},
      isPublic: data.isPublic !== false, // Default true
      availableForBidding: data.availableForBidding !== false, // Default true
      isActive: true,
    });

    // Add package to vendor's prebuiltPackages array
    vendor.prebuiltPackages.push(vendorPackage._id);
    await vendor.save();

    return {
      success: true,
      data: vendorPackage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get all packages for a vendor
 */
export async function getVendorPackages(vendorId: string, includeInactive = false) {
  try {
    const query: any = { vendor: vendorId };

    if (!includeInactive) {
      query.isActive = true;
    }

    const packages = await VendorPackage.find(query)
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: packages,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get a single package by ID
 */
export async function getPackageById(packageId: string) {
  try {
    const vendorPackage = await VendorPackage.findById(packageId)
      .populate('vendor', 'service_name ownerName owner_address owner_contactNo service_email isVerified');

    if (!vendorPackage) {
      return {
        success: false,
        error: 'Package not found',
      };
    }

    // Increment views
    await vendorPackage.incrementViews();

    return {
      success: true,
      data: vendorPackage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update a vendor package
 */
export async function updateVendorPackage(
  packageId: string,
  vendorId: string,
  updateData: any
) {
  try {
    const vendorPackage = await VendorPackage.findOne({
      _id: packageId,
      vendor: vendorId,
    });

    if (!vendorPackage) {
      return {
        success: false,
        error: 'Package not found or you do not have permission to update it',
      };
    }

    // Update allowed fields
    const allowedUpdates = [
      'packageName',
      'description',
      'items',
      'totalPrice',
      'discount',
      'images',
      'specifications',
      'isPublic',
      'availableForBidding',
      'isActive',
    ];

    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (vendorPackage as any)[key] = updateData[key];
      }
    });

    await vendorPackage.save();

    return {
      success: true,
      data: vendorPackage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete a vendor package
 */
export async function deleteVendorPackage(packageId: string, vendorId: string) {
  try {
    const vendorPackage = await VendorPackage.findOne({
      _id: packageId,
      vendor: vendorId,
    });

    if (!vendorPackage) {
      return {
        success: false,
        error: 'Package not found or you do not have permission to delete it',
      };
    }

    // Instead of deleting, mark as inactive
    vendorPackage.isActive = false;
    await vendorPackage.save();

    // Remove from vendor's prebuiltPackages array
    await Vendor.findByIdAndUpdate(vendorId, {
      $pull: { prebuiltPackages: packageId },
    });

    return {
      success: true,
      message: 'Package deactivated successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Search and filter packages
 */
export async function searchPackages(filters: {
  packageType?: string;
  minPrice?: number;
  maxPrice?: number;
  vendorId?: string;
  searchTerm?: string;
  location?: string;
  limit?: number;
  skip?: number;
  sortBy?: 'price' | 'rating' | 'popular' | 'newest';
}) {
  try {
    const query: any = { isPublic: true, isActive: true };

    if (filters.packageType) {
      query.packageType = filters.packageType;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.finalPrice = {};
      if (filters.minPrice !== undefined) query.finalPrice.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.finalPrice.$lte = filters.maxPrice;
    }

    if (filters.vendorId) {
      query.vendor = filters.vendorId;
    }

    if (filters.searchTerm) {
      query.$or = [
        { packageName: { $regex: filters.searchTerm, $options: 'i' } },
        { description: { $regex: filters.searchTerm, $options: 'i' } },
      ];
    }

    // Determine sort order
    let sortQuery: any = { createdAt: -1 };

    if (filters.sortBy === 'price') {
      sortQuery = { finalPrice: 1 };
    } else if (filters.sortBy === 'rating') {
      sortQuery = { averageRating: -1, timesOrdered: -1 };
    } else if (filters.sortBy === 'popular') {
      sortQuery = { timesOrdered: -1, views: -1 };
    } else if (filters.sortBy === 'newest') {
      sortQuery = { createdAt: -1 };
    }

    const packages = await VendorPackage.find(query)
      .populate('vendor', 'service_name owner_address isVerified')
      .sort(sortQuery)
      .limit(filters.limit || 20)
      .skip(filters.skip || 0);

    const total = await VendorPackage.countDocuments(query);

    return {
      success: true,
      data: packages,
      total,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get popular packages
 */
export async function getPopularPackages(limit = 10) {
  try {
    const packages = await VendorPackage.find({
      isPublic: true,
      isActive: true,
    })
      .populate('vendor', 'service_name owner_address isVerified')
      .sort({ timesOrdered: -1, averageRating: -1, views: -1 })
      .limit(limit);

    return {
      success: true,
      data: packages,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get packages by type
 */
export async function getPackagesByType(packageType: string, limit = 20) {
  try {
    const packages = await VendorPackage.find({
      packageType,
      isPublic: true,
      isActive: true,
    })
      .populate('vendor', 'service_name owner_address isVerified')
      .sort({ averageRating: -1, timesOrdered: -1 })
      .limit(limit);

    return {
      success: true,
      data: packages,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Toggle package active status
 */
export async function togglePackageStatus(packageId: string, vendorId: string) {
  try {
    const vendorPackage = await VendorPackage.findOne({
      _id: packageId,
      vendor: vendorId,
    });

    if (!vendorPackage) {
      return {
        success: false,
        error: 'Package not found',
      };
    }

    vendorPackage.isActive = !vendorPackage.isActive;
    await vendorPackage.save();

    return {
      success: true,
      data: vendorPackage,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get vendor's bidding-enabled packages
 */
export async function getVendorBiddingPackages(vendorId: string) {
  try {
    const packages = await VendorPackage.find({
      vendor: vendorId,
      isActive: true,
      availableForBidding: true,
    }).sort({ finalPrice: 1 });

    return {
      success: true,
      data: packages,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
