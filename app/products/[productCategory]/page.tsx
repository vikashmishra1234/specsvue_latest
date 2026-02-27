import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";
import ProductsPage from '../ProductsPage';
import InnerBanner from '@/app/components/client-components/InnerBanner'

export const revalidate = 300;

function toCapitalCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getInitialProductData(productCategory: string) {
  await connectToDatabase();

  const listFields =
    "_id images frameMaterial frameSize brandName price discount stock productType frameShape frameColor gender weight prescriptionType";

  const category = toCapitalCase(productCategory.replace(/-/g, " "));

  const [products, categories, genders, frameShape, frameSize, prescriptionType, weight, frameColor, frameMaterial] =
    await Promise.all([
      Product.find({ productType: { $regex: category, $options: "i" } })
        .sort({ createdAt: -1 })
        .limit(12)
        .select(listFields)
        .lean(),
      Product.distinct("productType"),
      Product.distinct("gender"),
      Product.distinct("frameShape"),
      Product.distinct("frameSize"),
      Product.distinct("prescriptionType"),
      Product.distinct("weight"),
      Product.distinct("frameColor"),
      Product.distinct("frameMaterial"),
    ]);

  const serializedProducts = (products as any[]).map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return {
    category,
    products: serializedProducts,
    filters: {
      categories,
      genders,
      frameShape,
      frameSize,
      prescriptionType,
      weight,
      frameColor,
      frameMaterial,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ productCategory: string }>;
}) {
  const { productCategory } = await params;
  const { category, products, filters } = await getInitialProductData(productCategory);



  return (
   <div>
     <InnerBanner imagePath={"/images/Product_Banner.jpg"}/>
    <ProductsPage
      productType={category}
      initialProducts={products as any[]}
      initialFilters={filters}
    />
   </div>
  );
}
