"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
// CHANGE: Import Next.js Image component for optimization
import Image from "next/image";
import Link from "next/link";

// CHANGE: Moved slides array outside the component to prevent re-declaration on every render.
const slides = [
  {
    id: 1,
    title: "Get 20% Off on Eyewear with Prescription",
    description: "Unlock 20% off on your next pair of eyeglasses when you upload your prescription at VisionHub. Enjoy clear vision with stylish frames, unmatched comfort, and expert-recommended lenses — all at a discounted price.",
    image: "/images/banner-3.png",
    cta: "Save 20% Now",
    alt: "Collection of premium prescription glasses frames",
    nav: "prescription",
  },
{
  id: 2,
  title: "SpecsVue – Redefining Eyewear Fashion",
  description: "Discover premium spectacles and sunglasses at SpecsVue.in – where style, clarity, and comfort come together. From modern trends to timeless classics, find eyewear that enhances your look and vision.",
  image: "/images/banner-4.png",
  cta: "Shop Eyewear Now",
  alt: "SpecsVue eyewear store showcasing stylish spectacles and sunglasses",
  nav: "products",
}


];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Memoized functions for navigation are good practice
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto slide change interval
  useEffect(() => {
    const timer = setInterval(goToNextSlide, 6000);
    return () => clearInterval(timer);
  }, [goToNextSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <section
      aria-label="Featured eyewear collections"
      className="relative w-full h-[calc(100vh-170px)] md:h-[calc(100vh-126px)] overflow-hidden bg-black"
    >
      {/* ENHANCEMENT: Accessibility feature for screen readers to announce slide changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Slide ${currentSlide + 1} of ${slides.length}: ${currentSlideData.title}`}
      </div>

      <div className="absolute inset-0 z-10 overflow-hidden">
        {/* CHANGE: mode="wait" provides a cleaner transition, preventing overlap. */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentSlideData.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Image with overlay */}
            <div className="absolute inset-0 z-0">
              {/* CHANGE: Using next/image for automatic optimization, AVIF/WebP support, and lazy loading. */}
              <Image
                src={currentSlideData.image}
                alt={currentSlideData.alt}
                fill
                className="object-cover"
                // ENHANCEMENT: Prioritize the first image for faster load times (LCP).
                priority={currentSlide === 0}
                // ENHANCEMENT: Set sizes for better resource loading on different viewports.
                sizes="(max-width: 768px) 100vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
              <div className="container max-w-7xl mx-auto px-4 md:px-8">
                {/* CHANGE: Grouped text content under one motion component for cleaner code and a single animation trigger. */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <h2 className="text-3xl text-center sm:text-left sm:text-5xl md:text-6xl font-bold text-white mb-6">
                    {currentSlideData.title}
                  </h2>
                  <p className="text-lg text-center sm:text-left sm:text-xl text-gray-200 mb-8 max-w-xl">
                    {currentSlideData.description}
                  </p>
                  <div className="flex justify-center sm:justify-start">
                    <Link
                      href={`/${currentSlideData.nav}`}
                      className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-white text-black text-lg font-semibold rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {currentSlideData.cta}
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center z-20">
        <button
          onClick={goToPrevSlide}
         className="p-2 rounded-full bg-[#0d0d0d70] hover:bg-white/20 text-white  transition-all transform hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center z-20">
        <button
          onClick={goToNextSlide}
          className="p-2 rounded-full bg-[#0d0d0d70] hover:bg-white/20 text-white  transition-all transform hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
