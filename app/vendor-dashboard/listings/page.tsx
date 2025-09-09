const ListingCard = ({ listing }: { listing: Listing }) => {
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Get the first image or use a placeholder
  const firstImage = listing.images && listing.images.length > 0
    ? listing.images[0]
    : null;

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {firstImage ? (
                <img 
                  src={firstImage.url} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">No Image</span>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              <CardDescription className="mb-2">
                {listing.description}
              </CardDescription>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3" />
                  {listing.location}
                </div>
                <div className="flex items-center">
                  <Star className="mr-1 h-3 w-3" />
                  {listing.rating > 0
                    ? `${listing.rating} (${listing.reviews})`
                    : "No reviews"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {listing.bookings} bookings
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              ₹{listing.price.toLocaleString()}
            </div>
            {getStatusBadge(listing.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Created: {formatDate(listing.createdAt)}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/services/${listing._id}`)}
            >
              <Eye className="mr-1 h-3 w-3" />
              View Service
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/vendor-dashboard/listings/${listing._id}/edit`)
              }
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this listing? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setOpenDelete(false);
                      handleDelete(listing._id);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {listing.status === "active" && (
              <AlertDialog open={openDeactivate} onOpenChange={setOpenDeactivate}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <PowerOff className="mr-1 h-3 w-3" />
                    Deactivate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate Listing</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to deactivate this listing? It will no longer be visible to customers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        setOpenDeactivate(false);
                        toast.success("Deactivate functionality not implemented yet.");
                      }}
                    >
                      Deactivate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};