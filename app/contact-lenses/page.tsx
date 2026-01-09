"use client";
import React from "react";
import Link from "next/link";
import { useContactLenses } from "@/actions/fetchContactLenses";

const ContactLensPage = () => {
  const { data: lenses, loading, error } = useContactLenses(100);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-8">
       <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Shop Contact Lenses</h1>
        
        {loading && <div className="text-center py-10">Loading Lenses...</div>}
        {error && <div className="text-center py-10 text-red-500">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!loading && lenses.map((lens) => (
                <Link href={`/contact-lenses/${lens._id}`} key={lens._id} className="group overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                        {lens.images?.[0] ? (
                            <img src={lens.images[0]} alt={lens.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
                        )}
                    </div>
                    <div className="p-4">
                        <div className="text-xs text-blue-600 font-semibold mb-1">{lens.brandName}</div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">{lens.name}</h3>
                        <div className="text-sm text-gray-500 mb-2">{lens.lensType}</div>
                        <div className="flex items-center justify-between mt-2">
                             <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-gray-900">₹{lens.salePrice || lens.price}</span>
                                {lens.salePrice && <span className="text-sm text-gray-400 line-through">₹{lens.price}</span>}
                             </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        
        {!loading && lenses.length === 0 && (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">No contact lenses found</h3>
                <p className="text-gray-500">Check back later for new arrivals.</p>
            </div>
        )}

       </div>
    </div>
  );
};

export default ContactLensPage;
