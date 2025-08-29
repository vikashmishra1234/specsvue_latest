'use server'

import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function updateProduct(productId: string, updatedData: any) {
  if (!productId) {
    return { status: 404, message: 'Please provide a product ID' };
  }

  try {
    await connectToDatabase();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true } // returns the updated document
    );

    if (!updatedProduct) {
      return { status: 404, message: 'Product not found' };
    }

    return { status: 200, message: 'Product updated successfully', data: updatedProduct };
  } catch (error) {
    console.error('Error updating product:', error);
    return { status: 500, message: 'Error while updating the product' };
  }
}
