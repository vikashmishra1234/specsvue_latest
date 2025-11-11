"use client";

import Addprescription from "@/actions/Addprescriptions";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Eye, ChevronRight } from "lucide-react";

// Helper component
const FormInput = ({ name, value, onChange, placeholder, type = "text" }: any) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
  />
);

const PrescriptionForm = () => {
  const [formData, setFormData] = useState({
    // 👤 Personal Info
    name: "",
    phone: "", // ✅ renamed from "number"
    age: "",
    gender: "",

    // 👁️ Prescription Info
    dsRE: "", dsLE: "",
    dcRE: "", dcLE: "",
    axisRE: "", axisLE: "",
    addRE: "", addLE: "",
    pdRE: "", pdLE: "",
    diaRE: "", diaLE: "",
    fhRE: "", fhLE: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.phone) {
      Swal.fire({
        title: "Missing Information",
        text: "Please enter your name and phone number.",
        icon: "warning",
      });
      return;
    }

    setIsLoading(true);
    const response = await Addprescription(formData); // ✅ no login required
    setIsLoading(false);

    if (response?.success) {
      Swal.fire({
        title: "Success!",
        text: "Your prescription has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "#3B82F6",
      });
      setFormData({
        name: "", phone: "", age: "", gender: "",
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
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <Eye className="mx-auto h-12 w-12 text-blue-500" />
        <h2 className="text-3xl font-bold mt-4 text-gray-800">
          Enter Your Prescription Details
        </h2>
        <p className="mt-2 text-gray-500">
          Please fill in your personal and prescription details below.
        </p>
      </div>

      {/* 👤 Personal Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <FormInput name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
        <FormInput
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <FormInput name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Age" />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* 👁️ Prescription Inputs */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-4 min-w-[700px]">
          <div className="font-semibold text-gray-600 self-center"></div>
          {headers.map((header) => (
            <div key={header} className="font-semibold text-gray-600 text-center">{header}</div>
          ))}

          {/* Right Eye */}
          <div className="font-bold text-blue-600 text-center">RE</div>
          {["dsRE", "dcRE", "axisRE", "addRE", "pdRE", "diaRE", "fhRE"].map((f) => (
            <FormInput key={f} name={f} value={(formData as any)[f]} onChange={handleChange} placeholder="0.00" />
          ))}

          {/* Left Eye */}
          <div className="font-bold text-blue-600 text-center">LE</div>
          {["dsLE", "dcLE", "axisLE", "addLE", "pdLE", "diaLE", "fhLE"].map((f) => (
            <FormInput key={f} name={f} value={(formData as any)[f]} onChange={handleChange} placeholder="0.00" />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="group inline-flex items-center justify-center px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? "Submitting..." : "Submit Prescription"}
          <ChevronRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;
