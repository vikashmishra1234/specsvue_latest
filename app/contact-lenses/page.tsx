"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useContactLenses } from "@/actions/fetchContactLenses";
import Image from "next/image";

const ContactLensPage = () => {
  const { data: lenses, loading, error } = useContactLenses(100);
  const [filterType, setFilterType] = useState("All");

  const filteredLenses = filterType === "All" 
    ? lenses 
    : lenses.filter(lens => lens.lensType === filterType);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
       {/* Hero Banner */}
       <div className="relative w-full h-[250px] md:h-[400px] overflow-hidden">
            <Image 
                src="https://images.unsplash.com/photo-1596489345090-5034c540960a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" // Placeholder or use the generated one if copied
                alt="Contact Lens Banner" 
                fill
                className="object-cover"
                priority
            />
             <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-4">
                 <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm drop-shadow-md">Premium Contact Lenses</h1>
                 <p className="text-white text-lg md:text-xl font-medium drop-shadow-md max-w-2xl">Precision vision, breathable comfort, and vibrant colors for every eye.</p>
             </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
            {["All", "Daily", "Monthly", "Bi-weekly", "Toric"].map(type => (
                <button 
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                        filterType === type 
                        ? "bg-blue-600 text-white shadow-md transform scale-105" 
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>
        
        {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white h-80 rounded-2xl shadow-sm"></div>
                ))}
            </div>
        )}

        {error && <div className="text-center py-10 text-red-500 bg-white rounded-xl shadow p-6">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {!loading && filteredLenses.map((lens) => (
                <Link href={`/contact-lenses/${lens._id}`} key={lens._id} className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                        {lens.images?.[0] ? (
                            <img 
                                src={lens.images[0]} 
                                alt={lens.name} 
                                className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 will-change-transform" 
                            />
                        ) : (
                            <span className="text-gray-400 font-medium">No Image</span>
                        )}
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {lens.salePrice && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">Sale</span>
                            )}
                            {lens.isToric && (
                                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">Toric</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{lens.brandName}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">{lens.name}</h3>
                        
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-medium">{lens.lensType}</span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">{lens.packSize || 'Standard Pack'}</span>
                        </div>

                        <div className="mt-auto flex items-center justify-between border-t pt-4">
                             <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Starting from</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-extrabold text-gray-900">₹{lens.salePrice || lens.price}</span>
                                    {lens.salePrice && <span className="text-sm text-gray-400 line-through">₹{lens.price}</span>}
                                </div>
                             </div>
                             <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center transform translate-x-10 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                             </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        
        {!loading && filteredLenses.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No valid matches found</h3>
                <p className="text-gray-500 max-w-md mx-auto">We couldn't find any contact lenses matching your selection. Try clearing filters or check back later.</p>
                <button onClick={() => setFilterType("All")} className="mt-6 text-blue-600 font-semibold hover:underline">Clear all filters</button>
            </div>
        )}

       </div>
    </div>
  );
};

export default ContactLensPage;
