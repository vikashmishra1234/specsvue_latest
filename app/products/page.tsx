import ProductsPage from "./ProductsPage";
import InnerBanner from "@/app/components/client-components/InnerBanner"
import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";

export const revalidate = 300;

async function getInitialProductData() {
  await connectToDatabase();

  const listFields =
    "_id images frameMaterial frameSize brandName price discount stock productType frameShape frameColor gender weight prescriptionType";

  const [products, categories, genders, frameShape, frameSize, prescriptionType, weight, frameColor, frameMaterial] =
    await Promise.all([
      Product.find({}).sort({ createdAt: -1 }).limit(12).select(listFields).lean(),
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

export default async function Page(){
  const { products, filters } = await getInitialProductData();

  return(
    <div>
      <InnerBanner imagePath={"/images/Product_Banner.jpg"}/>
      <ProductsPage productType={null} initialProducts={products as any[]} initialFilters={filters} />
    </div>
  )
}
