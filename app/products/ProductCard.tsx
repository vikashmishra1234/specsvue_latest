"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  price: number;
  discount?: number;
  images?: string[];
  frameMaterial: string;
  frameSize: string;
  brandName: string;
  productId: any;
  reviewCount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  price,
  productId,
  discount = 0,
  images = [],
  frameMaterial,
  frameSize,
  brandName,
  reviewCount = 8,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  // Fixed rating
  const finalRating = 4.5;

  const renderRatingStars = () => {
    const full = Math.floor(finalRating);
    const half = finalRating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <>
        {[...Array(full)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={16}
            className="text-yellow-400 fill-yellow-400"
          />
        ))}
        {half && (
          <div key="half" className="relative">
            <Star size={16} className="text-yellow-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(empty)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} className="text-gray-300" />
        ))}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative">
      {discount > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          {discount}% OFF
        </div>
      )}

      {/* Image */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-auto overflow-hidden bg-gray-100"
      >
        <img
          src={isHovered ? images[1] : images[0]}
          alt={`${brandName} product`}
          className="w-full h-full object-contain transition-transform duration-500 transform hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-2 sm:p-4">
        <div className="mb-2">
          <h3 className="text-sm sm:text-lg capitalize font-semibold text-gray-800">
            {brandName}
          </h3>
          <p className="text-gray-500 capitalize text-sm">
            {frameMaterial} · {frameSize}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {renderRatingStars()}
            <span className="ml-1 text-xs text-gray-500">
              {finalRating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-1 sm:mt-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">
              ₹{Number(price)}
            </span>
          </div>

          <button
            onClick={() => router.push(`/explore/${productId}`)}
            className="bg-black text-[12px] mt-1 cursor-pointer hover:bg-gray-800 text-white font-semibold rounded-full px-4 sm:px-8 py-2 shadow-md hover:shadow-xl transition-all duration-300 tracking-wide sm:text-sm"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
