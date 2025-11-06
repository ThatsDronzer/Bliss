export declare class VendorService {
    /**
     * Get vendor by Clerk ID
     */
    getVendorByClerkId(clerkId: string): Promise<(import("mongoose").FlattenMaps<any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[] | (import("mongoose").FlattenMaps<any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Get vendor by MongoDB ID with listings
     */
    getVendorById(id: string): Promise<{
        id: any;
        name: any;
        location: string;
        rating: number;
        category: any;
        coverImage: string;
        description: any;
        shortDescription: string;
        services: {
            id: any;
            name: any;
            price: any;
            description: any;
            images: any;
            features: any;
            isActive: any;
        }[];
        packages: never[];
        gallery: never[];
        reviews: never[];
        availability: never[];
        refundPolicy: {
            description: string;
            cancellationTerms: {
                daysBeforeEvent: number;
                refundPercentage: number;
            }[];
        };
        contact: {
            phone: any;
            email: any;
            whatsapp: any;
        };
        businessHours: string;
        socialLinks: {};
    } | null>;
    /**
     * Get vendor services
     */
    getVendorServices(id: string): Promise<{
        id: any;
        name: any;
        price: any;
        description: any;
        images: any;
        features: any;
        isActive: any;
    }[]>;
    /**
     * Get vendor services for explore services page
     */
    getVendorServicesForExplore(): Promise<{
        message: string;
        services: never[];
        vendorServices: never[];
    } | {
        services: {
            id: any;
            name: any;
            price: any;
            category: any;
            description: any;
            images: any;
            featured: boolean;
            vendor: {
                id: any;
                name: any;
                rating: number;
                reviewsCount: number;
                image: any;
                location: any;
                experience: string;
                description: any;
                verified: any;
            } | {
                id: any;
                name: string;
                rating: number;
                reviewsCount: number;
                image: string;
                location: string;
                verified: boolean;
            };
        }[];
        vendorServices: {
            id: any;
            name: any;
            rating: number;
            reviewsCount: number;
            image: any;
            location: any;
            experience: string;
            description: any;
            featured: boolean;
            verified: any;
            services: {
                id: any;
                name: any;
                price: any;
                category: any;
                description: any;
                startingPrice: string;
            }[];
        }[];
        message?: undefined;
    }>;
    /**
     * Get vendor verification status
     */
    getVendorVerification(clerkId: string): Promise<{
        isVerified: boolean;
        message: string;
        vendor?: undefined;
    } | {
        isVerified: any;
        vendor: any;
        message?: undefined;
    }>;
    /**
     * Submit vendor verification
     */
    submitVendorVerification(verificationData: {
        clerkId: string;
        businessName?: string;
        businessType?: string;
        businessAddress?: string;
        businessCity?: string;
        businessState?: string;
        businessPincode?: string;
        businessPhone?: string;
        businessEmail?: string;
        businessDescription?: string;
        establishedYear?: string;
        gstNumber?: string;
        panNumber?: string;
        ownerName?: string;
        ownerEmail?: string;
        ownerPhone?: string;
        ownerCity?: string;
        ownerState?: string;
        ownerPincode?: string;
        ownerAadhar?: string;
        bankName?: string;
        accountNumber?: string;
        ifscCode?: string;
        accountHolderName?: string;
    }): Promise<{
        success: boolean;
        vendor: any;
        message: string;
    }>;
    /**
     * Update vendor by Clerk ID
     */
    updateVendorByClerkId(clerkId: string, updateData: any): Promise<(import("mongoose").FlattenMaps<any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[] | (import("mongoose").FlattenMaps<any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=vendor.service.d.ts.map