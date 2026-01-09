"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ContactLensList() {
  const [lenses, setLenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLenses();
  }, []);

  const fetchLenses = async () => {
    try {
      const res = await axios.get("/api/get-contact-lenses?limit=100");
      if (res.data.success) {
        setLenses(res.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch lenses", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Lenses</h1>
        <Link href="/admin/contact-lenses/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add New
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Image</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Brand</th>
                <th className="py-2 px-4 border-b text-left">Type</th>
                <th className="py-2 px-4 border-b text-left">Price</th>
                <th className="py-2 px-4 border-b text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {lenses.map((lens) => (
                <tr key={lens._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {lens.images?.[0] && (
                        <img src={lens.images[0]} alt={lens.name} className="w-12 h-12 object-cover rounded" />
                    )}
                  </td>
                  <td className="py-2 px-4 border-b font-medium">{lens.name}</td>
                  <td className="py-2 px-4 border-b">{lens.brandName}</td>
                  <td className="py-2 px-4 border-b">{lens.lensType}</td>
                  <td className="py-2 px-4 border-b">₹{lens.price}</td>
                  <td className="py-2 px-4 border-b">{lens.stock}</td>
                </tr>
              ))}
              {lenses.length === 0 && (
                  <tr>
                      <td colSpan={6} className="text-center py-4">No contact lenses found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
