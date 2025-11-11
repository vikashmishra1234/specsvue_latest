"use client";
import React, { useState } from "react";
import { Eye, MoveLeft, MoveRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  price: number;
  discount?: number;
  images?: string[];
  frameMaterial: string;
  frameSize: string;
  brandName: string;
  productId: any;
  stock:string;
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
  stock,
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
            size={13}
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
    <div onClick={() => {
       Number(stock)<=0?'':router.push(`/explore/${productId}`);

      }}  className="bg-white cursor-pointer w-[150px] md:w-[180px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative">
      {discount > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
          {discount}% OFF
        </div>
      )}

      {/* Image */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-[110px] p-1 overflow-hidden bg-gray-100"
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
          <h3 className="text-sm capitalize font-semibold text-gray-800">
            {brandName}
          </h3>
          <p className="text-gray-500 capitalize text-xs mt-1">
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


          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-gray-500">
              {
                Number(stock)<=0?<span className="text-red-500 ">out of stock</span>:<span>Stock: {stock}</span>
              }
             
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-gray-800">
              ₹{Number(price)}
            </span>
           <MoveRight  onClick={() => router.push(`/explore/${productId}`)} cursor={'pointer'} />
          </div>

        
      </div>
    </div>
  );
};

export default ProductCard;
