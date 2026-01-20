"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    subtitle: "Premium Eyewear",
    title: "Vision Meets",
    titleAccent: "Elegance",
    description: "Experience perfect vision with our handcrafted prescription glasses. Save 20% on your first pair – premium lenses and frames designed for your lifestyle.",
    image: "/images/banner-3.png",
    cta: "Discover Collection",
    href: "/products",
    gradient: "from-[#0a4d68] via-[#1a7a8f] to-[#2b9eb3]"
  },
  {
    id: 2,
    subtitle: "New Collection",
    title: "Timeless",
    titleAccent: "Sunglasses",
    description: "Protect your eyes with premium UV400 protection. Handpicked designs that blend sophistication with cutting-edge lens technology.",
    image: "/images/banner-4.png",
    cta: "Explore Shades",
    href: "/products",
    gradient: "from-[#1e3a5f] via-[#2d5a7b] to-[#3c7a9c]"
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[calc(100vh-80px)] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}>
            {/* Animated gradient orbs */}
            <div className="absolute top-[10%] right-[-100px] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-[20%] left-[-100px] w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
            
            {/* Radial overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>
          </div>

          {/* Image Layer (Optional - if you want to keep background images) */}
          {slide.image && (
            <div className="absolute inset-0 opacity-20">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Layer */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div 
                  className={`transition-all duration-1000 delay-300 transform ${
                    index === current ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                  }`}
                >
                  {/* Badge */}
                  <div className="inline-block mb-8">
                    <span className="inline-flex items-center px-6 py-2.5 border border-white/20 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-white/90 bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all hover:-translate-y-0.5">
                      {slide.subtitle}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-7 leading-[1.1] tracking-tight">
                    <span className="block font-serif">{slide.title}</span>
                    <span className="block italic bg-gradient-to-r from-[#ffd700] via-[#ffed4e] to-[#ffd700] bg-clip-text text-transparent font-serif">
                      {slide.titleAccent}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-xl font-light">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <a
                    href={slide.href}
                    className="group inline-flex items-center gap-3 bg-white text-[#0a4d68] px-10 py-4 rounded-full font-semibold text-base hover:bg-[#ffd700] transition-all duration-400 hover:scale-105 hover:shadow-2xl shadow-lg"
                  >
                    {slide.cta}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>

                {/* Right Visual Element */}
                <div 
                  className={`hidden md:flex items-center justify-center transition-all duration-1000 delay-500 transform ${
                    index === current ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                  }`}
                >
                  <div className="relative w-full max-w-md aspect-square">
                    {/* Decorative circles */}
                    <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-pulse-slow"></div>
                    <div className="absolute inset-8 border-2 border-white/10 rounded-full animate-pulse-slower"></div>
                    
                    {/* Center element */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                        <svg className="w-32 h-32 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === current ? "w-12 bg-white" : "w-8 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Arrow Controls */}
      <button 
        onClick={prev} 
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={next} 
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }

        @keyframes pulse-slower {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.08); opacity: 0.4; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
        }
      `}</style>
    </section>
  );
}