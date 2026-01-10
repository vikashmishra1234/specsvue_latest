"use server"
import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";

export default async function getAllOrders(params: any = {}) {
  try {
    await connectToDatabase();
    
    const { 
        page = 1, 
        limit = 5, 
        search, 
        status, 
        date, 
        minPrice, 
        maxPrice, 
        type // 'requests' for cancellation requests
    } = params;

    const skip = (Number(page) - 1) * Number(limit);
    const query: any = {};

    // Filter Logic
    if (type === 'requests') {
        query.orderStatus = 'Requested Cancellation';
    }

    if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        query.$or = [
            { orderId: searchRegex },
            { "frameDetails.brandName": searchRegex },
            { "frameDetails.modelNumber": searchRegex },
            { "contactLensDetails.name": searchRegex },
            // Note: Searching inside polymorphic objects might be tricky if not strict, but this covers main fields
        ];
    }

    if (status) {
        query.orderStatus = status;
    }

    if (date) {
        // Match explicit date (YYYY-MM-DD)
        const startDate = new Date(date);
        startDate.setHours(0,0,0,0);
        const endDate = new Date(date);
        endDate.setHours(23,59,59,999);
        query.createdAt = { $gte: startDate, $lte: endDate };
    }

    if (minPrice || maxPrice) {
        query.totalAmount = {};
        if (minPrice) query.totalAmount.$gte = Number(minPrice);
        if (maxPrice) query.totalAmount.$lte = Number(maxPrice);
    }

    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
        
    const totalCount = await Order.countDocuments(query);

    return {
       success: true,
       data: JSON.parse(JSON.stringify(orders)),
       pagination: {
           currentPage: Number(page),
           totalPages: Math.ceil(totalCount / Number(limit)),
           totalOrders: totalCount,
           hasMore: skip + orders.length < totalCount
       },
       message: "Orders fetched successfully"
    };

  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      message: "Database error",
    };
  }
}
