"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/app/components/Loading";
import LensSelectorModal from "../LensSelectorModal";
import { Star, ShoppingCart } from "lucide-react";

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
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center">
    <div>
      <h2 className="text-2xl font-semibold text-gray-800">Oops!</h2>
      <p className="text-gray-600 mt-2">{message}</p>
    </div>
  </div>
);

const ProductImageGallery = memo(({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || "");

  return (
    <div className="p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white rounded-2xl">
      <motion.div
        key={selectedImage}
        initial={{ opacity: 0.7, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-md"
      >
        <Image
          src={selectedImage}
          alt="Product"
          fill
          className="object-contain p-4"
          priority
        />
      </motion.div>

      {/* Thumbnails */}
      <div className="flex gap-3 justify-center">
        {images.map((img) => (
          <motion.div
            key={img}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(img)}
            className={`cursor-pointer rounded-xl overflow-hidden border-2 ${
              selectedImage === img ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <Image src={img} alt="Thumbnail" width={70} height={70} className="object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  );
});
ProductImageGallery.displayName = "ProductImageGallery";

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

    return (
      <div className="flex flex-col justify-between p-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
            {product.brandName || "SpecsVue Collection"}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {product.description || "Premium eyewear designed for comfort and style."}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <Star className="text-gray-300" size={20} />
            <span className="text-sm text-gray-500">(4.0)</span>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-gray-900">₹{discountedPrice}</p>
                <p className="text-gray-400 line-through text-sm">₹{product.price}</p>
              </div>
              <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                {product.discount}% OFF
              </span>
            </div>
          </div>

          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li><b>Frame Type:</b> {product.frameType}</li>
            <li><b>Frame Shape:</b> {product.frameShape}</li>
            <li><b>Color:</b> {product.frameColor}</li>
            <li><b>Size:</b> {product.frameSize}</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onBuyNowClick(false)}
            className="w-full cursor-pointer rounded-xl bg-gray-900 py-3 text-white font-semibold hover:bg-black transition-all"
          >
            Buy Now
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onBuyNowClick(true)}
            className="w-full cursor-pointer rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} /> Add to Cart
          </motion.button>
        </div>
      </div>
    );
  }
);
ProductInformation.displayName = "ProductInformation";

const ProductDetailsSection = memo(({ product }: { product: IProduct }) => {
  const [showAll, setShowAll] = useState(false);
  const details = useMemo(() => {
    const excluded = ["_id", "images", "createdAt", "updatedAt", "__v", "price", "discount"];
    return Object.entries(product).filter(([key]) => !excluded.includes(key));
  }, [product]);

  return (
    <section className="mt-10 bg-white shadow rounded-2xl p-6">
      <h3 className="text-2xl font-semibold border-b pb-3 mb-4">Product Details</h3>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(showAll ? details : details.slice(0, 6)).map(([key, value]) => (
          <div key={key} className="border rounded-xl p-3 hover:shadow-sm transition">
            <p className="text-xs text-gray-500 uppercase">{key}</p>
            <p className="text-gray-800 font-semibold capitalize">{String(value)}</p>
          </div>
        ))}
      </div>
      {details.length > 6 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            {showAll ? "Show Less" : "Show More Details"}
          </button>
        </div>
      )}
    </section>
  );
});
ProductDetailsSection.displayName = "ProductDetailsSection";

export default function ExploreProductPage() {
  const params = useParams();
  const { product, loading, error } = useProduct(params?.productId);
  const [isLensSelectorOpen, setLensSelectorOpen] = useState(false);
  const [addToCart, setAddToCart] = useState(true);

  if (loading) return <Loading />;
  if (error || !product) return <ErrorDisplay message={error || "Product not found"} />;

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-6 bg-white rounded-3xl shadow-md overflow-hidden">
            <div className="lg:col-span-3">
              <ProductImageGallery images={product.images} />
            </div>
            <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l">
              <ProductInformation
                product={product}
                onBuyNowClick={(isAdd) => {
                  setAddToCart(isAdd);
                  setLensSelectorOpen(true);
                }}
              />
            </div>
          </div>

          <ProductDetailsSection product={product} />
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
