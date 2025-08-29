// models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  lensName?: string;
  lensCoating?: string;
  lensMaterial?: string;
  quantity: number;
}

export interface IOrder extends Document {
  userId: string;
  address: {
    name: string;
    houseNumberOrBuildingName: string;
    areaOrLocality: string;
    landmark: string;
    pincode: string;
    phone: string;
  };
  items: OrderItem[];
  totalAmount: number;
  razorpay_payment_id:string;
  paymentStatus: "pending" | "paid";
  orderStatus: "processing" | "shipped" | "delivered";
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, ref: "User", required: true },
    address: {
      name: String,
      houseNumberOrBuildingName: String,
      areaOrLocality: String,
      landmark: String,
      pincode: String,
      phone: String,
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        lensName: String,
        lensCoating: String,
        lensMaterial: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: Number,
    razorpay_payment_id:String,
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    orderStatus: { type: String, enum: ["processing", "shipped", "delivered","cancelled"], default: "processing" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
