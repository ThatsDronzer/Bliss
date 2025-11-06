import { NextResponse } from "next/server";
import type { RentalItem, RentalCategory } from "@/lib/types/rental";

// Mock data for rental items
const mockRentalItems: RentalItem[] = [
  {
    id: "dj-1",
    name: "Professional DJ Setup",
    category: "DJ Setup",
    description: "Complete DJ setup with premium sound system, mixer, and lighting effects",
    details: [
      "2x Pioneer CDJ-3000",
      "1x Pioneer DJM-900NXS2 Mixer",
      "4x QSC K12.2 Speakers",
      "2x QSC KW181 Subwoofers",
      "Basic LED Lighting Package",
    ],
    images: ["/images/rentals/dj-setup-1.jpg"],
    price: 25000,
    priceUnit: "per_event",
    minQuantity: 1,
    maxQuantity: 1,
    vendorId: "v1",
    vendorName: "Pro Audio Solutions",
    vendorRating: 4.8,
    availability: {
      availableDates: [],
      unavailableDates: [],
      leadTime: 2,
      maxBookingAdvance: 90,
    },
  },
  {
    id: "tent-1",
    name: "Elegant Wedding Tent",
    category: "Tent & Canopy",
    description: "Spacious and elegant tent perfect for outdoor events",
    details: [
      "40ft x 60ft White Tent",
      "Sidewalls Included",
      "Cathedral Windows",
      "Setup and Teardown",
      "Rain Gutters",
    ],
    images: ["/images/rentals/tent-1.jpg"],
    price: 35000,
    priceUnit: "per_event",
    minQuantity: 1,
    maxQuantity: 1,
    vendorId: "v2",
    vendorName: "Event Essentials",
    vendorRating: 4.9,
    availability: {
      availableDates: [],
      unavailableDates: [],
      leadTime: 7,
      maxBookingAdvance: 180,
    },
  },
  {
    id: "chair-1",
    name: "Chiavari Chairs Set",
    category: "Chairs & Tables",
    description: "Classic gold Chiavari chairs with cushions",
    details: [
      "Gold Finish",
      "Ivory Cushions",
      "Premium Quality",
      "Includes Delivery",
      "Minimum 50 Chairs",
    ],
    images: ["/images/rentals/chairs-1.jpg"],
    price: 150,
    priceUnit: "per_event",
    minQuantity: 50,
    maxQuantity: 500,
    vendorId: "v2",
    vendorName: "Event Essentials",
    vendorRating: 4.9,
    availability: {
      availableDates: [],
      unavailableDates: [],
      leadTime: 3,
      maxBookingAdvance: 90,
    },
  },
  {
    id: "light-1",
    name: "Premium Lighting Package",
    category: "Lighting & Decoration",
    description: "Create the perfect ambiance with our premium lighting package",
    details: [
      "10x LED Par Lights",
      "4x Moving Head Lights",
      "2x Fog Machines",
      "DMX Controller",
      "Professional Setup",
    ],
    images: ["/images/rentals/lighting-1.jpg"],
    price: 15000,
    priceUnit: "per_event",
    minQuantity: 1,
    maxQuantity: 2,
    vendorId: "v3",
    vendorName: "Bright Events",
    vendorRating: 4.7,
    availability: {
      availableDates: [],
      unavailableDates: [],
      leadTime: 2,
      maxBookingAdvance: 60,
    },
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  let filteredItems = [...mockRentalItems];

  // Apply category filter
  const category = searchParams.get("category");
  if (category) {
    filteredItems = filteredItems.filter((item) => item.category === category);
  }

  // Apply search filter
  const search = searchParams.get("search");
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.details.some((detail) => detail.toLowerCase().includes(searchLower))
    );
  }

  // Apply date filter
  const date = searchParams.get("date");
  if (date) {
    const selectedDate = new Date(date);
    filteredItems = filteredItems.filter((item) => {
      const isUnavailable = item.availability.unavailableDates.includes(date);
      const leadTimeOk =
        new Date(selectedDate.getTime() - item.availability.leadTime * 24 * 60 * 60 * 1000) >=
        new Date();
      const advanceTimeOk =
        new Date(selectedDate.getTime()) <=
        new Date(new Date().getTime() + item.availability.maxBookingAdvance * 24 * 60 * 60 * 1000);
      return !isUnavailable && leadTimeOk && advanceTimeOk;
    });
  }

  // Apply price range filter
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice && maxPrice) {
    filteredItems = filteredItems.filter(
      (item) => item.price >= Number(minPrice) && item.price <= Number(maxPrice)
    );
  }

  // Apply vendor rating filter
  const vendorRating = searchParams.get("vendorRating");
  if (vendorRating) {
    filteredItems = filteredItems.filter(
      (item) => item.vendorRating >= Number(vendorRating)
    );
  }

  // Apply sorting
  const sortBy = searchParams.get("sortBy");
  if (sortBy) {
    switch (sortBy) {
      case "price_asc":
        filteredItems.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filteredItems.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredItems.sort((a, b) => b.vendorRating - a.vendorRating);
        break;
      case "popularity":
        // For mock data, we'll just use the rating as popularity
        filteredItems.sort((a, b) => b.vendorRating - a.vendorRating);
        break;
    }
  }

  return NextResponse.json(filteredItems);
}