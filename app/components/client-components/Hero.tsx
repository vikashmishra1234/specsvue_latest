"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: 1,
    subtitle: "Premium Eyewear",
    title: "See the World Clearly",
    description: "Get 20% off on your first prescription glasses. Premium lenses included.",
    image: "/images/banner-3.png",
    cta: "Shop Eyeglasses",
    href: "/products",
    align: "left"
  },
  {
    id: 2,
    subtitle: "New Collection",
    title: "Timeless Sunglasses",
    description: "Protect your eyes with style. UV400 protection in every pair.",
    image: "/images/banner-4.png",
    cta: "Explore Shades",
    href: "/products",
    align: "left"
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black text-white">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
            {/* Image Layer */}
            <div className="absolute inset-0">
                <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0} // Only priority load the first one
                    className="object-cover opacity-90"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/40"></div> {/* Dark Overlay */}
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div 
                        className={`max-w-xl transition-all duration-1000 delay-300 transform ${
                            index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                        } ${slide.align === 'right' ? 'ml-auto text-right' : 'text-left'}`}
                    >
                        <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider mb-4 bg-white/10 backdrop-blur-md">
                            {slide.subtitle}
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            {slide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                            {slide.description}
                        </p>
                        
                        <div className={`flex ${slide.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                             <Link
                                href={slide.href}
                                className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105"
                             >
                                {slide.cta}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                             </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ))}

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
            />
        ))}
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-colors">
        <ChevronLeft size={40} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-colors">
        <ChevronRight size={40} />
      </button>

    </section>
  );
};

export default Hero;
