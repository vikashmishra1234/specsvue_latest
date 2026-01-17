"use server"
import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";

export default async function getAllProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  try {
    await connectToDatabase();

    const page = params.page || 1;
    const limit = params.limit || 0; // 0 means all if not specified, or we can default to 10
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params.search) {
      const searchRegex = { $regex: params.search, $options: "i" };
      query.$or = [
        { brandName: searchRegex },
        { modelNumber: searchRegex },
        { frameType: searchRegex },
        { collection: searchRegex },
      ];
    }

    let productQuery = Product.find(query).sort({ createdAt: -1 });

    if (limit > 0) {
      productQuery = productQuery.skip(skip).limit(limit);
    }

    const [products, total] = await Promise.all([
      productQuery.exec(),
      Product.countDocuments(query),
    ]);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
      pagination: {
        totalProducts: total,
        currentPage: page,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        hasMore: limit > 0 ? skip + products.length < total : false,
      },
      message: "Products fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: "Database error",
    };
  }
}
