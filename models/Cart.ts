
import { Schema, model, models, InferSchemaType } from "mongoose";
import Product from "@/models/Product"; 

const CartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    cartProductId:{type:String},
    lensId: { type: String, required: true },
    lensName: { type: String, required: true },
    lensCoating: { type: String, required: true },
    lensMaterial: { type: String, required: true },
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

const Cart = models.Cart || model<ICart>("Cart", CartSchema);

export default Cart;
