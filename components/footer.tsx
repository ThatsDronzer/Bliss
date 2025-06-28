import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-pink-400">Blissmet</h3>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for creating unforgettable events. Connect with top-rated vendors and make every
              moment special.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-pink-600 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-pink-600 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-pink-600 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-pink-600 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/vendors?category=venues" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Event Venues
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=catering" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Catering Services
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors?category=photography"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  Photography
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors?category=decoration"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  Decoration
                </Link>
              </li>
              <li>
                <Link
                  href="/vendors?category=entertainment"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  Entertainment
                </Link>
              </li>
              <li>
                <Link
                  href="/home-service"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  Home Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-pink-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/become-vendor" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-400">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-pink-400" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-pink-400" />
                <span className="text-gray-300">hello@blissmet.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-pink-400" />
                <span className="text-gray-300">Mumbai, India</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Newsletter</h5>
              <p className="text-sm text-gray-300">Subscribe for updates and exclusive offers</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-pink-400"
                />
                <Button className="bg-pink-600 hover:bg-pink-700 text-white">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2024 Blissmet. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
