"use client"
import Image from "next/image";
import React, { useState } from "react";

interface Images{
  images:string[];
}
const ImagesPart:React.FC<Images> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || "");

  return (
    <div className="w-full">
      {/* Main Featured Image */}
      <div className="mb-6 rounded-xl bg-white p-4 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-96 transition-all duration-300 hover:scale-105">
          <Image 
            src={selectedImage} 
            alt="Product featured view" 
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div 
            key={index}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
              selectedImage === imageUrl ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setSelectedImage(imageUrl)}
          >
            <div className="relative pt-[100%]"> {/* Maintain aspect ratio */}
              <Image 
                src={imageUrl} 
                alt={`Product view ${index + 1}`}
                fill
                className="object-cover p-2"
              />
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default ImagesPart;