"use client";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const CategorySplit = () => {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-center mb-6 md:mb-10 text-gray-900">Shop by Category</h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          
          {/* Eyeglasses Card */}
          <Link href="/products" className="group relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            {/* Optimized Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/Eye_Glasses.avif"
                    alt="Eyeglasses Collection"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 p-5 md:p-8 w-full z-10">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-bold rounded-full mb-2 md:mb-3 uppercase tracking-wider">
                    Most Popular
                </span>
                <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-1 md:mb-2">Eyeglasses</h3>
                <p className="text-gray-200 mb-3 md:mb-6 max-w-sm text-sm md:text-base line-clamp-2 md:line-clamp-none">
                    Discover premium frames with prescription lenses. From classic to contemporary styles.
                </p>
                <div 
                    className="flex items-center gap-2 text-white font-semibold text-sm md:text-base group-hover:text-blue-200 transition-colors"
                >
                    Explore Collection <ArrowRight size={16} className="md:w-5 md:h-5" />
                </div>
            </div>
          </Link>

          {/* Contact Lenses Card */}
          <Link href="/contact-lenses" className="group relative h-[250px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
             <div className="absolute inset-0">
                <Image
                    src="/images/Contact_Lenses.avif"
                    alt="Contact Lenses Collection"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

            <div className="absolute bottom-0 left-0 p-5 md:p-8 w-full z-10">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-bold rounded-full mb-2 md:mb-3 uppercase tracking-wider">
                    Daily Comfort
                </span>
                <h3 className="text-2xl md:text-3xl font-bold font-serif text-white mb-1 md:mb-2">Contact Lenses</h3>
                <p className="text-gray-200 mb-3 md:mb-6 max-w-sm text-sm md:text-base line-clamp-2 md:line-clamp-none">
                     Experience freedom with our range of daily, weekly, and monthly contact lenses.
                </p>
                 <div 
                    className="flex items-center gap-2 text-white font-semibold text-sm md:text-base group-hover:text-green-200 transition-colors"
                >
                    Shop Lenses <ArrowRight size={16} className="md:w-5 md:h-5" />
                </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default CategorySplit;
