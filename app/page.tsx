import { Metadata } from 'next';
import Hero from "./components/client-components/Hero";
import CategorySplit from "./components/landing/CategorySplit";
import TrendingProducts from "./components/landing/TrendingProducts";
import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";
import ContactLens from "@/models/ContactLens";
import FooterContact from "./components/Home/FooterContact";

export const metadata: Metadata = {
  title: "Specsvue | Premium Eyewear & Contact Lenses",
  description: "Shop the latest collection of trendy eyeglasses, sunglasses, and contact lenses at Specsvue. Best prices and fast delivery.",
};

async function getTrendingProducts() {
    try {
        await connectToDatabase();
        
        // Fetch 4 frames and 4 lenses for variety
        const frames = await Product.find({}).limit(4).lean();
        const lenses = await ContactLens.find({}).limit(4).lean();
        
        // Transform for component
        const formattedFrames = frames.map((p: any) => ({
            _id: p._id.toString(),
            images: p.images,
            brandName: p.brandName,
            modelNumber: p.modelNumber,
            price: p.price,
            discount: p.discount,
            type: 'Frame' as const
        }));
        
        const formattedLenses = lenses.map((p: any) => ({
            _id: p._id.toString(),
            images: p.images,
            name: p.name,
            price: p.price,
            discount: 0, // Contact lenses logic might differ, setting 0 for now or p.discount if exists
            type: 'ContactLens' as const
        }));

        return [...formattedFrames, ...formattedLenses].slice(0, 8); // logical mix

    } catch (error) {
        console.error("Error fetching trending products:", error);
        return [];
    }
}

export default async function Page() {
  const trendingProducts = await getTrendingProducts();

  return (
    <main>
      <Hero />
      <CategorySplit />
      <TrendingProducts products={trendingProducts} />
      <FooterContact />
    </main>
  );
}
