import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

export default function VendorSearch() {
  const [searchParams, setSearchParams] = useState({
    service: '',
    location: ''
  });
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce both service and location inputs
  const [debouncedService] = useDebounce(searchParams.service, 500);
  const [debouncedLocation] = useDebounce(searchParams.location, 500);

  const searchVendors = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (debouncedService) queryParams.append('service', debouncedService);
      if (debouncedLocation) queryParams.append('location', debouncedLocation);

      const response = await fetch(`/api/search-vendors?${queryParams}`);
      const data = await response.json();
      setVendors(data.vendors);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedService || debouncedLocation) {
      searchVendors();
    } else {
      setVendors([]);
    }
  }, [debouncedService, debouncedLocation]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for services..."
            value={searchParams.service}
            onChange={(e) => setSearchParams(prev => ({ ...prev, service: e.target.value }))}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter location..."
            value={searchParams.location}
            onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor: any) => (
          <div key={vendor._id} className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              {vendor.profileImage ? (
                <img 
                  src={vendor.profileImage} 
                  alt={vendor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {vendor.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {vendors.length === 0 && !isLoading && (searchParams.service || searchParams.location) && (
        <div className="text-center py-8 text-gray-500">
          No vendors found matching your search criteria
        </div>
      )}
    </div>
  );
}
