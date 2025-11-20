"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ContactLens {
  _id: string;
  name: string;
  brand: string;
  price: number;
  images:any;
  disposability: string;
  type: string;
}

export default function ContactLensPage() {
  const [products, setProducts] = useState<ContactLens[]>([]);
  const [filters, setFilters] = useState({
    brand: "",
    disposability: "",
    type: "",
    prescriptionType: "",
    color: "",
    min: "",
    max: "",
    sort: "",
  });

  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    const params = new URLSearchParams(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    const res = await axios.get(`/api/get-contact-lens?${params}`);
    setProducts(res.data.products);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [filters]);

  function updateFilter(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex max-w-7xl mx-auto p-4 gap-5">

      {/* SIDEBAR FILTERS */}
      <aside className="w-64 border rounded-lg p-4 space-y-3 sticky top-4 h-fit">
        <h2 className="font-semibold text-lg">Filters</h2>

        <select className="input" onChange={(e) => updateFilter("brand", e.target.value)}>
          <option value="">Brand</option>
          <option value="Bausch & Lomb">Bausch & Lomb</option>
          <option value="Acuvue">Acuvue</option>
          <option value="Alcon">Alcon</option>
        </select>

        <select className="input" onChange={(e) => updateFilter("disposability", e.target.value)}>
          <option value="">Disposability</option>
          <option value="Daily Disposable">Daily Disposable</option>
          <option value="Monthly Disposable">Monthly Disposable</option>
        </select>

        <select className="input" onChange={(e) => updateFilter("type", e.target.value)}>
          <option value="">Lens Type</option>
          <option value="Spherical">Spherical</option>
          <option value="Toric">Toric</option>
        </select>

        <select className="input" onChange={(e) => updateFilter("prescriptionType", e.target.value)}>
          <option value="">Prescription</option>
          <option value="Power">Power</option>
          <option value="Zero Power">Zero Power</option>
          <option value="Both">Both</option>
        </select>

        <input
          placeholder="Color"
          className="input"
          onChange={(e) => updateFilter("color", e.target.value)}
        />

        <div>
          <p className="font-medium">Price Range</p>
          <input type="number" placeholder="Min ₹" className="input" onChange={(e) => updateFilter("min", e.target.value)} />
          <input type="number" placeholder="Max ₹" className="input" onChange={(e) => updateFilter("max", e.target.value)} />
        </div>

        <div>
          <p className="font-medium">Sort by</p>
          <select className="input" onChange={(e) => updateFilter("sort", e.target.value)}>
            <option value="">Default</option>
            <option value="price">Price Low → High</option>
            <option value="-price">Price High → Low</option>
            <option value="-rating.avg">Top Rated</option>
            <option value="-createdAt">Newest</option>
          </select>
        </div>

        <button
          className="w-full bg-gray-300 rounded p-2"
          onClick={() => setFilters({
            brand: "",
            disposability: "",
            type: "",
            prescriptionType: "",
            color: "",
            min: "",
            max: "",
            sort: "",
          })}
        >
          Clear Filters
        </button>
      </aside>

      {/* PRODUCT GRID */}
      <div className="flex-1">
        {loading && <p>Loading...</p>}

        {!loading && products.length === 0 && (
          <p className="text-gray-500">No lenses found</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link href={`contact-lenses/${p._id}`} key={p._id} className="border rounded-lg p-3 hover:shadow">
              <Image
                src={p.images?.[0]}
                height={100}
                width={100}
                className="w-full h-32 object-cover rounded"
                alt={p.name}
              />
              <h3 className="font-semibold mt-2 text-sm">{p.name}</h3>
              <p className="text-xs text-gray-600">{p.brand}</p>
              <p className="text-blue-600 font-semibold">₹{p.price}</p>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-top: 5px;
        }
        .input:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
