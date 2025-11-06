import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// GET /api/rental - Get rental items (mock data for now)
router.get('/', (req: Request, res: Response) => {
  // Mock rental items - this can be replaced with actual database queries later
  const mockRentalItems = [
    {
      id: 'dj-1',
      name: 'Professional DJ Setup',
      category: 'DJ Setup',
      description: 'Complete DJ setup with premium sound system, mixer, and lighting effects',
      details: [
        '2x Pioneer CDJ-3000',
        '1x Pioneer DJM-900NXS2 Mixer',
        '4x QSC K12.2 Speakers',
        '2x QSC KW181 Subwoofers',
        'Basic LED Lighting Package',
      ],
      images: ['/images/rentals/dj-setup-1.jpg'],
      price: 25000,
      priceUnit: 'per_event',
      minQuantity: 1,
      maxQuantity: 1,
      vendorId: 'v1',
      vendorName: 'Pro Audio Solutions',
      vendorRating: 4.8,
      availability: {
        availableDates: [],
        unavailableDates: [],
        leadTime: 2,
        maxBookingAdvance: 90,
      },
    },
    // Add more mock items as needed
  ];

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  let filteredItems = [...mockRentalItems];

  // Apply filters
  const category = searchParams.get('category');
  if (category) {
    filteredItems = filteredItems.filter((item) => item.category === category);
  }

  const search = searchParams.get('search');
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
    );
  }

  res.json(filteredItems);
});

export default router;

