import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";

export const getAllUserOrders = async(userId:string) =>{
    if(!userId){
        return;
    }
    await connectToDatabase()
  await Product.find({})
     const orders = await Order.find({
    userId,
    orderStatus: { $ne: "cancelled" }, // ⛔️ exclude canceled orders
  }).populate("items.productId");
    return orders
}

export const getAllCancelledOrders = async(userId:string) =>{
    if(!userId){
        return;
    }
    await connectToDatabase()
  await Product.find({})
    const cancelledOrders = await Order.find({
  userId,
  orderStatus: "cancelled", 
}).populate("items.productId");
    return cancelledOrders
}
export const fetchUser = async(userId:string) =>{
  try {
      if(!userId){
          return;
      }
      await connectToDatabase()
      const user =await User.findOne({userId});
      return user
  } catch (error) {
    return null
  }
}