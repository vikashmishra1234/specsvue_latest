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
    <div className="pt-8 flex flex-col gap-8 md:flex-row">
      {/* LEFT: Address Form */}
      <div className="flex-1 max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-[#0d0c22] mb-2">Delivery Address</h1>

        {!editing && savedAddressId ? (
          <div className="border p-4 rounded-lg bg-gray-50">
            <p className="font-medium mb-1">{formData.name}</p>
            <p className="text-sm text-gray-700">
              {formData.houseNumberOrBuildingName}, {formData.areaOrLocality}, {formData.pincode}
            </p>
            {formData.landmark && <p className="text-sm text-gray-500">Landmark: {formData.landmark}</p>}
            <p className="text-sm text-gray-500">Phone: {formData.phone}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleProceed}
                className="bg-[#0d0c22] text-white px-6 py-2 rounded-lg font-semibold"
              >
                Deliver to this Address
              </button>
              <button
                onClick={handleChangeAddress}
                className="border border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
              >
                Change Address
              </button>
            </div>
          </div>
        ) : (
          <form className="space-y-4 mt-4" onSubmit={(e) => e.preventDefault()}>
            <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode*" className="w-full p-3 rounded-md bg-[#e6e6f9]" required />
            <input name="houseNumberOrBuildingName" value={formData.houseNumberOrBuildingName} onChange={handleChange} placeholder="House no, Building name*" className="w-full p-3 rounded-md bg-[#e6e6f9]" required />
            <input name="areaOrLocality" value={formData.areaOrLocality} onChange={handleChange} placeholder="Road name, Area, Locality*" className="w-full p-3 rounded-md bg-[#e6e6f9]" required />
            <input name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Landmark (optional)" className="w-full p-3 rounded-md bg-[#e6e6f9]" />
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name*" className="w-full p-3 rounded-md bg-[#e6e6f9]" required />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number*" className="w-full p-3 rounded-md bg-[#e6e6f9]" required />

            <button
              disabled={loading}
              onClick={handleSaveAddress}
              className="bg-[#0d0c22] text-white px-6 py-2 rounded-lg font-semibold"
              type="button"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        )}
      </div>

      {/* RIGHT: Bill Summary */}
      <div className="w-full md:max-w-sm h-fit bg-white rounded-xl p-6 shadow-md">
        <p className="text-xl font-medium mb-4">Bill Details</p>
        <div className="text-sm space-y-2 border-t pt-4 border-gray-200">
          <div className="flex justify-between">
            <span>Total item price</span>
            <span>₹{cart?.cartTotal + 947}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Total discount</span>
            <span>−₹947</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 text-[#0d0c22]">
            <span>Total payable</span>
            <span>₹{cart?.cartTotal}</span>
          </div>
        </div>

        <button
          onClick={handleProceed}
          className="mt-6 w-full cursor-pointer bg-[#0d0c22] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Deliver to this Address
        </button>
      </div>
    </div>
  );
};

export default Address;
