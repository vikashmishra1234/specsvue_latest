"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Eyeglasses", href: "/products/eyeglasses" },
  { label: "Screenglasses", href: "/products/screenglasses" },
  { label: "Kids Glasses", href: "/products/kidsglasses" },
  { label: "Contact Lens", href: "/contact-lenses" },
  { label: "Sunglasses", href: "/products/sunglasses" },
  { label: "Branded Glasses", href: "/products/brandedglasses" },
];

const Footer = () => {
  const pathname = usePathname();

  // ✅ Hide footer on admin dashboard (and optionally any /admin page)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Logo / Brand */}
        <Link href="/" className="inline-block">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SpecsVue
          </span>
        </Link>

        {/* Tagline */}
        <p className="text-gray-400 max-w-lg mx-auto">
          Premium eyewear for every style and need. See the world with clarity and confidence.
        </p>

        {/* Product Links */}
        <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Extra Links */}
        <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
          <Link href="/help" className="hover:text-white transition-colors">
            Help
          </Link>

          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/refund-policies" className="hover:text-white transition-colors">
            Refund Policy
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} SpecsVue. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
