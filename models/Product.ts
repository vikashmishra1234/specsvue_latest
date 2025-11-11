// models/Product.ts

import mongoose, { Schema, models, model, InferSchemaType } from 'mongoose';

const ProductSchema = new Schema(
  {
    brandName: { type: String },
    productType: { type: String },
    frameType: { type: String },
    frameShape: { type: String },
    modelNumber: { type: String },
    frameSize: { type: String },
    frameWidth: { type: String },
    frameDimensions: { type: String },
    frameColor: { type: String },
    weight: { type: String },
    weightGroup: { type: String },
    material: { type: String },
    frameMaterial: { type: String },
    templeMaterial: { type: String },
    prescriptionType: { type: String },
    frameStyle: { type: String },
    frameStyleSecondary: { type: String },
    collection: { type: String },
    productWarranty: { type: String },
    gender: { type: String },
    height: { type: String },
    condition: { type: String },
    templeColor: { type: String },
    price: { type: String },
    stock: { type: String },
    discount: { type: String },
    images: { type: [String] }
  },
  { timestamps: true }
);

export type IProduct = InferSchemaType<typeof ProductSchema>;

const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;
