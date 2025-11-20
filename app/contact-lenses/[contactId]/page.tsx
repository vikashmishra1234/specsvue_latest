"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import LensImageGallery from "../LensImageGallery";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  images: string[];
  spherePower: number[]; // SPH OPTIONS
  boxes: number[];
}

export default function ContactLensPage() {
  const { contactId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  const [rightSPH, setRightSPH] = useState("");
  const [leftSPH, setLeftSPH] = useState("");
  const [boxCount, setBoxCount] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
   

    axios
      .get(`/api/contact-lens/${contactId}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);
       
      });
  }, [contactId]);

  const handleBuy = async (contactLensId: string,productPrice:number) => {
    if (!rightSPH || !leftSPH || !boxCount) {
      Swal.fire(
        "Missing Information",
        "Please choose power and boxes",
        "error"
      );
      return;
    }
    const userId = session?.user.userId || localStorage.getItem("guestId");
    const data = {
      userId,
      rightSPH,
      leftSPH,
      boxCount,
      contactLensId,
      productPrice
    };
    await axios.post(`/api/contactlens-cart`, data);
    // console.log(rightSPH,leftSPH,boxCount)
  };

  if (!product) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 p-5">
      {/* LEFT - IMAGES */}
      <LensImageGallery images={product.images} />

      {/* RIGHT - DETAILS */}
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-gray-700">{product.brand}</p>
        <p className="text-3xl text-blue-600 mt-3">₹{product.price}</p>

        <h2 className="mt-6 font-semibold">Select Lens Power</h2>

        {/* RIGHT EYE */}
        <label className="block mt-3 font-medium">Right Eye Power (SPH)</label>
        <select
          className="border w-full p-2"
          value={rightSPH}
          onChange={(e) => setRightSPH(e.target.value)}
        >
          <option value="">Please Select</option>
          <option value="-0.5">-0.5</option>
          <option value="-0.75">-0.75</option>
        </select>

        {/* LEFT EYE */}
        <label className="block mt-3 font-medium">Left Eye Power (SPH)</label>
        <select
          className="border w-full p-2"
          value={leftSPH}
          onChange={(e) => setLeftSPH(e.target.value)}
        >
          <option value="">Please Select</option>
          <option value="-0.5">-0.5</option>
          <option value="-0.75">-0.75</option>
        </select>

        {/* NUMBER OF BOXES */}
        <label className="block mt-3 font-medium">No. of Boxes</label>
        <select
          className="border w-full p-2"
          value={boxCount}
          onChange={(e) => setBoxCount(e.target.value)}
        >
          <option value="">Please Select</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>

        <button
          onClick={() => handleBuy(product._id,product.price)}
          className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded w-full"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
