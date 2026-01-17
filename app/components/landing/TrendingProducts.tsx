"use client";
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data, or could handle fetching
// In a server component approach, we would pass data as props.
// For now, let's create a reusable client component that accepts `products` prop.

interface Product {
    _id: string;
    images: string[];
    brandName?: string;
    modelNumber?: string;
    name?: string; // For lenses
    price: number;
    discount?: number;
    type: 'Frame' | 'ContactLens';
}

const TrendingProducts = ({ products }: { products: Product[] }) => {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Now</h2>
                        <p className="text-gray-500">Top picks for this season</p>
                    </div>
                    <Link href="/products" className="hidden sm:flex items-center gap-2 font-semibold text-black hover:text-gray-600 transition">
                        View All <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                         <Link 
                            key={product._id} 
                            href={product.type === 'ContactLens' ? `/contact-lenses/${product._id}` : `/explore/${product._id}`}
                            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
                        >
                            <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={product.images?.[0] || '/no-image.png'}
                                    alt={product.brandName || product.name || "Product"}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 p-2"
                                />
                                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1 z-10">
                                    4.5 <Star size={10} className="fill-yellow-400 text-yellow-400"/>
                                </div>
                                {product.discount ? (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm z-10">
                                        {product.discount}% OFF
                                    </div>
                                ) : null}
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-gray-500 font-medium">
                                    {product.type === 'ContactLens' ? 'Contact Lens' : product.brandName}
                                </p>
                                <h3 className="font-bold text-gray-900 truncate">
                                    {product.type === 'ContactLens' ? product.name : `${product.brandName} ${product.modelNumber}`}
                                </h3>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹
                                            {product.discount
                                                ? (product.price - (product.price * product.discount) / 100).toFixed(0)
                                                : product.price}
                                        </span>
                                        {product.discount ? (
                                            <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                                        ) : null}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                        <ArrowRight size={16}/>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                 <div className="mt-8 text-center sm:hidden">
                    <Link href="/products" className="inline-flex items-center gap-2 font-semibold text-black px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50">
                        View All Products <ArrowRight size={18} />
                    </Link>
                 </div>
            </div>
        </section>
    );
};

export default TrendingProducts;
