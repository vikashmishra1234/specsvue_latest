"use client";

import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { lenses as LENS_DATA } from "@/LensData.json";

// --- TYPE DEFINITIONS ---
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

// --- CUSTOM HOOKS ---

/**
 * Custom hook for fetching product data.
 * Manages loading and error states automatically.
 */
const useProduct = (productId: string | undefined | string[]) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setError("Product ID is missing.");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/get-product?productId=${productId}`);
        if (res.data?.product) {
          setProduct(res.data.product);
        } else {
          throw new Error("Product not found.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};


// --- UI COMPONENTS ---



const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-blue-600"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center">
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);



const ProductImageGallery = memo(({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || "");

  if (!images?.length) return null;

  return (
    <div className="p-4 md:p-8">
      {/* Main Image */}
      <div className="relative mb-4 h-96 w-full overflow-hidden rounded-xl bg-gray-100 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image src={selectedImage} alt="Product" fill className="object-contain" priority />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img}
            onClick={() => setSelectedImage(img)}
            className={`cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 ${
              selectedImage === img ? 'border-blue-500 shadow-lg' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <div className="relative pt-[100%]">
              <Image src={img} alt="Thumbnail" fill className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
ProductImageGallery.displayName = "ProductImageGallery";


const ProductInformation = memo(({ product, onBuyNowClick }: { product: IProduct; onBuyNowClick: () => void }) => {


  return (
    <div className="flex h-full flex-col justify-center p-6 md:p-8">
      <h1 className="text-3xl font-extrabold capitalize text-gray-900 md:text-4xl">
        {`${product.frameColor} ${product.frameType} ${product.frameShape}`}
      </h1>

      <div className="my-6 flex flex-wrap gap-3">
        <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
          Size: {product.frameSize}
        </span>
        <span className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
          Frame + Lens
        </span>
      </div>

      <div className="mb-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 p-4">
        <div className="mb-2 flex items-center gap-3">
          <span className="animate-pulse rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
            {product.discount}% OFF
          </span>
        </div>
        <p className="text-4xl font-extrabold text-black">₹{product.price}</p>
      </div>

      <button
        onClick={onBuyNowClick}
        className="w-full transform rounded-xl bg-gray-800 py-4 font-bold text-white transition-all hover:scale-105 hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-300"
      >
        Select Lens & Buy Now
      </button>
    </div>
  );
});
ProductInformation.displayName = "ProductInformation";


const ProductDetailsSection = memo(({ product }: { product: IProduct }) => {
  const [showAll, setShowAll] = useState(false);

  const details = useMemo(() => {
    const excludedKeys = new Set(["_id", "images", "createdAt", "updatedAt", "__v", "price", "discount"]);
    return Object.entries(product).filter(([key]) => !excludedKeys.has(key));
  }, [product]);

  const visibleDetails = showAll ? details : details.slice(0, 6);

  return (
    <div className="mt-12 rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-800">Product Details</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {visibleDetails.map(([key, value]) => (
          <div key={key} className="transform rounded-lg border bg-gray-50 p-4 transition-shadow duration-200 hover:shadow-md">
            <p className="mb-1 text-sm font-medium capitalize text-gray-500">
              {key.replace(/([A-Z])/g, ' $1')}
            </p>
            <p className="break-words font-semibold capitalize text-gray-800">
              {String(value)}
            </p>
          </div>
        ))}
      </div>
      {details.length > 6 && (
        <div className="mt-6 text-center">
          <button onClick={() => setShowAll(!showAll)} className="font-medium text-blue-600 hover:underline">
            {showAll ? 'Show Less' : 'Show More Details'}
          </button>
        </div>
      )}
    </div>
  );
});
ProductDetailsSection.displayName = "ProductDetailsSection";



const LensSelectorModal = memo(({ product, onClose }: { product: IProduct, onClose: () => void }) => {
 
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  // Redirect if not logged in
 

  const handleAddToCart = useCallback(async (lens: LensOption,lensName:string) => {
  
    setSubmitting(true);
    try {
      const framePrice = parseFloat(product.price) || 0;
      const total = lens.price + framePrice;
      console.log(lens)
      const userId = session?(session.user.userId):localStorage.getItem("guestId");
      const payload = {
        userId,
        productId: product._id,
        lensId: lens.lensId,
        price: total,
        lensMaterial: lens.material,
        lensCoating: lens.coating,
        lensName
      };

      await axios.post("/api/add-to-cart", payload);
      localStorage.setItem("guestId",userId as string)
      router.push("/cart");

    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }, [product, session, status, router]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
          className="relative h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl"
        >
          {isSubmitting && <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70"><LoadingSpinner /></div>}
          <div className="p-6">
            <header className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">🔍 Select Yourm Lens</h2>
              <button onClick={onClose} className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800">
                <X size={24} />
              </button>
            </header>

            <div className="space-y-4">
              {LENS_DATA.map((category, index) => (
                <div
                  key={category.name}
                  onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
                  className={`cursor-pointer rounded-xl p-5 transition-all ${
                    selectedCategory === index ? 'bg-blue-100 shadow-md ring-2 ring-blue-500' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <ChevronRight className={`transform transition-transform ${selectedCategory === index ? 'rotate-90' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {selectedCategory === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '16px' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        {category.data.map((lens) => (
                          <div
                            key={lens.lensId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(lens,category.name);
                            }}
                            className="mt-2 flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 transition hover:bg-blue-50"
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
              ))}
            </div>
            
            <div className="mt-8 rounded-xl bg-gray-100 p-4 text-lg font-bold text-gray-800 flex justify-between">
              <span>Frame Price:</span>
              <span>₹{parseFloat(product.price).toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </LazyMotion>
  );
});
LensSelectorModal.displayName = "LensSelectorModal";



export default function ExploreProductPage() {
  const params = useParams();
  const { product, loading, error } = useProduct(params?.productId);
  const [isLensSelectorOpen, setLensSelectorOpen] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error || !product) return <ErrorDisplay message={error || "Product not found."} />;

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* You can re-add your InnerBanner here if needed */}
        {/* <InnerBanner ... /> */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <ProductImageGallery images={product.images} />
              </div>
              <div className="border-t border-gray-200 lg:col-span-2 lg:border-l lg:border-t-0">
                <ProductInformation product={product} onBuyNowClick={() => setLensSelectorOpen(true)} />
              </div>
            </div>
          </div>
          <ProductDetailsSection product={product} />
        </div>
      </main>

      <AnimatePresence>
        {isLensSelectorOpen && (
          <LensSelectorModal product={product} onClose={() => setLensSelectorOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}