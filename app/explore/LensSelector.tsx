"use client";
import React, { useState, useRef, useEffect, useCallback, memo } from "react";
// 📦 OPTIMIZATION: Use LazyMotion to only load the animation features you need.
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { lenses as lensData } from "@/LensData.json"; // Static data
import { IProduct } from "@/models/Product";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import NavigatingLoading from "../components/NavigatingLoading";

// ====================================================================
// 1. Define Stronger Types
// ====================================================================
interface LensOption {
  price: number; // FIX: Use number for prices to prevent concatenation bugs.
  coating: string;
  material: string;
  lensId: string;
}

interface LensCategory {
  name: string;
  description: string;
  data: LensOption[];
}

interface Props {
  onClose: () => void;
  data: ProductType; // Assuming IProduct has _id and price
}

// ====================================================================
// 2. Create Memoized, Single-Responsibility Child Components
// ====================================================================

// Memoized component for each lens category
const LensCategoryItem = memo(({ lens, index, onSelect, isSelected }: { lens: LensCategory, index: number, onSelect: (index: number) => void, isSelected: boolean }) => (
    <motion.div
      key={lens.name}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-2xl p-5 cursor-pointer flex justify-between items-center transition-all ${isSelected ? "bg-gray-200 shadow-lg" : "bg-white shadow hover:shadow-md"}`}
      onClick={() => onSelect(index)}
    >
      <div>
        <h3 className="text-lg font-bold">{lens.name}</h3>
        <p className="text-sm mt-1 text-gray-600">{lens.description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-black" />
    </motion.div>
));
LensCategoryItem.displayName = 'LensCategoryItem'; // For better debugging

// ====================================================================
// 3. Main Optimized Component
// ====================================================================

const LensSelector: React.FC<Props> = ({ onClose, data }) => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading,setLoading]  = useState(false)
  const detailsRef = useRef<HTMLDivElement | null>(null);

  // ⚡️ PERFORMANCE: Check auth status only when it changes, not on every path change.
  useEffect(() => {
    if (status === 'unauthenticated') {
      sessionStorage.setItem("navigateAfterLogin", pathName);
      router.push('/login');
    }
  }, [status, router, pathName]);


  useEffect(() => {
    if (selectedIndex !== null) {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedIndex]);
  
  // ⚡️ PERFORMANCE: Memoize handlers to prevent re-creation on each render.
  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleCart = useCallback(async (item: LensOption, name: string) => {
    if (!session?.user.userId) {
        alert("You must be logged in to add items to the cart.");
        return;
    }

    // 🐛 BUG FIX: Correctly parse frame price and add to lens price.
    const framePrice = parseInt(data.price, 10) || 0;
    const priceOfLensPlusFrame = item.price + framePrice;

    const newData = {
      lensId: item.lensId,
      productId: data._id,
      price: priceOfLensPlusFrame,
      lensMaterial: item.material,
      lensCoating: item.coating,
      lensName: name,
      userId: session.user.userId,
    };

    try {
      // NOTE: Consider a global loading state here.
      setLoading(true)
      await axios.post("/api/add-to-cart", newData);
      router.push("/cart");
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  }, [data._id, data.price, router, session]);
  
  const selectedLens = selectedIndex !== null ? lensData[selectedIndex] : null;

  return (
    // 📦 Use LazyMotion provider
    <LazyMotion features={domAnimation}>
      {loading&&<NavigatingLoading/>}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-end z-40">
      <div className="w-full flex items-center justify-center mt-10 ">
       {
       <img src={data.images[0]} alt="product_image" className="rounded-3xl  mx-auto" />
       }
      </div>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          // ⚡️ PERFORMANCE: Simplified transition for better performance.
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
          className="w-full sm:w-3/4 md:w-1/2 lg:w-2/5 h-full bg-white shadow-2xl overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-black">🔍 Select Your Lens</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-black transition-colors"
                aria-label="Close lens selector"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {lensData.map((lens: LensCategory, index: number) => (
                <LensCategoryItem
                  key={lens.name}
                  lens={lens}
                  index={index}
                  onSelect={handleSelect}
                  isSelected={selectedIndex === index}
                />
              ))}
            </div>

            {selectedLens && (
              <motion.div
                ref={detailsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 rounded-2xl bg-white p-6 shadow-lg"
              >
                <h4 className="text-lg font-bold mb-4 text-black">✓ Available Options</h4>
                <div className="space-y-4">
                  {selectedLens.data.map((item: LensOption) => (
                    <motion.div
                      key={item.lensId} // Use a unique ID like lensId for the key
                      onClick={() => handleCart(item, selectedLens.name)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-100 cursor-pointer shadow hover:shadow-md hover:bg-gray-200 transition-all p-4 rounded-xl"
                    >
                        {/* REFACTOR: Render properties explicitly for clarity and performance */}
                        <div className="flex justify-between items-center">
                            <p><span className="font-medium">Material:</span> {item.material}</p>
                            <p className="text-lg font-bold">₹{item.price}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Coating:</span> {item.coating}
                        </p>
                    </motion.div>
                  ))}
                </div>
                 <h2 className="text-lg font-bold text-black mt-6 p-4 bg-gray-100 rounded-xl shadow flex justify-between items-center">
                    <span>Frame Price:</span>
                    <span>₹{data.price}</span>
                  </h2>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </LazyMotion>
  );
};

// ⚡️ PERFORMANCE: Wrap the main export in React.memo
export default memo(LensSelector);