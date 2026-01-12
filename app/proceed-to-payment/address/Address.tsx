"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Props {
  userId: string | null | undefined;
  email: string | null | undefined;
  cart: any;
  existingAddresses: any; // we only look at first address if present
}

const Address: React.FC<Props> = ({ userId, email, cart, existingAddresses }) => {
  const [formData, setFormData] = useState({
    pincode: "",
    houseNumberOrBuildingName: "",
    areaOrLocality: "",
    landmark: "",
    name: "",
    phone: "",
  });

  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false); // true if user wants to change address
  const router = useRouter();

  // Prefill if existing address exists
  useEffect(() => {
    if (existingAddresses && existingAddresses.length > 0) {
      const a = existingAddresses[0];
      setFormData({
        pincode: a.pincode || "",
        houseNumberOrBuildingName: a.houseNumberOrBuildingName || "",
        areaOrLocality: a.areaOrLocality || "",
        landmark: a.landmark || "",
        name: a.name || "",
        phone: a.phone || "",
      });
      setSavedAddressId(a._id || null);
    }
  }, [existingAddresses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async () => {
    if (
      !formData.pincode.trim() ||
      !formData.houseNumberOrBuildingName.trim() ||
      !formData.areaOrLocality.trim() ||
      !formData.name.trim() ||
      !formData.phone.trim()
    ) {
      Swal.fire({ title: "Please fill all required fields", icon: "warning" });
      return;
    }

    const payload = {
      ...formData,
      email,
      userId,
    };

    try {
      setLoading(true);
      const res = savedAddressId
        ? await axios.put(`/api/update-address/${savedAddressId}`, payload)
        : await axios.post("/api/add-address", payload);
      setLoading(false);

      const id = res?.data?.data?._id || savedAddressId;
      setSavedAddressId(id);
      setEditing(false);

      Swal.fire({
        title: savedAddressId ? "Address updated" : "Address saved",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      router.push(`/proceed-to-payment/review?addressId=${id}&cartId=${cart?._id}`);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      Swal.fire({ title: "Error saving address", icon: "error" });
    }
  };

  const handleProceed = () => {
    if (savedAddressId && cart?._id) {
      router.push(`/proceed-to-payment/review?addressId=${savedAddressId}&cartId=${cart._id}`);
    } else {
      Swal.fire({ title: "Please save your address first", icon: "warning" });
    }
  };

  const handleChangeAddress = () => {
    setEditing(true);
    setFormData({
      pincode: "",
      houseNumberOrBuildingName: "",
      areaOrLocality: "",
      landmark: "",
      name: "",
      phone: "",
    });
    setSavedAddressId(null);
  };

  return (
    <div className="pt-8 flex flex-col gap-8 lg:flex-row max-w-6xl mx-auto">
      {/* LEFT: Address Form */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Delivery Address</h1>
        </div>

        {!editing && savedAddressId ? (
          <div className="border border-gray-200 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {formData.name}
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Default</span>
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{formData.phone}</p>
                </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed">
              <p>{formData.houseNumberOrBuildingName}</p>
              <p>{formData.areaOrLocality}</p>
              <p>{formData.landmark ? `Near ${formData.landmark}, ` : ''}{formData.pincode}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleProceed}
                className="bg-black text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
              >
                Deliver Here
              </button>
              <button
                onClick={handleChangeAddress}
                className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Edit Address
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Address</h3>
             <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 ml-1">Full Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 ml-1">Phone Number</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9876543210" className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 ml-1">Pincode</label>
                        <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="e.g. 110001" className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" required />
                    </div>
                    <div className="space-y-1">
                         <label className="text-xs font-medium text-gray-500 ml-1">Flat, House no., Building</label>
                        <input name="houseNumberOrBuildingName" value={formData.houseNumberOrBuildingName} onChange={handleChange} placeholder="e.g. Flat 101, Blue Spires" className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" required />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">Area, Street, Sector, Village</label>
                    <input name="areaOrLocality" value={formData.areaOrLocality} onChange={handleChange} placeholder="e.g. Sector 62, Noida" className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" required />
                </div>
                
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">Landmark (Optional)</label>
                    <input name="landmark" value={formData.landmark} onChange={handleChange} placeholder="e.g. Near Metro Station" className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" />
                </div>

                <div className="pt-2">
                    <button
                    disabled={loading}
                    onClick={handleSaveAddress}
                    className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    type="button"
                    >
                    {loading ? "Saving..." : "Save & Continue"}
                    </button>
                    {savedAddressId && (
                         <button
                            onClick={() => setEditing(false)}
                            className="w-full md:w-auto mt-3 md:mt-0 md:ml-3 text-gray-500 px-6 py-3 rounded-xl font-medium hover:text-gray-800 transition-colors"
                            type="button"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
          </div>
        )}
      </div>

      {/* RIGHT: Bill Summary */}
      <div className="w-full lg:w-[380px] h-fit bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
        <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b">Order Summary</h2>
        <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600 text-sm">
                <span>Total item price</span>
                <span>₹{(cart?.cartTotal || 0) + 947}</span>
            </div>
            <div className="flex justify-between text-green-600 text-sm">
                <span>Discount</span>
                <span>−₹947</span>
            </div>
             <div className="flex justify-between text-gray-600 text-sm">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
            </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
            <span className="text-gray-900 font-bold">Total Payable</span>
             <span className="text-2xl font-bold text-gray-900">₹{cart?.cartTotal}</span>
        </div>

        <button
          onClick={handleProceed}
          className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          Deliver Here
        </button>
        
        <p className="text-xs text-center text-gray-400 mt-4">
            Secure checkout powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default Address;
