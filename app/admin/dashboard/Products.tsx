"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Edit,
  Trash2,
  Eye,
  Package,
  Calendar,
  DollarSign,
  Tag,
  Users,
  Palette,
} from "lucide-react";
import { deleteProduct } from "@/actions/deleteProduct";
import Swal from "sweetalert2";
import ProductEditForm from "./ProductEditForm";
import ProductForm from "../ProductForm";



interface ProductsProps {
  products: ProductType[];
  setChange: (value:boolean)=>void;
  change:boolean;
}

const Products = ({ setChange,products,change }: ProductsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateForm,setShowUpdateForm] = useState(false)
  const [productToBeUpdate,setProductToBeUpdate] = useState<ProductType|null>()
  const [showForm,setShowForm] = useState(false)

  const filteredProducts =
    products?.filter(
      (product) =>
        product.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.frameType.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleViewProduct = (product: ProductType) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    const res = await deleteProduct(productId);
    if (res?.status === 200) {
      Swal.fire({
        title: "Deleted Parmanently",
        text: res.message,
        icon: "success",
      });
      setChange(!change)
      return;
    }
    Swal.fire({
      title: "An Error Occured",
      text: "Please Try After Some Time",
      icon:'error'
    });
  };

  const handleUpdateProduct = (product:ProductType) => {
    setShowUpdateForm(!showUpdateForm)
    setProductToBeUpdate(product)
  };

  return (
    <section className="w-full py-8 bg-gray-50 min-h-screen">
      {showUpdateForm&&productToBeUpdate&&<ProductEditForm change={change} setChange={setChange} productToBeUpdate={productToBeUpdate} setShowUpdateForm={setShowUpdateForm} />}
      {showForm&&<ProductForm change={change} setChange={setChange}  setShowForm={setShowForm}  />}
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Products Management
          </h1>
          <p className="text-gray-600">Manage your product inventory</p>
          <button className="mt-3 border px-4 rounded cursor-pointer hover:bg-gray-900 hover:text-white text-sm py-2 transition-all border-gray-700" onClick={()=>setShowForm(!showForm)}>Add Product</button>
        </div>

        {/* Search Bar */}
        {/* <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div> */}

        {/* Products Count */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>Total Products: {filteredProducts.length}</span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.brandName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.discount && product.discount !== "0" && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {product.brandName}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {product.collection}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Tag className="h-3 w-3" />
                      <span>
                        {product.frameType} • {product.frameShape}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Users className="h-3 w-3" />
                      <span className="capitalize">{product.gender}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Palette className="h-3 w-3" />
                      <span>{product.frameColor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      <span className="font-semibold text-gray-900">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProduct(product)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleUpdateProduct(product)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-600 text-lg">No products found</div>
          </div>
        )}

        {/* Product Detail Modal */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedProduct.brandName}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Images */}
                  <div>
                    {selectedProduct.images && selectedProduct.images[0] && (
                      <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.brandName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Collection:
                          </span>{" "}
                          {selectedProduct.collection}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Gender:
                          </span>{" "}
                          {selectedProduct.gender}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Price:
                          </span>{" "}
                          ₹{selectedProduct.price}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Discount:
                          </span>{" "}
                          {selectedProduct.discount}%
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Model:
                          </span>{" "}
                          {selectedProduct.modelNumber}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Condition:
                          </span>{" "}
                          {selectedProduct.condition}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Frame Details
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Type:
                          </span>{" "}
                          {selectedProduct.frameType}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Shape:
                          </span>{" "}
                          {selectedProduct.frameShape}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Size:
                          </span>{" "}
                          {selectedProduct.frameSize}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Color:
                          </span>{" "}
                          {selectedProduct.frameColor}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Material:
                          </span>{" "}
                          {selectedProduct.frameMaterial}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Style:
                          </span>{" "}
                          {selectedProduct.frameStyle}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Width:
                          </span>{" "}
                          {selectedProduct.frameWidth}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Height:
                          </span>{" "}
                          {selectedProduct.height}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Additional Details
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Prescription:
                          </span>{" "}
                          {selectedProduct.prescriptionType}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Warranty:
                          </span>{" "}
                          {selectedProduct.productWarranty}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Weight:
                          </span>{" "}
                          {selectedProduct.weight}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Temple Color:
                          </span>{" "}
                          {selectedProduct.templeColor}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Dates
                      </h3>
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">
                            Created:
                          </span>{" "}
                          {new Date(
                            selectedProduct.createdAt
                          ).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">
                            Updated:
                          </span>{" "}
                          {new Date(
                            selectedProduct.updatedAt
                          ).toLocaleDateString()}
                        </div>
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

export default Products;
