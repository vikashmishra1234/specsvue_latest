import React from "react";
import Link from "next/link";

const RelatedProductsCTA = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6 text-center rounded-2xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Explore Products</h2>
      <p className="text-lg mb-6 text-blue-100">
        Discover our range of handpicked items just for you.
      </p>
      <Link href="/products">
        <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition-all duration-300">
          Start Shopping Now →
        </button>
      </Link>
    </div>
  );
};

export default RelatedProductsCTA;
