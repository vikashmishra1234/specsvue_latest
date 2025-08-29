"use server"
import { connectToDatabase } from "@/lib/dbConnect";
import Product from "@/models/Product"

export async function deleteProduct(productId:string){
    if(!productId){
        return {status:404,message:'please send product Id'}
    }
   try {
    await connectToDatabase()
     await Product.findByIdAndDelete(productId);
     return {status:200,message:"Product has been deleted"}
    } catch (error) {
        return {status:500,message:"Error while deleting the product"}
    }
}