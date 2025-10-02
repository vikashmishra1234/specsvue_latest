"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Get 20% Off on Eyewear with Prescription",
    description:
      "Unlock 20% off on your next pair of eyeglasses when you upload your prescription at VisionHub. Enjoy clear vision with stylish frames, unmatched comfort, and expert-recommended lenses — all at a discounted price.",
    image: "/images/banner-3.png",
    cta: "Save 20% Now",
    alt: "Collection of premium prescription glasses frames",
    nav: "prescription",
  },
  {
    id: 2,
    title: "SpecsVue – Redefining Eyewear Fashion",
    description:
      "Discover premium spectacles and sunglasses at SpecsVue.in – where style, clarity, and comfort come together. From modern trends to timeless classics, find eyewear that enhances your look and vision.",
    image: "/images/banner-4.png",
    cta: "Shop Eyewear Now",
    alt: "SpecsVue eyewear store showcasing stylish spectacles and sunglasses",
    nav: "products",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNextSlide, 6000);
    return () => clearInterval(timer);
  }, [goToNextSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <section
      aria-label="Featured Eyewear Promotions"
      className="relative w-full h-[calc(100vh-170px)] md:h-[calc(100vh-126px)] overflow-hidden bg-black"
    >
      {/* Screen reader updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Slide ${currentSlide + 1} of ${slides.length}: ${currentSlideData.title}`}
      </div>

      <div className="absolute inset-0 z-10 overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentSlideData.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={currentSlideData.image}
                alt={currentSlideData.alt}
                fill
                priority={currentSlide === 0}
                sizes="(max-width: 768px) 100vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
              <div className="container max-w-7xl mx-auto px-4 md:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                  className="max-w-3xl"
                >
                  {/* Use H1 only once per page; make this H2 if another H1 exists */}
                  <h1 className="text-3xl text-center sm:text-left sm:text-5xl md:text-6xl font-bold text-white mb-6">
                    {currentSlideData.title}
                  </h1>

                  <p className="text-lg text-center sm:text-left sm:text-xl text-gray-200 mb-8 max-w-xl">
                    {currentSlideData.description}
                  </p>

                  <div className="flex justify-center sm:justify-start">
                    <Link
                      href={`/${currentSlideData.nav}`}
                      prefetch={true}
                      aria-label={`Go to ${currentSlideData.nav} page`}
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

      {/* Prev Button */}
      <div className="absolute inset-y-0 left-4 flex items-center z-20">
        <button
          onClick={goToPrevSlide}
          className="p-2 rounded-full bg-[#0d0d0d70] hover:bg-white/20 text-white transition-all transform hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={32} />
        </button>
      </div>

      {/* Next Button */}
      <div className="absolute inset-y-0 right-4 flex items-center z-20">
        <button
          onClick={goToNextSlide}
          className="p-2 rounded-full bg-[#0d0d0d70] hover:bg-white/20 text-white transition-all transform hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
