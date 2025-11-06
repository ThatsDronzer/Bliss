"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, MapPin, Star, Heart, Trash2 } from "lucide-react"

import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function FavoritesPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const [favorites, setFavorites] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isSignedIn) {
    return null
  }

  // Filter favorites based on search
  const filteredFavorites = favorites.filter(
    (favorite) =>
      favorite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      favorite.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      favorite.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRemoveFavorite = (id: string) => {
    toggleFavorite(id)
    toast({
      title: "Removed from favorites",
      description: "Vendor has been removed from your favorites list",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-gray-500 mt-1">Vendors you've saved for future reference</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search favorites..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFavorites.length > 0 ? (
          filteredFavorites.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden group">
              <div className="aspect-video relative">
                <Image
                  src={favorite.image || "/placeholder.svg"}
                  alt={favorite.name}
                  width={400}
                  height={225}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded">
                  {favorite.category}
                </div>
                <button
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRemoveFavorite(favorite.id)
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{favorite.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{favorite.location}</span>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-500">Starting at</span>
                  </div>
                  <div className="font-bold text-primary">{favorite.price}</div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 bg-gray-50 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => router.push(`/vendors/${favorite.id}`)}>
                  View Details
                </Button>
                <Button size="sm" onClick={() => router.push(`/vendors/${favorite.id}`)}>
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium">No favorites found</p>
            <p className="text-gray-500 mt-1">Try adjusting your search or add some vendors to your favorites</p>
            <Button className="mt-4" onClick={() => router.push("/vendors")}>
              Explore Vendors
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
