"use client";

import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { X } from "lucide-react";

export default function AddContactLensPage() {
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
    lensType: "Monthly",
    material: "",
    waterContent: "",
    packSize: "",
    powerMin: "-12.00",
    powerMax: "6.00",
    powerStep: "0.25",
    isToric: false,
    cylinderMin: "-2.25",
    cylinderMax: "-0.75",
    cylinderStep: "0.50",
    axisMin: "10",
    axisMax: "180",
    axisStep: "10",
  });

  // Array fields handling (comma separated for input)
  const [arrayInputs, setArrayInputs] = useState({
     baseCurve: "8.6",
     diameter: "14.2",
     colors: "",
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [featureImages, setFeatureImages] = useState<FileList | null>(null); // For Carousel
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Previews
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [featurePreviewUrls, setFeaturePreviewUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setArrayInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isFeature = false) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));

      if (isFeature) {
          setFeatureImages(e.target.files);
          setFeaturePreviewUrls(urls);
      } else {
          setImages(e.target.files);
          setPreviewUrls(urls);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      
      // Append regular fields
      Object.entries(formData).forEach(([key, value]) => {
          data.append(key, String(value));
      });

      // Append array fields
      Object.entries(arrayInputs).forEach(([key, value]) => {
          data.append(key, value);
      });

      if (images) {
        Array.from(images).forEach((file) => data.append("images", file));
      }
      if (featureImages) {
        Array.from(featureImages).forEach((file) => data.append("featureImages", file));
      }

      const res = await axios.post("/api/admin/contact-lens", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        Swal.fire({
          title: "Contact Lens Added!",
          icon: "success",
        });
        // Reset form (simplified)
        setImages(null);
        setFeatureImages(null);
        setPreviewUrls([]);
        setFeaturePreviewUrls([]);
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.error || "Failed to add product",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">Add New Contact Lens</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Basic Info */}
        <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">Basic Information</h3>
        </div>

        <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="brandName" placeholder="Brand Name" onChange={handleChange} required className="border p-2 rounded" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="border p-2 rounded col-span-1 md:col-span-2 h-24" />
        
        <div className="flex gap-2">
            <input type="number" name="price" placeholder="Price" onChange={handleChange} required className="border p-2 rounded w-full" />
            <input type="number" name="salePrice" placeholder="Sale Price (Optional)" onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <input type="number" name="stock" placeholder="Stock Quantity" onChange={handleChange} required className="border p-2 rounded" />
        <input type="text" name="packSize" placeholder="Pack Size (e.g. 30 lenses/box)" onChange={handleChange} className="border p-2 rounded" />

        {/* Lens Details */}
        <div className="col-span-1 md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">Lens Specifications</h3>
        </div>
        
        <select name="lensType" onChange={handleChange} className="border p-2 rounded">
            <option value="Daily">Daily</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
        </select>

        <input type="text" name="material" placeholder="Material (e.g. Silicone Hydrogel)" onChange={handleChange} className="border p-2 rounded" />
        <input type="text" name="waterContent" placeholder="Water Content (e.g. 58%)" onChange={handleChange} className="border p-2 rounded" />
        
        <input type="text" name="baseCurve" value={arrayInputs.baseCurve} placeholder="Base Curves (comma separated, e.g. 8.6, 9.0)" onChange={handleArrayChange} required className="border p-2 rounded" />
        <input type="text" name="diameter" value={arrayInputs.diameter} placeholder="Diameters (comma separated, e.g. 14.0, 14.2)" onChange={handleArrayChange} required className="border p-2 rounded" />
        <input type="text" name="colors" value={arrayInputs.colors} placeholder="Available Colors (comma separated)" onChange={handleArrayChange} className="border p-2 rounded" />

        {/* Prescription Range */}
        <div className="col-span-1 md:col-span-2 mt-4">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">Prescription Range</h3>
        </div>
        <div className="flex gap-2">
            <input type="number" step="0.01" name="powerMin" placeholder="Min Power (-12.00)" onChange={handleChange} required className="border p-2 rounded w-1/3" />
            <input type="number" step="0.01" name="powerMax" placeholder="Max Power (6.00)" onChange={handleChange} required className="border p-2 rounded w-1/3" />
            <input type="number" step="0.01" name="powerStep" placeholder="Step (0.25)" onChange={handleChange} required className="border p-2 rounded w-1/3" />
        </div>

        {/* Toric Options */}
        <div className="col-span-1 md:col-span-2 mt-4 flex items-center gap-2">
            <input type="checkbox" name="isToric" id="isToric" onChange={handleChange} className="w-4 h-4" />
            <label htmlFor="isToric" className="font-semibold">Is Toric (Astigmatism)?</label>
        </div>

        {formData.isToric && (
            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border">
                 <div className="col-span-2 font-medium">Cylinder</div>
                 <input type="number" step="0.01" name="cylinderMin" placeholder="Min Cylinder" onChange={handleChange} className="border p-2 rounded" />
                 <input type="number" step="0.01" name="cylinderMax" placeholder="Max Cylinder" onChange={handleChange} className="border p-2 rounded" />
                 
                 <div className="col-span-2 font-medium">Axis</div>
                 <input type="number" name="axisMin" placeholder="Min Axis" onChange={handleChange} className="border p-2 rounded" />
                 <input type="number" name="axisMax" placeholder="Max Axis" onChange={handleChange} className="border p-2 rounded" />
            </div>
        )}

        {/* Images */}
        <div className="col-span-1 md:col-span-2 mt-4">
            <label className="block font-medium mb-1">Product Images</label>
            <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, false)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            <div className="flex gap-2 mt-2 overflow-x-auto">
                {previewUrls.map((url, i) => (
                    <img key={i} src={url} alt={`preview-${i}`} className="h-20 w-20 object-cover rounded border" />
                ))}
            </div>
        </div>

        <div className="col-span-1 md:col-span-2">
             <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400">
                {loading ? "Saving..." : "Add Contact Lens"}
             </button>
        </div>

      </form>
    </div>
  );
}
