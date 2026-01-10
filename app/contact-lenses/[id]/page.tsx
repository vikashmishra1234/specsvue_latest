"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useContactLens } from "@/actions/fetchContactLenses";
import Swal from "sweetalert2";
import axios from "axios";
import { useSession } from "next-auth/react";

// Helper to generate range
const generateRange = (min: number, max: number, step: number) => {
    const range = [];
    for (let i = min; i <= max + 0.001; i += step) {
        range.push(i.toFixed(2));
    }
    return range;
};

// Prescription Box Component
const PrescriptionBox = ({ side, lens, values, setValues, disabled, onToggle }: any) => {
    const powers = generateRange(lens.powerMin, lens.powerMax, lens.powerStep);
    let cylinders: string[] = [];
    let axes: string[] = [];
    if (lens.isToric) {
        cylinders = generateRange(lens.cylinderMin, lens.cylinderMax, lens.cylinderStep);
        axes = generateRange(lens.axisMin, lens.axisMax, lens.axisStep);
    }

    if (disabled) {
        return (
            <div 
                onClick={onToggle}
                className={`border-2 border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all h-full min-h-[200px]`}
            >
                <div className="text-center">
                     <span className="block text-2xl font-bold text-gray-400 mb-2">+ Add {side} Eye</span>
                     <span className="text-sm text-gray-500">Same prescription? Select "Both Eyes" above.</span>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border rounded-xl p-5 shadow-sm relative">
             <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg rounded-tl-lg uppercase tracking-wider">
                {side} Eye
             </div>
             {onToggle && (
                 <button onClick={onToggle} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
             )}

             <div className="mt-6 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Power (SPH)</label>
                    <div className="relative">
                        <select 
                            value={values.power} 
                            onChange={(e) => setValues({...values, power: e.target.value})} 
                            className="w-full border border-gray-300 bg-white p-2.5 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow font-medium"
                        >
                            <option value="">Select</option>
                            {powers.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                {lens.isToric && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cylinder</label>
                            <select 
                                value={values.cylinder} 
                                onChange={(e) => setValues({...values, cylinder: e.target.value})} 
                                className="w-full border border-gray-300 bg-white p-2.5 rounded-lg appearance-none font-medium"
                            >
                                <option value="">Select</option>
                                {cylinders.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Axis</label>
                            <select 
                                value={values.axis} 
                                onChange={(e) => setValues({...values, axis: e.target.value})} 
                                className="w-full border border-gray-300 bg-white p-2.5 rounded-lg appearance-none font-medium"
                            >
                                <option value="">Select</option>
                                {axes.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>
                )}
                
                {/* Visual Base Curve & Dia display if separate logic needed, else global */}
                
                <div>
                     <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Quantity (Boxes)</label>
                     <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                         <button className="px-3 py-2 hover:bg-gray-100" onClick={() => setValues({...values, quantity: Math.max(1, values.quantity - 1)})}>-</button>
                         <span className="px-3 font-semibold">{values.quantity}</span>
                         <button className="px-3 py-2 hover:bg-gray-100" onClick={() => setValues({...values, quantity: values.quantity + 1})}>+</button>
                     </div>
                </div>
             </div>
        </div>
    )
}

const ContactLensDetail = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { data: lens, loading, error } = useContactLens(id);
    const {data: session} = useSession();

    // Global Options
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedBaseCurve, setSelectedBaseCurve] = useState("");
    const [selectedDiameter, setSelectedDiameter] = useState("");
    
    // Prescription modes: 'both', 'split'
    const [prescriptionMode, setPrescriptionMode] = useState<'both' | 'split'>('both');
    
    // Values
    const [leftEye, setLeftEye] = useState({ power: "", cylinder: "", axis: "", quantity: 1 });
    const [rightEye, setRightEye] = useState({ power: "", cylinder: "", axis: "", quantity: 1 });
    
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (lens) {
            if (lens.baseCurve?.length > 0) setSelectedBaseCurve(lens.baseCurve[0]);
            if (lens.diameter?.length > 0) setSelectedDiameter(lens.diameter[0]);
            if (lens.colors?.length > 0) setSelectedColor(lens.colors[0]);
        }
    }, [lens]);

    if (loading) return <div className="p-20 text-center animate-pulse">Loading Details...</div>;
    if (error || !lens) return <div className="p-20 text-center text-red-500">{error || "Product not found"}</div>;

    const handleAddToCart = async () => {
        const userId = session?.user?.userId;
        if (!userId) {
            Swal.fire("Please Login", "You need to login to add to cart", "warning");
            return;
        }

        const itemsToAdd = [];

        // Validate Items
        if (prescriptionMode === 'both') {
            if (!leftEye.power) return Swal.fire("Required", "Please select power", "warning");
            if (lens.isToric && (!leftEye.cylinder || !leftEye.axis)) return Swal.fire("Required", "Please select all toric parameters", "warning");
            
            // Add as one item with doubled quantity? Or two items?
            // Usually if both eyes are same, just qty * 2 or user sets box qty.
            // Let's assume the user selects "Boxes" per 
            
            itemsToAdd.push({
                side: "Both", // Internal marker maybe? or just add generic item
                ...leftEye
            });
        } else {
             // Split mode
             // Check if at least one is filled
             if (!leftEye.power && !rightEye.power) return Swal.fire("Required", "Please configure at least one eye", "warning");

             if (leftEye.power) {
                 if (lens.isToric && (!leftEye.cylinder || !leftEye.axis)) return Swal.fire("Required", "Please select all parameters for Left Eye", "warning");
                 itemsToAdd.push({ side: "Left", ...leftEye });
             }
             if (rightEye.power) {
                 if (lens.isToric && (!rightEye.cylinder || !rightEye.axis)) return Swal.fire("Required", "Please select all parameters for Right Eye", "warning");
                 itemsToAdd.push({ side: "Right", ...rightEye });
             }
        }

        try {
            setAdding(true);
            
            for (const item of itemsToAdd) {
                const payload = {
                    productType: 'ContactLens',
                    userId: userId,
                    productId: lens._id,
                    cartProductId: `${lens._id}-${Date.now()}-${Math.random()}`, 
                    price: lens.salePrice || lens.price,
                    quantity: item.quantity,
                    
                    power: parseFloat(item.power),
                    cylinder: lens.isToric ? parseFloat(item.cylinder) : undefined,
                    axis: lens.isToric ? parseFloat(item.axis) : undefined,
                    baseCurve: selectedBaseCurve ? parseFloat(selectedBaseCurve) : undefined,
                    diameter: selectedDiameter ? parseFloat(selectedDiameter) : undefined,
                    color: selectedColor
                };
                
                await axios.post("/api/add-contact-lens-cart", payload);
            }
            
            Swal.fire({
                title: "Added to Cart!",
                text: "Your contact lenses have been added.",
                icon: "success",
                showCancelButton: true,
                confirmButtonText: "View Cart",
                cancelButtonText: "Continue Shopping"
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/cart");
                }
            });

        } catch (err: any) {
            Swal.fire("Error", err.response?.data?.error || "Failed to add to cart", "error");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    
                    {/* Visual Section */}
                    <div className="bg-gray-100 p-8 flex flex-col items-center justify-center relative">
                        <div className="relative w-full aspect-square max-w-[400px]">
                            {lens.images?.[0] ? (
                                <img src={lens.images[0]} className="w-full h-full object-contain drop-shadow-lg" />
                            ) : (
                                 <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                         <div className="flex gap-3 mt-8 overflow-x-auto w-full justify-center px-4">
                            {lens.images?.map((img: string, i: number) => (
                                <img key={i} src={img} className="w-16 h-16 object-cover rounded-xl border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all" />
                            ))}
                         </div>
                    </div>

                    {/* Interaction Section */}
                    <div className="p-8 md:p-12 flex flex-col h-full overflow-y-auto">
                        <div className="mb-6">
                            <span className="text-blue-600 font-bold uppercase tracking-wider text-xs mb-1 block">{lens.brandName}</span>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{lens.name}</h1>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">{lens.lensType}</span>
                                {lens.isToric && <span className="px-3 py-1 bg-purple-100 rounded-full text-xs font-bold text-purple-600">Toric / Astigmatism</span>}
                            </div>
                             <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-gray-900">₹{lens.salePrice || lens.price}</span>
                                {lens.salePrice && <span className="text-xl text-gray-400 line-through">₹{lens.price}</span>}
                                <span className="text-sm text-gray-500 font-medium">per box</span>
                            </div>
                        </div>

                        {/* Common Options */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {lens.baseCurve?.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Base Curve</label>
                                    <select value={selectedBaseCurve} onChange={(e) => setSelectedBaseCurve(e.target.value)} className="w-full border-b-2 border-gray-200 bg-transparent py-2 font-medium focus:border-blue-600 outline-none transition-colors">
                                        {lens.baseCurve.map((bc: any) => <option key={bc} value={bc}>{bc}</option>)}
                                    </select>
                                </div>
                            )}
                             {lens.diameter?.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Diameter</label>
                                    <select value={selectedDiameter} onChange={(e) => setSelectedDiameter(e.target.value)} className="w-full border-b-2 border-gray-200 bg-transparent py-2 font-medium focus:border-blue-600 outline-none transition-colors">
                                        {lens.diameter.map((d: any) => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            )}
                            {lens.colors?.length > 0 && (
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {lens.colors.map((c: string) => (
                                            <button 
                                                key={c} 
                                                onClick={() => setSelectedColor(c)}
                                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedColor === c ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                            <h3 className="font-bold text-gray-900 mb-4 flex justify-between items-center">
                                Prescription
                                <div className="flex bg-white rounded-lg p-1 shadow-sm border">
                                    <button 
                                        onClick={() => setPrescriptionMode('both')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${prescriptionMode === 'both' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Both Eyes
                                    </button>
                                     <button 
                                        onClick={() => setPrescriptionMode('split')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${prescriptionMode === 'split' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        Diff. Power
                                    </button>
                                </div>
                            </h3>

                            {prescriptionMode === 'both' ? (
                                <PrescriptionBox side="Both" lens={lens} values={leftEye} setValues={setLeftEye} />
                            ) : (
                                <div className="space-y-4">
                                    <PrescriptionBox side="Left" lens={lens} values={leftEye} setValues={setLeftEye} onToggle={null} />
                                    <PrescriptionBox side="Right" lens={lens} values={rightEye} setValues={setRightEye} onToggle={null} />
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={handleAddToCart} 
                            disabled={adding}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all disabled:opacity-70 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                        >
                            {adding ? "Adding to Cart..." : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Description Section */}
            <div className="max-w-6xl mx-auto mt-12 bg-white rounded-3xl shadow-sm p-8 md:p-12">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
                 <div className="prose prose-blue max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: lens.description }} />
            </div>
        </div>
    );
};

export default ContactLensDetail;
