import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactLens extends Document {
  name: string;
  brand: string;
  disposability: string;
  type?: string;
  color?: string | null;
  collections?: string | null;
  description?: string;
  price: number;
  rating: {
    avg: number;
    count: number;
  };
  prescriptionType: "Power" | "Zero Power" | "Both";
  lensesPerBox: number;
  images: string[]; // 👈 Correct typing
  isBestSeller: boolean;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const contactLensSchema: Schema<IContactLens> = new Schema(
  {
    name: { type: String, required: true },

    brand: { type: String, required: true, index: true },

    disposability: {
      type: String,
      enum: ["Daily Disposable", "Monthly Disposable", "Weekly Disposable", "Yearly Disposable"],
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["Spherical", "Toric", "Multifocal", "Cosmetic", "Color", "Plano"],
      default: "Spherical",
      index: true,
    },

    color: { type: String, default: null, index: true },

    collections: { type: String, default: null },

    description: { type: String },

    price: { type: Number, required: true },

    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    prescriptionType: {
      type: String,
      enum: ["Power", "Zero Power", "Both"],
      default: "Power",
    },

    lensesPerBox: { type: Number, required: true },

    images: {
      type: [String], // 👈 FIXED
      required: true,
      default: [],
    },

    isBestSeller: { type: Boolean, default: false },

    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ContactLens: Model<IContactLens> =
  mongoose.models.ContactLens ||
  mongoose.model<IContactLens>("ContactLens", contactLensSchema);
