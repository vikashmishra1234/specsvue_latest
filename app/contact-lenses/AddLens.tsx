"use client";
import axios from "axios";
import Swal from "sweetalert2";
import { useState, useRef } from "react";

export default function AddContactLensPage() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setImages((prev) => [...prev, ...filesArray]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (images.length === 0) {
      return Swal.fire({
        icon: "error",
        title: "No images",
        text: "Please select at least 1 image!",
      });
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await axios.post("/api/contact-lens", formData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Contact lens added successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      setImages([]);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: error?.response?.data?.error || "Something went wrong",
      });
    }

    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Contact Lens</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Name" className="input" required />
        <input name="brand" placeholder="Brand" className="input" required />

        <select name="disposability" className="input">
          <option>Daily Disposable</option>
          <option>Monthly Disposable</option>
          <option>Weekly Disposable</option>
          <option>Yearly Disposable</option>
        </select>

        <select name="type" className="input">
          <option>Spherical</option>
          <option>Toric</option>
          <option>Multifocal</option>
          <option>Cosmetic</option>
          <option>Color</option>
          <option>Plano</option>
        </select>

        <input name="color" placeholder="Color" className="input" />
        <input name="collections" placeholder="Collections" className="input" />
        <textarea name="description" placeholder="Description" className="input" />

        <input name="price" type="number" placeholder="Price" className="input" required />
        <input name="lensesPerBox" type="number" placeholder="Lenses Per Box" className="input" required />

        <select name="prescriptionType" className="input">
          <option>Power</option>
          <option>Zero Power</option>
          <option>Both</option>
        </select>

        <input name="stock" type="number" placeholder="Stock" className="input" required />

        {/* IMAGE INPUT */}
        <label className="block font-medium">Images:</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="input"
        />

        {/* IMAGE PREVIEW */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                  onClick={() => removeImage(index)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded mt-3"
        >
          {loading ? "Uploading..." : "Add Contact Lens"}
        </button>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}
