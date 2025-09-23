import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <Image
        src="/images/Contact_Lens.jpg"
        alt="Contact Lens Banner"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
      <div className="mb-28">

        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg animate-pulse">
           Page Under Construction 
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-md">
          We’re working hard to bring something amazing. Stay tuned!
        </p>
      </div>
      </div>
    </div>
  );
};

export default Page;
