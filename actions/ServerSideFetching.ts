
import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";

export const getAllUserOrders = async(userId:string) =>{
    if(!userId){
        return;
    }
    await connectToDatabase()
    
     const orders = await Order.find({
    userId,
    orderStatus: { $ne: "cancelled" }, // ⛔️ exclude canceled orders
  });
    return orders
}

export const getAllCancelledOrders = async(userId:string) =>{
    if(!userId){
        return;
    }
    await connectToDatabase()
    
    const cancelledOrders = await Order.find({
  userId,
  orderStatus: "cancelled", 
});
    return cancelledOrders
}

export const fetchUser = async(userId:string, email: string) =>{
  try {
      if(!userId && !email){
          return null;
      }
      await connectToDatabase()
      
      let query: any = {};
      if (userId) query.userId = userId;
      else if (email) query.email = email;
      
      let user = null;
      if (userId) {
          user = await User.findOne({ userId });
      }
      
      if (!user && email) {
          console.log("User not found by userId, trying email:", email);
          user = await User.findOne({ email });
      }
      
      return user
  } catch (error) {
    console.error("Error fetching user:", error);
    return null
  }
}
