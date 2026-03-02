"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Truck, ShieldCheck, Share2, ChevronDown, ChevronUp, Lock } from "lucide-react";
import Link from "next/link";
import LensSelectorModal from "../LensSelectorModal";

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
  stock?: number;
  [key: string]: any;
}

// --- HOOK ---
const useProduct = (productId: string | undefined | string[]) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const normalizedProductId = Array.isArray(productId) ? productId[0] : productId;

    if (!normalizedProductId || typeof normalizedProductId !== "string") {
      setLoading(false);
      setError("Product ID is missing.");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const safeProductId = encodeURIComponent(normalizedProductId.trim());
        const res = await axios.get(`/api/get-product?productId=${safeProductId}`);
        setProduct(res.data?.product || null);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) {
          setError("Product not found.");
        } else if (status === 400) {
          setError("Invalid product link.");
        } else {
          setError("Failed to load product details.");
        }
        setProduct(null);
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
  <div className="min-h-screen bg-white pb-32">
    {/* Mobile Skeleton */}
    <div className="lg:hidden">
      <div className="w-full aspect-square bg-gray-200 animate-pulse"></div>
      <div className="px-4 py-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    </div>
    
    {/* Desktop Skeleton */}
    <div className="hidden lg:block max-w-7xl mx-auto px-8 py-16 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="aspect-square w-full bg-gray-200 rounded-3xl"></div>
        <div className="space-y-6">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="flex gap-4">
            <div className="h-16 flex-1 bg-gray-200 rounded-xl"></div>
            <div className="h-16 flex-1 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center">
    <div className="max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Oops!</h2>
      <p className="text-gray-500 mb-6">{message}</p>
      <Link href="/products" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">
        Back to Products
      </Link>
    </div>
  </div>
);

// Desktop Image Gallery
const DesktopImageGallery = memo(({ images }: { images: string[] }) => {
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
          sizes="50vw"
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Check out this product on Specsvue',
                  url: window.location.href,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className="p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>
      </motion.div>

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
DesktopImageGallery.displayName = "DesktopImageGallery";

// Mobile Image Gallery
const MobileImageGallery = memo(({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder.png");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageChange = (img: string, idx: number) => {
    setSelectedImage(img);
    setSelectedIndex(idx);
  };

  return (
    <div className="relative bg-gray-50">
      <div className="relative w-full aspect-square">
        <Image
          src={selectedImage}
          alt="Product"
          fill
          sizes="100vw"
          className="object-contain p-6"
          priority
        />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button 
             onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Check out this product on Specsvue',
                  url: window.location.href,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className="p-3 bg-white rounded-full shadow-lg active:scale-95 transition-transform"
          >
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => handleImageChange(img, idx)}
            className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              selectedIndex === idx ? "border-black ring-2 ring-black/20" : "border-gray-200"
            }`}
          >
            <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
});
MobileImageGallery.displayName = "MobileImageGallery";

const ProductSpecs = ({ product }: { product: IProduct }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
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
  );
};

// Desktop Product Info
const DesktopProductInfo = memo(({
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

  const savings = Number(product.price) - Number(discountedPrice);

  const isOutOfStock = (product.stock || 0) <= 0;

  return (
    <div className="flex flex-col h-full pl-0 lg:pl-12 pt-0">
      <div>
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

        <h1 className="text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-4 capitalize tracking-tight leading-tight">
          {product.brandName || "SpecsVue Original"}
        </h1>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">4.8 (120 reviews)</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <p className="text-3xl lg:text-4xl font-bold font-serif text-gray-900">₹{discountedPrice}</p>
          {product.discount > 0 && (
            <>
              <p className="text-xl text-gray-400 line-through decoration-gray-400/50">₹{product.price}</p>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                Save ₹{savings}
              </span>
            </>
          )}
        </div>

        <div className="space-y-4 mb-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Description</h3>
            <p className="text-gray-600 text-base leading-relaxed">
              {product.description || "Experience holistic vision care with our premium eyewear collection. Designed for those who value both style and substance."}
            </p>
        </div>

        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Specifications</h3>
            <ProductSpecs product={product} />
        </div>

        <div className="flex flex-wrap items-center gap-6 my-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-blue-600"/> <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600"/> <span>{product.warranty || "1 Year Warranty"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-blue-600"/> <span>Secure Payment</span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-4 pt-6 text-lg">
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
});
DesktopProductInfo.displayName = "DesktopProductInfo";

// Mobile Product Info
const MobileProductInfo = memo(({
  product,
  onBuyNowClick,
}: {
  product: IProduct;
  onBuyNowClick: (isAddToCart: boolean) => void;
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  const discountedPrice = (
    Number(product.price) -
    (Number(product.price) * product.discount) / 100
  ).toFixed(0);

  const isOutOfStock = (product.stock || 0) <= 0;
  const savings = Number(product.price) - Number(discountedPrice);

  return (
    <>
      <div className="px-4 py-6 space-y-6 pb-40">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full uppercase">
            {product.frameType}
          </span>
          {isOutOfStock && (
            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full uppercase">
              Out of Stock
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-2 leading-tight">
            {product.brandName || "SpecsVue Original"}
          </h1>
          <p className="text-sm text-gray-500">Model: {product.modelNumber || "N/A"}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-sm text-gray-600">4.8 (120)</span>
        </div>

        <div className="flex items-baseline gap-3 py-4 border-y border-gray-100">
          <span className="text-3xl font-bold font-serif text-gray-900">₹{discountedPrice}</span>
          {product.discount > 0 && (
            <>
              <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                Save ₹{savings}
              </span>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 py-2">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-2">
              <Truck size={20} className="text-blue-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Fast Delivery</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-2">
              <ShieldCheck size={20} className="text-blue-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">{product.warranty || "1 Yr Warranty"}</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-2">
              <Lock size={20} className="text-blue-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <span className="font-semibold text-gray-900">Description</span>
            {showFullDescription ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {showFullDescription && (
            <div className="p-4 text-sm text-gray-600 leading-relaxed">
              {product.description || "Experience holistic vision care with our premium eyewear collection. Designed for those who value both style and substance."}
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <span className="font-semibold text-gray-900">Specifications</span>
            {showSpecs ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {showSpecs && (
            <div className="p-4 space-y-3">
              {[
                { label: "Frame Color", value: product.frameColor },
                { label: "Frame Shape", value: product.frameShape },
                { label: "Frame Type", value: product.frameType },
                { label: "Size", value: product.frameSize },
                { label: "Model Number", value: product.modelNumber || "N/A" },
              ].map((spec, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-500">{spec.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
        <div className="flex gap-3">
          <button
            disabled={isOutOfStock}
            onClick={() => onBuyNowClick(true)}
            className={`flex-1 py-4 px-4 border-2 font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-gray-100 border-gray-200 text-gray-400"
                : "bg-white border-black text-black active:bg-gray-50"
            }`}
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Add to Cart</span>
          </button>

          <button
            disabled={isOutOfStock}
            onClick={() => onBuyNowClick(false)}
            className={`flex-[2] py-4 px-6 font-bold rounded-xl shadow-xl transition-all active:scale-95 ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 shadow-none"
                : "bg-black text-white active:bg-gray-900"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "Buy Now"}
          </button>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total Price</p>
            <p className="text-lg font-bold text-gray-900">₹{discountedPrice}</p>
          </div>
          {product.discount > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">You Save</p>
              <p className="text-sm font-bold text-green-600">
                ₹{savings} ({product.discount}%)
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
});
MobileProductInfo.displayName = "MobileProductInfo";

// Main Component
export default function ExploreProductPage() {
  const params = useParams();
  const { product, loading, error } = useProduct(params?.productId);
  const [isLensSelectorOpen, setLensSelectorOpen] = useState(false);
  const [addToCart, setAddToCart] = useState(true);

  if (loading) return <SkeletonLoader />;
  if (error || !product) return <ErrorDisplay message={error || "Product not found"} />;

  return (
    <>
      {/* Desktop View */}
      <main className="hidden lg:block min-h-screen bg-white pb-20">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-sm font-medium text-gray-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-black">Home</Link> / 
            <Link href="/products" className="hover:text-black">Explore</Link> / 
            <span className="text-black">{product.brandName}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <DesktopImageGallery images={product.images} />
            <DesktopProductInfo
              product={product}
              onBuyNowClick={(isAdd) => {
                setAddToCart(isAdd);
                setLensSelectorOpen(true);
              }}
            />
          </div>
        </div>
      </main>

      {/* Mobile View */}
      <main className="lg:hidden min-h-screen bg-white">
        <MobileImageGallery images={product.images} />
        <MobileProductInfo
          product={product}
          onBuyNowClick={(isAdd) => {
            setAddToCart(isAdd);
            setLensSelectorOpen(true);
          }}
        />
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

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
