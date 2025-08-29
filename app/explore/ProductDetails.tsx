"use client";
import { IProduct } from "@/models/Product";
import React, { useState } from "react";

interface ProductDetailsProps {
  product: IProduct;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [showAll, setShowAll] = useState(false);

  const filteredEntries = Object.entries(product).filter(
    ([key]) => !["_id", "images", "createdAt", "updatedAt", "__v"].includes(key)
  );

  const visibleEntries = showAll ? filteredEntries : filteredEntries.slice(0, 6);

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Product Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleEntries.map(([key, value]) => (
          <div
            key={key}
            className="bg-gray-50 p-4 rounded-lg border hover:shadow transition-all duration-200"
          >
            <p className="text-sm text-gray-500 font-medium capitalize mb-1">
              {key.replace(/([A-Z])/g, " $1")}
            </p>
            <p className="text-gray-800 capitalize font-semibold break-words">
              {typeof value === "object" ? JSON.stringify(value) : String(value)}
            </p>
          </div>
        ))}
      </div>

      {/* See more / less button */}
      {filteredEntries.length > 6 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:underline font-medium transition"
          >
            {showAll ? "Show Less" : "See More Info"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
