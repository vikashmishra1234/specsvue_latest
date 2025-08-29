
import Link from "next/link"
import {  Instagram, Facebook, Twitter } from "lucide-react"

const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SpecsVue
                </span>
              </Link>
              <p className="text-gray-400 mb-4">
                Premium eyewear for every style and need. See the world with clarity and confidence.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter size={20} />
                </Link>
              </div>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-4">Collections</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                   Eyglasses
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Screenglasses
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Sunglasses
                  </Link>
                </li>
                <li>
                  <Link href="/contactlens" className="text-gray-400 hover:text-white transition-colors">
                    Contact Lens
                  </Link>
                </li>
            
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-4">Category</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/men" className="text-gray-400 hover:text-white transition-colors">
                   Men
                  </Link>
                </li>
               
                <li>
                  <Link href="/women" className="text-gray-400 hover:text-white transition-colors">
                    women
                  </Link>
                </li>
                <li>
                  <Link href="/kids" className="text-gray-400 hover:text-white transition-colors">
                   Kids
                  </Link>
                </li>
              
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/prescription" className="text-gray-400 hover:text-white transition-colors">
                    Take Prescription
                  </Link>
                </li>
                <li>
                  <Link href="/Privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/agreement" className="text-gray-400 hover:text-white transition-colors">
                    Terms & Conditon
                  </Link>
                </li>
              
              </ul>
            </div>
          </div>
  
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} SpecsVue. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
                <Link href="#" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  export default Footer;