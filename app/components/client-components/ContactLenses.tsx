"use client";
import React from "react";

export default function ContactLenses() {
  const disposability = ["Monthly", "Day & Night", "Daily", "Yearly", "Bi-weekly"];
  const powers = ["Spherical - (CYL-0.5)", "Spherical + (CYL-0.5)", "Cylindrical Power(>0.75)", "Toric Power"];
  const colors = ["Green", "Blue", "Brown", "Turquoise", "View all colors"];
  const solutions = ["Small", "Large", "View all solutions"];

  return (
    <div className="w-[96%] mx-auto bg-white py-6 px-6">
      <div className="grid grid-cols-4 gap-6">
        {/* Disposability */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">DISPOSABILITY</h3>
          {disposability.map((item, idx) => (
            <p key={idx} className="py-2 px-3 rounded hover:bg-gray-100 text-sm text-gray-700 cursor-pointer">
              {item}
            </p>
          ))}
        </div>

        {/* Power */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">POWER</h3>
          {powers.map((item, idx) => (
            <p key={idx} className="py-2 px-3 rounded hover:bg-gray-100 text-sm text-gray-700 cursor-pointer">
              {item}
            </p>
          ))}
        </div>

        {/* Color */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">COLOR</h3>
          {colors.map((item, idx) => (
            <p key={idx} className="py-2 px-3 rounded hover:bg-gray-100 text-sm text-gray-700 cursor-pointer">
              {item}
            </p>
          ))}
        </div>

        {/* Solution */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">SOLUTION</h3>
          {solutions.map((item, idx) => (
            <p key={idx} className="py-2 px-3 rounded hover:bg-gray-100 text-sm text-gray-700 cursor-pointer">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
