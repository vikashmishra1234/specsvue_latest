"use client";
import Addprescription from "@/actions/Addprescriptions";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { Eye, ChevronRight } from "lucide-react";

// Helper component for individual input fields for cleaner code
const FormInput = ({ name, value, onChange, placeholder }: any) => (
  <input
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
  />
);

const PrescriptionForm = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    dsRE: "", dsLE: "",
    dcRE: "", dcLE: "",
    axisRE: "", axisLE: "",
    addRE: "", addLE: "",
    pdRE: "", pdLE: "",
    diaRE: "", diaLE: "",
    fhRE: "", fhLE: "",
  });
  const [isLoading,setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.userId) {
      Swal.fire({
        title: "Authentication Error",
        text: "You must be logged in to submit a prescription.",
        icon: "error",
      });
      return;
    }
    setIsLoading(true)
    const response = await Addprescription(session.user.userId, formData);
    setIsLoading(false)

    if (response?.success) {
      Swal.fire({
        title: "Success!",
        text: "Your prescription has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "#3B82F6",
      });
      // Reset form
      setFormData({
        dsRE: "", dsLE: "", dcRE: "", dcLE: "", axisRE: "", axisLE: "",
        addRE: "", addLE: "", pdRE: "", pdLE: "", diaRE: "", diaLE: "",
        fhRE: "", fhLE: "",
      });
    } else {
      Swal.fire({
        title: "Oops...",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const headers = ["DS", "DC", "Axis", "Add", "PD", "Lens Dia", "FH"];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-lg"
    >
      <div className="text-center mb-8">
        <Eye className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="text-3xl font-bold mt-4 text-gray-800">
          Enter Your Prescription Details
        </h2>
        <p className="mt-2 text-gray-500">
          Please fill in the values for both your right (RE) and left (LE) eye.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-4 min-w-[700px]">
          {/* Headers */}
          <div className="font-semibold text-gray-600 self-center"></div>
          {headers.map((header) => (
            <div key={header} className="font-semibold text-gray-600 text-center">
              {header}
            </div>
          ))}

          {/* RE (Right Eye) Row */}
          <div className="font-bold text-blue-600 self-center text-center">RE</div>
          <FormInput name="dsRE" value={formData.dsRE} onChange={handleChange} placeholder="0.00" />
          <FormInput name="dcRE" value={formData.dcRE} onChange={handleChange} placeholder="0.00" />
          <FormInput name="axisRE" value={formData.axisRE} onChange={handleChange} placeholder="0" />
          <FormInput name="addRE" value={formData.addRE} onChange={handleChange} placeholder="0.00" />
          <FormInput name="pdRE" value={formData.pdRE} onChange={handleChange} placeholder="0.0" />
          <FormInput name="diaRE" value={formData.diaRE} onChange={handleChange} placeholder="0.0" />
          <FormInput name="fhRE" value={formData.fhRE} onChange={handleChange} placeholder="0.0" />

          {/* LE (Left Eye) Row */}
          <div className="font-bold text-blue-600 self-center text-center">LE</div>
          <FormInput name="dsLE" value={formData.dsLE} onChange={handleChange} placeholder="0.00" />
          <FormInput name="dcLE" value={formData.dcLE} onChange={handleChange} placeholder="0.00" />
          <FormInput name="axisLE" value={formData.axisLE} onChange={handleChange} placeholder="0" />
          <FormInput name="addLE" value={formData.addLE} onChange={handleChange} placeholder="0.00" />
          <FormInput name="pdLE" value={formData.pdLE} onChange={handleChange} placeholder="0.0" />
          <FormInput name="diaLE" value={formData.diaLE} onChange={handleChange} placeholder="0.0" />
          <FormInput name="fhLE" value={formData.fhLE} onChange={handleChange} placeholder="0.0" />
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="group inline-flex items-center justify-center px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 transform hover:scale-105"
        >
          {
            isLoading?"Submitting...":"Submit Prescription"
          }
          <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;