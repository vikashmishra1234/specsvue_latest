"use client";
import { useState } from "react";
import Image from "next/image";

export default function LensImageGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <Image
        src={images[active]}
        width={500}
        height={300}
        alt="Lens Image"
        className="rounded-lg w-full"
      />

      <div className="flex gap-3 mt-3">
        {images.map((img, idx) => (
          <Image
            key={idx}
            width={70}
            height={70}
            src={img}
            alt=""
            onClick={() => setActive(idx)}
            className={`rounded cursor-pointer border ${
              active === idx ? "border-blue-600" : "border-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
