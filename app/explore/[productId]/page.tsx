"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/app/components/Loading";
import LensSelectorModal from "../LensSelectorModal";
import { Star, ShoppingCart, Truck, ShieldCheck, RefreshCcw, Share2, Heart } from "lucide-react";
import Link from "next/link";

// --- TYPES ---
interface IProduct {
  _id: string;
  images: string[];
  frameColor: string;
  frameType: string;
  frameShape: string;
  frameSize: string;
  price: string;
  discount: number;
  brandName?: string;
  description?: string;
  modelNumber?: string;
  [key: string]: any;
}

// --- HOOK ---
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
      try {
        setLoading(true);
        const res = await axios.get(`/api/get-product?productId=${productId}`);
        setProduct(res.data?.product || null);
      } catch {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

// --- COMPONENTS ---

const SkeletonLoader = () => (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-24 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-12">
            <div className="h-[500px] bg-gray-200 rounded-3xl"></div>
            <div className="space-y-6">
                <div className="h-10 w-2/3 bg-gray-200 rounded-lg"></div>
                <div className="h-6 w-1/3 bg-gray-200 rounded-lg"></div>
                <div className="h-24 w-full bg-gray-200 rounded-lg"></div>
                <div className="flex gap-4">
                     <div className="h-14 w-full bg-gray-200 rounded-xl"></div>
                     <div className="h-14 w-full bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        </div>
    </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex min-h-[60vh] items-center justify-center bg-white px-4 text-center">
    <div className="max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Oops!</h2>
      <p className="text-gray-500 mb-6">{message}</p>
      <Link href="/products" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">
        Back to Products
      </Link>
    </div>
  </div>
);

const ProductImageGallery = memo(({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder.png");

  return (
    <div className="space-y-4 sticky top-24">
      <motion.div
        layoutId="main-image"
        className="relative bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square group"
      >
        <Image
          src={selectedImage}
          alt="Product View"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors">
                <Heart size={20} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-blue-500 transition-colors">
                <Share2 size={20} />
            </button>
        </div>
      </motion.div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
              selectedImage === img ? "border-black shadow-md ring-1 ring-black/10" : "border-transparent bg-gray-50 hover:border-gray-300"
            }`}
          >
            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover p-1" />
          </button>
        ))}
      </div>
    </div>
  );
});
ProductImageGallery.displayName = "ProductImageGallery";

const ProductSpecs = ({ product }: { product: IProduct }) => {
    return (
        <div className="mt-8 grid grid-cols-2 gap-4">
            {[
                { label: "Frame Color", value: product.frameColor },
                { label: "Frame Shape", value: product.frameShape },
                { label: "Frame Type", value: product.frameType },
                { label: "Size", value: product.frameSize },
                { label: "Model No.", value: product.modelNumber || "N/A" },
            ].map((spec, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-medium">{spec.label}</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{spec.value}</p>
                </div>
            ))}
        </div>
    )
}

const ProductInformation = memo(
  ({
    product,
    onBuyNowClick,
  }: {
    product: IProduct;
    onBuyNowClick: (isAddToCart: boolean) => void;
  }) => {
    const discountedPrice = (
      Number(product.price) -
      (Number(product.price) * product.discount) / 100
    ).toFixed(0);

    const isOutOfStock = (product.stock || 0) <= 0;

    return (
      <div className="flex flex-col h-full pl-0 lg:pl-10 pt-0 lg:pt-10">
        <div>
           {/* Header */}
          <div className="mb-2 flex items-center gap-2">
            <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full uppercase tracking-wider">
                {product.frameType}
            </span>
             {product.discount > 0 && (
                 <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full uppercase tracking-wider">
                     {product.discount}% OFF
                 </span>
             )}
             {isOutOfStock && (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    Out of Stock
                </span>
             )}
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 capitalize tracking-tight leading-tight">
            {product.brandName || "SpecsVue Original"}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
                <div className="flex text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} className="text-gray-300" />
                </div>
                <span className="text-sm text-gray-500 font-medium">4.8 (120 reviews)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-5xl font-bold text-gray-900">₹{discountedPrice}</p>
            {product.discount > 0 && (
                 <p className="text-xl text-gray-400 line-through decoration-gray-400/50">₹{product.price}</p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            {product.description || "Experience holistic vision care with our premium eyewear collection. Designed for those who value both style and substance."}
          </p>

          <hr className="border-gray-100 mb-6"/>

          {/* Specs Grid */}
          <ProductSpecs product={product} />

          {/* Trust Badges */}
          <div className="flex items-center gap-6 my-8 text-sm text-gray-500">
             <div className="flex items-center gap-2">
                 <Truck size={18} className="text-blue-600"/> <span>Fast Delivery</span>
             </div>
             <div className="flex items-center gap-2">
                 <ShieldCheck size={18} className="text-blue-600"/> <span>1 Year Warranty</span>
             </div>
             <div className="flex items-center gap-2">
                 <RefreshCcw size={18} className="text-blue-600"/> <span>7 Day Returns</span>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-6 text-lg">
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={isOutOfStock}
            onClick={() => onBuyNowClick(true)}
            className={`flex-1 px-8 py-4 border-2 font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 ${
                isOutOfStock 
                ? "bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-white border-black text-black hover:bg-gray-50"
            }`}
          >
             <ShoppingCart size={20} /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </motion.button>

          <motion.button
             whileTap={{ scale: 0.98 }}
             disabled={isOutOfStock}
             onClick={() => onBuyNowClick(false)}
             className={`flex-[1.5] px-8 py-4 font-bold rounded-2xl shadow-xl transition-all ${
                isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                : "bg-black text-white hover:bg-gray-900 hover:shadow-2xl"
             }`}
           >
             {isOutOfStock ? "Unavailable" : "Buy Now (Select Lenses)"}
           </motion.button>
        </div>
      </div>
    );
  }
);
ProductInformation.displayName = "ProductInformation";


export default function ExploreProductPage() {
  const params = useParams();
  const { product, loading, error } = useProduct(params?.productId);
  const [isLensSelectorOpen, setLensSelectorOpen] = useState(false);
  const [addToCart, setAddToCart] = useState(true);

  if (loading) return <SkeletonLoader />;
  if (error || !product) return <ErrorDisplay message={error || "Product not found"} />;

  return (
    <>
      <main className="min-h-screen bg-white pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 lg:py-16">
            
            {/* Breadcrumb - Optional */}
            <div className="text-sm font-medium text-gray-500 mb-8 flex items-center gap-2">
                <Link href="/" className="hover:text-black">Home</Link> / 
                <Link href="/products" className="hover:text-black">Explore</Link> / 
                <span className="text-black">{product.brandName}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left: Gallery */}
                <div className="relative">
                     <ProductImageGallery images={product.images} />
                </div>

                {/* Right: Info */}
                <div className="relative">
                    <ProductInformation
                        product={product}
                        onBuyNowClick={(isAdd) => {
                            setAddToCart(isAdd);
                            setLensSelectorOpen(true);
                        }}
                    />
                </div>
            </div>
        </div>
      </main>

      <AnimatePresence>
        {isLensSelectorOpen && (
          <LensSelectorModal
            addToCart={addToCart}
            product={product}
            onClose={() => setLensSelectorOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
