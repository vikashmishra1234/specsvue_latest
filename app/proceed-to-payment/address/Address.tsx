"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react"; // Optional, if using lucide for icons
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Props {
  userId: string | null | undefined;
  email: string | null | undefined;
  cart: any;
  existingAddresses: any;
}

const Address: React.FC<Props> = ({  userId, email, cart, existingAddresses }) => {
  const [formData, setFormData] = useState({
    pincode: "",
    houseNumberOrBuildingName: "",
    areaOrLocality: "",
    landmark: "",
    name: "",
    phone: "",
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading,setLoading] = useState(false);
  const router = useRouter();

  // Set first address as default selected
  useEffect(() => {
    console.log(cart)
    if (existingAddresses?.length > 0) {
      setSelectedAddressId(existingAddresses[0]._id); // assuming each address has _id
    }
  }, [existingAddresses]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async () => {
    const payload = {
      ...formData,
      email,
      userId,
    };

    try {
      setLoading(true)
      const res = await axios.post("/api/add-address", payload);
      if(res){
        setSelectedAddressId(res?.data?.data?._id)
        handleProceed()
      }
      
    } catch (error) {
      setLoading(false)
      console.error("Error:", error);
      Swal.fire({
        title:"Opps...",
        text:"Error while saving address",
        icon:"error"
      })
    }
  };

  const handleProceed = () => {
    if (selectedAddressId&&cart?._id) {
      router.push(`/proceed-to-payment/review?addressId=${selectedAddressId}&cartId=${cart._id}`)
    } else {
      Swal.fire({
        title:"Please Select An Address",
        icon:"warning"
      })
    }
  };

  return (
    <div className="pt-8 flex flex-col gap-8 md:flex-row">
      {/* LEFT: Existing Addresses & New Form Toggle */}
      <div className="flex-1 max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-[#0d0c22] mb-2">Choose Delivery Address</h1>

        {existingAddresses?.map((address:any) => (
          <label
            key={address._id}
            className={`block border p-4 rounded-lg cursor-pointer ${
              selectedAddressId === address._id ? "border-[#0d0c22] bg-gray-100" : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="selectedAddress"
              className="mr-2"
              checked={selectedAddressId === address._id}
              onChange={() => setSelectedAddressId(address._id)}
            />
            <div>
              <p className="font-medium">{address.name}</p>
              <p className="text-sm text-gray-700">
                {address.houseNumberOrBuildingName}, {address.areaOrLocality}, {address.pincode}
              </p>
              <p className="text-sm text-gray-500">{address.phone}</p>
            </div>
          </label>
        ))}

        {/* Show form toggle */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
          >
            <Plus size={18} /> Add New Address
          </button>
        )}

        {/* Address Form */}
        {showForm && (
          <form className="space-y-4 mt-4" onSubmit={(e) => e.preventDefault()}>
            <input  name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode*" className="w-full p-3 rounded-md bg-[#e6e6f9]" required />
            <input  name="houseNumberOrBuildingName" value={formData.houseNumberOrBuildingName} onChange={handleChange} placeholder="House no, Building name*" className="w-full p-3 rounded-md bg-[#e6e6f9]" required />
            <input name="areaOrLocality" value={formData.areaOrLocality} onChange={handleChange} placeholder="Road name, Area, Locality*" className="w-full p-3 rounded-md bg-[#e6e6f9]" required />
            <input name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Landmark (optional)" className="w-full p-3 rounded-md bg-[#e6e6f9]" />
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name*" className="w-full p-3 rounded-md bg-[#e6e6f9]" required />
            <div className="flex items-center">
              <span className="px-4 py-3 bg-[#e6e6f9] rounded-l-md border border-r-0">+91</span>
              <input  name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number*" className="flex-1 p-3 rounded-r-md bg-[#e6e6f9]" required />
            </div>
            <button disabled={loading} onClick={handleAddAddress} className="bg-[#0d0c22] text-white px-6 py-2 rounded-lg font-semibold">
              {
                loading?"loading...":"Save Address & continue with this"
              }
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
            <span>₹{cart?.cartTotal + 10000}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Total discount</span>
            <span>−₹10000</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 text-[#0d0c22]">
            <span>Total payable</span>
            <span>₹{cart?.cartTotal}</span>
          </div>
        </div>

        <button onClick={handleProceed} className="mt-6 w-full bg-[#0d0c22] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
          Deliver to this Address
        </button>
      </div>
    </div>
  );
};

export default Address;
