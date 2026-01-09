
import { Schema, model, models, InferSchemaType } from "mongoose";
import mongoose from "mongoose";
import Product from "@/models/Product"; 

const CartItemSchema = new Schema(
  {
    productId: { type: String, required: true }, // Can be Product ID or ContactLens ID
    productType: { type: String, enum: ['Frame', 'ContactLens'], default: 'Frame' },
    cartProductId:{type:String},
    // For Frames
    lensId: { type: String }, 
    lensName: { type: String },
    lensCoating: { type: String },
    lensMaterial: { type: String },
    
    // For Contact Lenses
    power: { type: Number },
    cylinder: { type: Number },
    axis: { type: Number },
    baseCurve: { type: Number },
    diameter: { type: Number },
    color: { type: String },
    
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }, // price at time of adding
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true }, // reference to user
    cartTotal:{type:Number,required:true},
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

export type ICart = InferSchemaType<typeof CartSchema>;

// Prevent duplicate model compilation error in dev
// delete models.Cart // Uncomment if needed during dev to force schema refresh, or use the pattern below carefully
// ideally:
if (mongoose.models.Cart) {
    delete mongoose.models.Cart;
}

const Cart = model<ICart>("Cart", CartSchema);

export default Cart;
