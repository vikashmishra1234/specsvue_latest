"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, User } from "lucide-react"; // Added User icon
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

// Data for navigation links
const navLinks = [
  { label: "EYEGLASSES", href: "/products/eyeglasses" },
  { label: "SCREEN GLASSES", href: "/products/screenglasses" },
  { label: "KIDS GLASSES", href: "/products/kids" },
  { label: "CONTACT LENS", href: "/products/contact-lens" },
  { label: "SUNGLASSES", href: "/products/sunglasses" },
];

const Header = () => {
  const {status} = useSession()
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Effect to lock body scroll when mobile menu is open
 useEffect(() => {
  if (status === "unauthenticated") {
    const guestId = localStorage.getItem("guestId");
    if (!guestId) {
      localStorage.setItem("guestId", `guest${Math.floor(Math.random() * 10000)}`);
    }
  }
}, [status]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Animation variants for the mobile menu
  const menuVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeOut" } },
  };

  return (
    // CHANGE: Updated header classes for a black theme with backdrop blur
    <header className="bg-black/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="text-3xl font-bold text-white">
            SpecsVue
          </Link>

          {/* Desktop Links - Centered */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  // CHANGE: Updated text colors for the dark theme
                  className={`text-sm font-semibold tracking-wider transition-colors duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons: User Icon (Desktop) & Hamburger (Mobile) */}
          <div className="flex items-center gap-4">
            {/* ENHANCEMENT: User icon added for desktop view */}
            <Link href={'/cart'} className="hidden md:block text-gray-300 hover:text-white transition-colors">
              {/* <Cart size={24} /> */}
              <ShoppingCart />
            </Link>
            <Link href={status==='authenticated'?'/user':'/login'} className="hidden md:block text-gray-300 hover:text-white transition-colors">
              <User size={24} />
            </Link>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                // CHANGE: Updated icon color for dark theme
                className="text-gray-300 p-2"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-menu"
            // CHANGE: Updated mobile menu background for dark theme
            className="md:hidden bg-black shadow-lg"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    // CHANGE: Updated mobile link colors for dark theme
                    className={`block py-3 px-4 rounded-md text-base font-medium transition-colors duration-300 ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-900 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {/* ENHANCEMENT: Added an "Account" link with User icon to the mobile menu */}
              <div className="border-t border-gray-700 mt-4 pt-4">
                 <Link
                    href="/user"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-md text-base font-medium text-gray-400 hover:bg-gray-900 hover:text-white"
                  >
                    <User size={22} />
                    Account
                  </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;