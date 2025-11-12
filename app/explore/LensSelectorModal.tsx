"use client";

import { memo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, ChevronRight } from "lucide-react";
import { lenses as LENS_DATA } from "@/LensData.json";

interface IProduct {
  _id: string;
  images: string[];
  frameColor: string;
  frameType: string;
  frameShape: string;
  frameSize: string;
  price: string;
  discount: number;
  [key: string]: any; // For other dynamic properties
}

interface LensOption {
  price: number;
  coating: string;
  material: string;
  lensId: string;
}

const LensSelectorModal = memo(({addToCart, product, onClose }: { addToCart:boolean,product: IProduct; onClose: () => void }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = useCallback(
    async (lens:LensOption , lensName: string) => {
      try {
        setLoading(true);
        const framePrice = Number(product.price) || 0;
        const total = lens.price + framePrice;

        const userId = session ? session.user.userId : localStorage.getItem("guestId") || crypto.randomUUID();

        const payload = {
          userId,
          productId: product._id,
          cartProductId: product._id,
          lensId: lens.lensId,
          price: total,
          lensMaterial: lens.material,
          lensCoating: lens.coating,
          lensName,
        };

        await axios.post("/api/add-to-cart", payload);
        localStorage.setItem("guestId", userId as string);
        if(addToCart){
          onClose();
          alert("Added To Cart")
        }
        else{
          router.push("/cart");
        }
      } catch (error) {
        console.error("Add to cart failed:", error);
        alert("Something went wrong. Please try again.");
        setLoading(false);
      }
    },
    [product, session, router]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 250 }}
        className="relative h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl"
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <span className="animate-spin rounded-full border-4 border-gray-400 border-t-transparent h-10 w-10"></span>
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <header className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Select Your Lens</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              aria-label="Close"
            >
              <X cursor={'pointer'} size={22} />
            </button>
          </header>

          {/* Categories */}
          <div className="space-y-4">
            {LENS_DATA.map((category, index) => {
              const isOpen = selectedCategory === index;
              return (
                <div
                  key={category.name}
                  onClick={() => setSelectedCategory(isOpen ? null : index)}
                  className={`cursor-pointer rounded-xl p-5 transition-all ${
                    isOpen ? "bg-blue-100 shadow-md ring-2 ring-blue-500" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <ChevronRight className={`transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 space-y-2"
                      >
                        {category.data.map((lens) => (
                          <div
                            key={lens.lensId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(lens, category.name);
                            }}
                            className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-3 transition hover:bg-blue-50"
                          >
                            <div>
                              <p className="font-semibold">{lens.material}</p>
                              <p className="text-sm text-gray-500">{lens.coating}</p>
                            </div>
                            <p className="text-lg font-bold">₹{lens.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Frame Price */}
          <div className="mt-8 flex justify-between rounded-xl bg-gray-100 p-4 text-lg font-bold text-gray-800">
            <span>Frame Price:</span>
            <span>₹{Number(product.price).toFixed(2)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

LensSelectorModal.displayName = "LensSelectorModal";
export default LensSelectorModal;
