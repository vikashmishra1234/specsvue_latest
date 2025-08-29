"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const categoriesData = [
  {
    category: "Men",
    image: "/images/men-logo.png",
    frameShapes: ["Rectangle Frames", "Wayfarer Frames", "Geometric Frames", "Round Frames", "Aviator Frames", "Cat-Eye Frames"]
  },
  {
    category: "Women",
    image:  "/images/women-logo.png",
    frameShapes: ["Aviator Frames", "Cat-Eye Frames"]
  },
  {
    category: "Kids",
    image:  "/images/kids-logo.png",
    frameShapes: ["Halfrim Frames", "Geometric Frames"]
  },
];

const EyeglassesCategory = () => {
  const [mounted, setMounted] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentCategory = categoriesData[activeCategoryIndex];

  if (!mounted) {
    return <div className="absolute z-50 left-0 w-full bg-white shadow-lg rounded-b-lg"></div>;
  }

  return (
    <div className="absolute z-50 left-0 w-full bg-white shadow-lg rounded-b-lg">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b flex justify-between items-center">
        <h2 className="font-bold text-gray-800">Eyeglasses Menu</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden p-4">
          {categoriesData.map((categoryItem, index) => (
            <div
              key={categoryItem.category}
              className={`flex items-center gap-4 py-4 px-3 rounded-lg mb-2 ${activeCategoryIndex === index ? "bg-blue-50 border-l-4 border-blue-500" : "border-l-4 border-transparent"}`}
              onClick={() => setActiveCategoryIndex(index)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                <img
                  src={categoryItem.image}
                  alt={categoryItem.category}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h4 className="text-md font-medium text-gray-800">{categoryItem.category}</h4>
                <p className="text-xs text-gray-500">
                  {categoryItem.frameShapes.length} frame shapes
                </p>
              </div>
            </div>
          ))}

          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-2 uppercase text-sm">Frame Shapes</h4>
            <div className="grid grid-cols-2 gap-2">
              {currentCategory.frameShapes.map((frame) => (
                <Link
                  key={frame}
                  href={`/products?category=${currentCategory.category}&frameShape=${frame}`}
                  className="py-2 px-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  {frame}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop */}
      <div className="hidden md:block p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-4 uppercase text-sm tracking-wider">Select Category</h3>
            {categoriesData.map((categoryItem, index) => (
              <div
                key={categoryItem.category}
                className={`flex items-center gap-4 py-3 px-4 rounded-lg mb-2 transition-all duration-200 ${activeCategoryIndex === index ? "bg-blue-50 shadow-sm border-l-4 border-blue-500" : "hover:bg-gray-50 border-l-4 border-transparent"} cursor-pointer`}
                onMouseEnter={() => setActiveCategoryIndex(index)}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
                  <img
                    src={categoryItem.image}
                    alt={categoryItem.category}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="text-md font-medium text-gray-800">{categoryItem.category}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {categoryItem.frameShapes.length} frame shapes
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-4 uppercase text-sm tracking-wider">Frame Shapes</h3>
            <div className="grid grid-cols-2 gap-3">
              {currentCategory.frameShapes.map((frame) => (
                <Link
                  key={frame}
                  href={`/products?category=${currentCategory.category}&frameShape=${frame}`}
                  className="py-2 px-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  {frame}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EyeglassesCategory;
