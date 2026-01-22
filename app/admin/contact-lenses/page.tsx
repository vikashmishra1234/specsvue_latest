"use client";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import AddContactLensForm from "./AddContactLensForm";
import { Edit2, Trash2, Plus, RefreshCw, Package as PackageIcon } from "lucide-react";

export default function ContactLensList() {
  const [lenses, setLenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'add'>('list');
  const [editingLens, setEditingLens] = useState<any>(null);

  useEffect(() => {
    if (view === 'list') {
        fetchLenses();
        setEditingLens(null);
    }
  }, [view]);

  const fetchLenses = async () => {
    setLoading(true);
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

  const handleDelete = async (id: string, name: string) => {
      const result = await Swal.fire({
          title: "Delete Product?",
          text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#EF4444",
          cancelButtonColor: "#3B82F6",
          confirmButtonText: "Yes, delete it",
          background: '#fff',
          customClass: {
            popup: 'rounded-2xl',
            title: 'font-bold text-gray-800'
          }
      });

      if (result.isConfirmed) {
          try {
              await axios.delete(`/api/admin/contact-lens?id=${id}`);
              Swal.fire({
                  title: "Deleted!",
                  text: "Product has been removed.",
                  icon: "success",
                  timer: 2000,
                  showConfirmButton: false
              });
              fetchLenses();
          } catch (error) {
              Swal.fire("Error!", "Failed to delete.", "error");
          }
      }
  };

  const handleEdit = (lens: any) => {
      setEditingLens(lens);
      setView('add');
  };

  if (view === 'add') {
      return <AddContactLensForm onBack={() => setView('list')} initialData={editingLens} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Contact Lenses</h1>
                <p className="text-gray-500 mt-1">Manage your contact lens inventory</p>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={fetchLenses}
                    className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                    title="Refresh List"
                >
                    <RefreshCw size={20} />
                </button>
                <button 
                    onClick={() => { setEditingLens(null); setView('add'); }}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 font-medium"
                >
                    <Plus size={20} />
                    Add New Product
                </button>
            </div>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading inventory...</p>
            </div>
        ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="py-4 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {lenses.map((lens) => (
                    <tr key={lens._id} className="group hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                    {lens.images?.[0] ? (
                                        <img src={lens.images[0]} alt={lens.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lens.name}</p>
                                    <p className="text-xs text-gray-500">{lens.brandName}</p>
                                </div>
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {lens.lensType}
                            </span>
                        </td>
                        <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">₹{lens.price}</div>
                            {lens.salePrice && <div className="text-xs text-green-600 font-medium">{Math.round(((lens.price - lens.salePrice)/lens.price)*100)}% Off</div>}
                        </td>
                        <td className="py-4 px-6">
                            <div className={`flex items-center gap-2 ${lens.stock > 10 ? 'text-green-600' : 'text-orange-500'}`}>
                                <div className={`w-2 h-2 rounded-full ${lens.stock > 0 ? (lens.stock > 10 ? 'bg-green-500' : 'bg-orange-500') : 'bg-red-500'}`}></div>
                                <span className="font-medium">{lens.stock} In Stock</span>
                            </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleEdit(lens)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    title="Edit Product"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(lens._id, lens.name)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Delete Product"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    ))}
                    {lenses.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-20">
                                <div className="flex flex-col items-center text-gray-400">
                                    <CustomPackageIcon size={48} className="mb-4 opacity-20" />
                                    <p className="text-lg font-medium text-gray-900">No contact lenses found</p>
                                    <p className="text-sm mt-1">Add your first product to get started</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>
        )}
      </div>
    </div>
  );
}

// Helper icon
const CustomPackageIcon = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22v-9"/></svg>
)
