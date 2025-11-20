import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  boxCount: number;
  leftSPH?: string | null;
  rightSPH?: string | null;
}

export interface IContactLensCart extends Document {
  userId: string;
  items: ICartItem[];
  cartTotal: number;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactLens",
      required: true,
    },
    boxCount: { type: Number, required: true, default: 1, min: 1 },
    leftSPH: { type: String, default: null },
    rightSPH: { type: String, default: null },
  },
  { _id: false }
);

const contactLensCartSchema = new Schema<IContactLensCart>(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    cartTotal: {
      type: Number,
      default: 0, // 👈 IMPORTANT FIX
    },
  },
  { timestamps: true }
);

export const ContactLensCart: Model<IContactLensCart> =
  mongoose.models.ContactLensCart ||
  mongoose.model<IContactLensCart>("ContactLensCart", contactLensCartSchema);
