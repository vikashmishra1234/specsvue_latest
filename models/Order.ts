// models/Order.ts
import mongoose, { Schema, Document } from "mongoose";

interface OrderedFrameDetails {
  brandName?: string;
  productType?: string;
  frameType?: string;
  frameShape?: string;
  modelNumber?: string;
  frameColor?: string;
  frameMaterial?: string;
  templeMaterial?: string;
  prescriptionType?: string;
  frameStyle?: string;
  gender?: string;
  price?: string | number;
  discount?: string | number;
  images?: string[];
}

export interface IOrder extends Document {
  orderId: string;
  transactionId?: string;
  userId: string;
  productId: string;
  frameDetails?: OrderedFrameDetails;
  lensName?: string;
  lensCoating?: string;
  lensMaterial?: string;
  quantity: number;
  price: number;      // price per unit at time of purchase (number)
  subtotal: number;   // price * quantity
  shippingCharge?: number;
  tax?: number;
  discount?: number;
  totalAmount: number; // subtotal + shipping + tax - discount
  paymentMethod?: "razorpay" | "cod" | "card" | "upi";
  razorpay_payment_id?: string;
  paymentStatus: "pending" | "paid";
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled" | "Requested Cancellation";
  delivery?: {
    courierName?: string;
    trackingId?: string;
    estimatedDeliveryDate?: Date;
    deliveredAt?: Date;
  };
  statusHistory?: { status: string; updatedAt: Date; comment?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    transactionId: { type: String, index: true },

    userId: { type: String },

    productId: {type:String, required: true },

    frameDetails: {
      brandName: String,
      productType: String,
      frameType: String,
      frameShape: String,
      modelNumber: String,
      frameColor: String,
      frameMaterial: String,
      templeMaterial: String,
      prescriptionType: String,
      frameStyle: String,
      gender: String,
      price: Schema.Types.Mixed,
      discount: Schema.Types.Mixed,
      images: [String],
    },

    // lens / customization
    lensName: String,
    lensCoating: String,
    lensMaterial: String,

    // pricing & qty
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },    // snapshot price per unit
    subtotal: { type: Number, required: true }, // price * quantity

    // charges & totals
    shippingCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // payment & order state
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod", "card", "upi"],
      default: "razorpay",
    },
    razorpay_payment_id: String,
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },

    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled","Requested Cancellation"],
      default: "processing",
    },

    delivery: {
      courierName: String,
      trackingId: String,
      estimatedDeliveryDate: Date,
      deliveredAt: Date,
    },

    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
