"use client";

import { useState } from "react";
import { MapPin, Phone, CreditCard, ShieldCheck, Plus, CheckCircle, Package } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { handleCheckout } from "@/app/components/client-components/CheckOutButton";
import Image from "next/image";

interface CheckoutClientProps {
  initialCart: any;
  initialAddresses: any[];
  userId: string;
  userEmail: string | null | undefined;
}

export default function CheckoutClient({ initialCart, initialAddresses, userId, userEmail }: CheckoutClientProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(initialAddresses.length > 0 ? initialAddresses[0]._id : null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    pincode: "",
    houseNumberOrBuildingName: "",
    areaOrLocality: "",
    landmark: "",
    name: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async () => {
    if (!formData.pincode || !formData.houseNumberOrBuildingName || !formData.areaOrLocality || !formData.name || !formData.phone) {
        Swal.fire({ title: "Please fill all required fields", icon: "warning" });
        return;
    }

    try {
        setLoading(true);
        const payload = { ...formData, email: userEmail, userId };
        const res = await axios.post("/api/add-address", payload);
        
        setIsAddingNew(false);
        router.refresh();
        
    } catch (error) {
        setLoading(false);
        Swal.fire({ title: "Error saving address", icon: "error" });
    }
  };

  const onPayNow = async () => {
      if(!selectedAddressId) {
          Swal.fire({ title: "Please select a delivery address", icon: "warning" });
          return;
      }
      
      handleCheckout(initialCart.cartTotal, userId, selectedAddressId, router, setLoading);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT COLUMN: Steps */}
      <div className="flex-1 space-y-8">
        
        {/* Step 1: Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="text-gray-900" size={20}/> 1. Delivery Address
                </h2>
                {!isAddingNew && (
                    <button onClick={() => setIsAddingNew(true)} className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
                        <Plus size={16}/> Add New
                    </button>
                )}
            </div>
            
            <div className="p-6">
                {isAddingNew ? (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Add New Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" onChange={handleChange} placeholder="Full Name *" className="p-3 rounded-xl border border-gray-200 w-full" />
                            <input name="phone" onChange={handleChange} placeholder="Phone Number *" className="p-3 rounded-xl border border-gray-200 w-full" />
                            <input name="pincode" onChange={handleChange} placeholder="Pincode *" className="p-3 rounded-xl border border-gray-200 w-full" />
                            <input name="houseNumberOrBuildingName" onChange={handleChange} placeholder="Flat/House/Building *" className="p-3 rounded-xl border border-gray-200 w-full" />
                        </div>
                        <input name="areaOrLocality" onChange={handleChange} placeholder="Area, Street, Locality *" className="p-3 rounded-xl border border-gray-200 w-full" />
                        <input name="landmark" onChange={handleChange} placeholder="Landmark (Optional)" className="p-3 rounded-xl border border-gray-200 w-full" />
                        
                        <div className="flex gap-3 pt-2">
                            <button onClick={handleSaveAddress} disabled={loading} className="bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50">Save & Deliver Here</button>
                            <button onClick={() => setIsAddingNew(false)} className="text-gray-500 px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {addresses.map((addr: any) => (
                            <div 
                                key={addr._id}
                                onClick={() => setSelectedAddressId(addr._id)}
                                className={`cursor-pointer border-2 rounded-xl p-4 transition-all hover:border-gray-300 relative ${selectedAddressId === addr._id ? 'border-black bg-gray-50' : 'border-dashed border-gray-200'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddressId === addr._id ? 'border-black' : 'border-gray-300'}`}>
                                        {selectedAddressId === addr._id && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="font-bold text-gray-900">{addr.name}</p>
                                            <p className="text-sm font-semibold">{addr.phone}</p>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {addr.houseNumberOrBuildingName}, {addr.areaOrLocality}, {addr.pincode}
                                            {addr.landmark && <span className="block text-xs text-gray-400 mt-1">Near {addr.landmark}</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {addresses.length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                                No saved addresses. Please add one.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Step 2: Items Review (Collapsible-ish or Compact) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Package className="text-gray-900" size={20}/> 2. Order Items ({initialCart.items.length})
                </h2>
            </div>
            <div className="divide-y divide-gray-100">
                {initialCart.items.map((item: any) => (
                    <div key={item._id} className="p-4 flex gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 p-2 flex-shrink-0">
                            <Image
                                src={item.productId?.images?.[0] || '/no-image.png'}
                                alt="Product"
                                width={80}
                                height={80}
                                className="w-full h-full object-contain mix-blend-multiply"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{item.productId?.name || item.productId?.brandName}</p>
                            <p className="text-sm text-gray-500">
                                {item.productType === 'ContactLens' ? `${item.power ? `Power: ${item.power}` : ''}` : `Frame: ${item.productId?.frameType}`}
                            </p>
                            <p className="text-sm font-medium mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="ml-auto font-bold text-gray-900">
                             ₹{item.price * item.quantity}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Sticky Summary */}
      <div className="w-full lg:w-[400px]">
          <div className="sticky top-6 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gray-900 text-white">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <CreditCard size={20}/> payment Summary
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">₹{initialCart.cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                        <span>Delivery</span>
                        <span className="font-medium">Free</span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                        <span className="font-bold text-xl text-gray-900">Total</span>
                        <span className="font-bold text-2xl text-gray-900">₹{initialCart.cartTotal}</span>
                    </div>
                    
                    <button
                        onClick={onPayNow}
                        disabled={loading || !selectedAddressId}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                    >
                         {loading ? (
                             <span className="flex items-center gap-2">Processing <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div></span>
                         ) : "Pay Securely Now"}
                    </button>
                    
                    <div className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                        <ShieldCheck size={14}/> Secure SSL Encrypted Transaction
                    </div>
                </div>
          </div>
      </div>
    </div>
  );
}
