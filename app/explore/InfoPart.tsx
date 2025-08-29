"use client";
import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Product";
import LensSelector from "./LensSelector"; // 👈 Import this

interface Data {
  data: any;
}

const InfoPart: React.FC<Data> = ({ data }) => {
  const [showLensSelector, setShowLensSelector] = useState(false);



  return (
    <>
      <div className="w-full max-w-2xl mx-auto border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold capitalize text-gray-800 mb-4">
            {data.frameColor} {data.frameType} {data.frameShape}
          </h2>

          {/* Frame Info */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
              Size: {data.frameSize}
            </span>
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
              Frame+Lens
            </span>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-3 mb-2">
              <del className="text-gray-400 text-lg">₹{data.price}</del>
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full animate-pulse">
                {data.discount}% OFF
              </span>
            </div>
            <div className="text-3xl font-extrabold text-black">
            ₹{data.price}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              className="w-full py-4 bg-gray-700 hover:bg-black cursor-pointer text-white font-bold rounded-xl transition"
              onClick={() => setShowLensSelector(true)}
            >
             Buy Now
            </button>
            {/* <button disabled={true} className="w-full py-4 bg-gradient-to-r from-gray-500 to-gray-800 text-white font-bold rounded-xl">
              Try On 3D
            </button> */}
          </div>
        </div>
      </div>

      {/* Slide-in Lens Selector */}
      {showLensSelector && <LensSelector  data = {data} onClose={() => setShowLensSelector(false)} />}
    </>
  );
};

export default InfoPart;
