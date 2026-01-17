"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Edit,
  Trash2,
  Eye,
  Package,
  IndianRupee,
  Tag,
  Users,
  Palette,
  Layers2,
  Search,
  Loader2,
  Plus
} from "lucide-react";
import { deleteProduct } from "@/actions/deleteProduct";
import getAllProducts from "@/actions/getAllProducts";
import Swal from "sweetalert2";
import ProductEditForm from "./ProductEditForm";
import ProductForm from "../ProductForm";

// Define the Product Interface (adjust if you have a global type)
interface ProductType {
  _id: string;
  brandName: string;
  collection: string;
  frameType: string;
  frameShape: string;
  gender: string;
  frameColor: string;
  stock: number;
  price: number;
  discount: string;
  modelNumber: string;
  condition: string;
  frameSize: string;
  frameMaterial: string;
  frameStyle: string;
  frameWidth: string;
  height: string;
  prescriptionType: string;
  productWarranty: string;
  weight: string;
  templeColor: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductsProps {
  initialProducts: ProductType[];
}

const Products = ({ initialProducts }: ProductsProps) => {
  const [products, setProducts] = useState<ProductType[]>(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Modal & Form States
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [productToBeUpdate, setProductToBeUpdate] = useState<ProductType | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Debounced Search Handler
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Only fetch if searchTerm changed (avoid initial double fetch if empty)
      // Reset page to 1 on search
      fetchProducts(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchProducts = async (pageNum: number, search: string, isLoadMore = false) => {
    if (isLoadMore) {
        setLoadingMore(true);
    } else {
        setLoading(true);
    }

    try {
        const res = await getAllProducts({ page: pageNum, limit: 12, search });
        if (res.success && res.data) {
            if (isLoadMore) {
                setProducts(prev => [...prev, ...res.data]);
            } else {
                setProducts(res.data);
            }
            setHasMore(res.pagination?.hasMore || false);
            setPage(pageNum);
        }
    } catch (error) {
        console.error("Failed to fetch products", error);
    } finally {
        setLoading(false);
        setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    fetchProducts(nextPage, searchTerm, true);
  };

  const handleDeleteProduct = async (productId: string) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        const res = await deleteProduct(productId);
        if (res?.status === 200) {
            setProducts(prev => prev.filter(p => p._id !== productId));
            Swal.fire('Deleted!', res.message, 'success');
        } else {
            Swal.fire('Error!', 'Failed to delete product.', 'error');
        }
    }
  };

  const handleViewProduct = (product: ProductType) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleUpdateProduct = (product: ProductType) => {
    setProductToBeUpdate(product);
    setShowUpdateForm(true);
  };
  
  // Callback when a product is added/updated to refresh list
  const handleRefresh = () => {
      fetchProducts(1, searchTerm);
      setShowForm(false);
      setShowUpdateForm(false);
  };

  return (
    <section className="w-full">
      {/* Edit Form Modal */}
      {showUpdateForm && productToBeUpdate && (
        <ProductEditForm
          change={false} // Refactored: change prop might need removal from child or ignored
          setChange={() => handleRefresh()} 
          productToBeUpdate={productToBeUpdate} 
          setShowUpdateForm={setShowUpdateForm} 
        />
      )}

      {/* Add Form Modal */}
      {showForm && (
        <ProductForm 
            change={false} 
            setChange={() => handleRefresh()} 
            setShowForm={setShowForm} 
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your catalogue and stock levels</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                 <input 
                    type="text" 
                    placeholder="Search brand, model..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                 />
             </div>
             <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow"
             >
                <Plus className="h-4 w-4" />
                Add Product
             </button>
          </div>
        </div>

        {/* Loading State (Initial Search) */}
        {loading && !loadingMore ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        ) : (
            <>
                {/* Grid */}
                {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                    <div
                        key={product._id}
                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                        {/* Image */}
                        <div className="relative h-48 bg-gray-50 overflow-hidden">
                            {product.images && product.images[0] ? (
                                <Image
                                src={product.images[0]}
                                alt={product.brandName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                <Package className="h-10 w-10" />
                                </div>
                            )}
                            
                            {/* Tags/Badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {product.discount && product.discount !== "0" && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        -{product.discount}%
                                    </span>
                                )}
                            </div>
                            
                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                                <button 
                                    onClick={() => handleViewProduct(product)}
                                    className="p-2 bg-white text-gray-900 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors" 
                                    title="View Details"
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => handleUpdateProduct(product)}
                                    className="p-2 bg-white text-gray-900 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors"
                                    title="Edit Product"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="p-2 bg-white text-gray-900 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                                    title="Delete Product"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{product.collection}</span>
                                <h3 className="font-bold text-gray-900 truncate" title={product.brandName}>{product.brandName}</h3>
                                <p className="text-sm text-gray-600 truncate">{product.modelNumber}</p>
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <Layers2 className="h-3.5 w-3.5" />
                                    <span>Stock: <span className={product.stock < 10 ? "text-red-500 font-bold" : "text-gray-900 font-medium"}>{product.stock}</span></span>
                                </div>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <IndianRupee className="h-3.5 w-3.5" />
                                    <span className="text-gray-900 font-bold text-sm">{product.price}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Tag className="h-3.5 w-3.5" />
                                    <span className="truncate">{product.frameType}</span>
                                </div>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <Users className="h-3.5 w-3.5" />
                                    <span className="capitalize">{product.gender}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Package className="h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm">Try adjusting your search terms</p>
                    </div>
                )}

                {/* Load More */}
                {hasMore && products.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-full font-medium hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                        >
                            {loadingMore ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    Loading more...
                                </>
                            ) : (
                                "Load More Products"
                            )}
                        </button>
                    </div>
                )}
            </>
        )}

        {/* View Modal (Recycled from old code logic but styled) */}
        {showModal && selectedProduct && (
           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
             <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-6 md:p-8">
                     <div className="flex justify-between items-start mb-6">
                         <div>
                             <h2 className="text-3xl font-bold text-gray-900">{selectedProduct.brandName}</h2>
                             <p className="text-gray-500">{selectedProduct.modelNumber}</p>
                         </div>
                         <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                             <XIcon className="h-6 w-6 text-gray-500" />
                         </button>
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-8">
                         {/* Images */}
                         <div className="relative h-80 bg-gray-100 rounded-xl overflow-hidden">
                             {selectedProduct.images?.[0] && (
                                 <Image src={selectedProduct.images[0]} alt={selectedProduct.brandName} fill className="object-cover" />
                             )}
                         </div>
                         
                         {/* Info */}
                         <div className="space-y-6">
                             <div className="grid grid-cols-2 gap-4">
                                 <DetailItem label="Price" value={`₹${selectedProduct.price}`} />
                                 <DetailItem label="Stock" value={selectedProduct.stock} />
                                 <DetailItem label="Collection" value={selectedProduct.collection} />
                                 <DetailItem label="Gender" value={selectedProduct.gender} />
                             </div>
                             
                             <div className="border-t border-gray-100 pt-4">
                                <h3 className="font-semibold mb-3">Frame Details</h3>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div className="text-gray-500">Type: <span className="text-gray-900">{selectedProduct.frameType}</span></div>
                                    <div className="text-gray-500">Shape: <span className="text-gray-900">{selectedProduct.frameShape}</span></div>
                                    <div className="text-gray-500">Size: <span className="text-gray-900">{selectedProduct.frameSize}</span></div>
                                    <div className="text-gray-500">Material: <span className="text-gray-900">{selectedProduct.frameMaterial}</span></div>
                                    <div className="text-gray-500">Color: <span className="text-gray-900">{selectedProduct.frameColor}</span></div>
                                    <div className="text-gray-500">Width: <span className="text-gray-900">{selectedProduct.frameWidth}</span></div>
                                </div>
                             </div>
                         </div>
                     </div>
                </div>
             </div>
           </div>
        )}
      </div>
    </section>
  );
};

// Helper for modal close icon
const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const DetailItem = ({ label, value }: { label: string, value: string | number }) => (
    <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
);

export default Products;
