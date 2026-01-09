"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useContactLens } from "@/actions/fetchContactLenses";
import Swal from "sweetalert2";
import axios from "axios";
import { useSession } from "next-auth/react";
// import { useSession } from "next-auth/react"; // Assuming NextAuth is used, check usages elsewhere if needed for userId

// Helper to generate range
const generateRange = (min: number, max: number, step: number) => {
    const range = [];
    // Handle floating point issues
    for (let i = min; i <= max + 0.001; i += step) {
        range.push(i.toFixed(2));
    }
    return range;
};

const ContactLensDetail = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { data: lens, loading, error } = useContactLens(id);
    // const { data: session } = useSession(); // If user session is needed for actual ID

    const [selectedPower, setSelectedPower] = useState("");
    const [selectedCylinder, setSelectedCylinder] = useState("");
    const [selectedAxis, setSelectedAxis] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedBaseCurve, setSelectedBaseCurve] = useState("");
    const [selectedDiameter, setSelectedDiameter] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    const {data: session} = useSession();

    // Temp User ID logic (simplified, assuming existng logic handles guests or requires login)
    // The previous add-to-cart required userId.
    // I will try getting it from local storage or assume user is logged in. 
    // Checking `Addprescriptions.ts` or similar might reveal usage.
    // For now, I will use a placeholder or check if session works.
    
    // Set defaults when lens loads
    useEffect(() => {
        if (lens) {
            if (lens.baseCurve?.length > 0) setSelectedBaseCurve(lens.baseCurve[0]);
            if (lens.diameter?.length > 0) setSelectedDiameter(lens.diameter[0]);
            if (lens.colors?.length > 0) setSelectedColor(lens.colors[0]);
        }
    }, [lens]);


    if (loading) return <div className="p-10 text-center">Loading Details...</div>;
    if (error || !lens) return <div className="p-10 text-center text-red-500">{error || "Product not found"}</div>;

    const powers = generateRange(lens.powerMin, lens.powerMax, lens.powerStep);
    
    // If Toric
    let cylinders: string[] = [];
    let axes: string[] = [];
    if (lens.isToric) {
        cylinders = generateRange(lens.cylinderMin, lens.cylinderMax, lens.cylinderStep);
        axes = generateRange(lens.axisMin, lens.axisMax, lens.axisStep);
    }

    const handleAddToCart = async () => {
        // Validation
        if (!selectedPower) return Swal.fire("Error", "Please select Power", "error");
        if (lens.isToric && (!selectedCylinder || !selectedAxis)) return Swal.fire("Error", "Please select Cylinder and Axis", "error");
        
        // Check Auth - for now assuming user might be logged in or guest. 
        // Existing cart logic requires userId.
        // Let's assume we can get it from session or similar.
        // For this implementation, I will prompt if userId is missing or just try to post.
        // Let's rely on backend check.
        
        // NOTE: In a real app we'd get userId from session context. 
        // I will attempt to read a "userId" cookie or similar if available, or just mock it for dev if needed? 
        // No, I should respect the app's auth.
        // Checking `admin/dashboard/page.tsx` it used `next-auth.message` ? No that was localStorage.
        // Let's try to grab userId from a common place if I can find one. 
        // The `session` concept is best.
        
        // I'll leave userId empty and let the user handle login if the API fails, 
        // or hardcode a test ID if I was testing. 
        // Actually best to try-catch the API.
        
        try {
            setAdding(true);
            
            // We need a userId. In existing app, let's look at `actions/getUserCart.ts`.
            // It seems to expect a userId.
            
            const userId = session?.user?.userId;
            // console.log(session)
            // alert(userId)

            if (!userId) {
                Swal.fire("Please Login", "You need to login to add to cart", "warning");
                setAdding(false);
                return;
            }

            const payload = {
                productType: 'ContactLens',
                userId: userId,
                productId: lens._id,
                cartProductId: `${lens._id}-${Date.now()}`, // Unique ID for cart item
                price: lens.salePrice || lens.price,
                quantity,
                
                // Lens Details
                power: parseFloat(selectedPower),
                cylinder: lens.isToric ? parseFloat(selectedCylinder) : undefined,
                axis: lens.isToric ? parseFloat(selectedAxis) : undefined,
                baseCurve: selectedBaseCurve ? parseFloat(selectedBaseCurve) : undefined,
                diameter: selectedDiameter ? parseFloat(selectedDiameter) : undefined,
                color: selectedColor
            };

            const res = await axios.post("/api/add-contact-lens-cart", payload);
            
            if (res.status === 200) {
                 Swal.fire("Added!", "Item added to cart", "success");
                 router.push("/cart");
            }

        } catch (err: any) {
            Swal.fire("Error", err.response?.data?.error || "Failed to add to cart", "error");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Images */}
                <div>
                     <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
                        {lens.images?.[0] ? (
                            <img src={lens.images[0]} className="w-full h-full object-cover" />
                        ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                        )}
                     </div>
                     <div className="flex gap-2">
                        {lens.images?.map((img: string, i: number) => (
                            <img key={i} src={img} className="w-20 h-20 object-cover rounded border cursor-pointer hover:border-blue-500" />
                        ))}
                     </div>
                </div>

                {/* Details */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{lens.name}</h1>
                    <p className="text-gray-500 mb-4">{lens.brandName}</p>
                    
                    <div className="flex items-baseline gap-4 mb-6">
                        <span className="text-3xl font-bold text-gray-900">₹{lens.salePrice || lens.price}</span>
                        {lens.salePrice && <span className="text-lg text-gray-400 line-through">₹{lens.price}</span>}
                    </div>

                    <div className="prose text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: lens.description }} />

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Power */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Power (SPH)</label>
                            <select value={selectedPower} onChange={(e) => setSelectedPower(e.target.value)} className="w-full border p-2 rounded">
                                <option value="">Select Power</option>
                                {powers.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        {/* Toric Fields */}
                        {lens.isToric && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cylinder (CYL)</label>
                                    <select value={selectedCylinder} onChange={(e) => setSelectedCylinder(e.target.value)} className="w-full border p-2 rounded">
                                        <option value="">Select Cylinder</option>
                                        {cylinders.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Axis</label>
                                    <select value={selectedAxis} onChange={(e) => setSelectedAxis(e.target.value)} className="w-full border p-2 rounded">
                                        <option value="">Select Axis</option>
                                        {axes.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                            </>
                        )}
                        
                        {/* Base Curve & Diameter */}
                        {lens.baseCurve?.every((bc:any) => typeof bc === 'number' || typeof bc === 'string') && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base Curve</label>
                                <select value={selectedBaseCurve} onChange={(e) => setSelectedBaseCurve(e.target.value)} className="w-full border p-2 rounded">
                                    {lens.baseCurve.map((bc: any) => <option key={bc} value={bc}>{bc}</option>)}
                                </select>
                            </div>
                        )}
                         {lens.diameter?.every((d:any) => typeof d === 'number' || typeof d === 'string') && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Diameter</label>
                                <select value={selectedDiameter} onChange={(e) => setSelectedDiameter(e.target.value)} className="w-full border p-2 rounded">
                                    {lens.diameter.map((d: any) => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Color */}
                        {lens.colors?.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full border p-2 rounded">
                                    {lens.colors.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Quantity */}
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-full border p-2 rounded" />
                        </div>
                    </div>

                    <button 
                        onClick={handleAddToCart} 
                        disabled={adding}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {adding ? "Adding..." : "Add to Cart"}
                    </button>
                    
                    <div className="mt-4 text-sm text-gray-500">
                        <p>Lens Type: {lens.lensType}</p>
                        <p>Pack Size: {lens.packSize}</p>
                        <p>Material: {lens.material}</p>
                        <p>Water Content: {lens.waterContent}</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactLensDetail;
