"use client"

import type React from "react"
import Link from "next/link"
import { Camera, Building, Music, Palette, Utensils, ClipboardList, Cake, Car, Home, PartyPopper } from "lucide-react"
import { categories } from "@/lib/data"
import { useRouter } from "next/navigation"

export function CategorySection() {
  const router = useRouter()

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Building":
        return <Building className="w-6 h-6" />
      case "Camera":
        return <Camera className="w-6 h-6" />
      case "Utensils":
        return <Utensils className="w-6 h-6" />
      case "Palette":
        return <Palette className="w-6 h-6" />
      case "Music":
        return <Music className="w-6 h-6" />
      case "ClipboardList":
        return <ClipboardList className="w-6 h-6" />
      case "Cake":
        return <Cake className="w-6 h-6" />
      case "Car":
        return <Car className="w-6 h-6" />
      case "Home":
        return <Home className="w-6 h-6" />
      case "PartyPopper":
        return <PartyPopper className="w-6 h-6" />
      default:
        return <Building className="w-6 h-6" />
    }
  }

  const handleCategoryClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.href}
          onClick={(e) => handleCategoryClick(category.href, e)}
          className="group"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-pink-200 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors duration-300">
                <div className="text-pink-600 group-hover:text-pink-700 transition-colors duration-300">
                  {getIcon(category.icon)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Professional services</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
