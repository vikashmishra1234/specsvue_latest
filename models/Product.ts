// models/Product.ts

import mongoose, { Schema, models, model, InferSchemaType } from 'mongoose';

const ProductSchema = new Schema(
  {
    brandName: { type: String, required: true },
    productType: { type: String, required: true },
    frameType: { type: String, required: true },
    frameShape: { type: String, required: true },
    modelNumber: { type: String, required: true},
    frameSize: { type: String, required: true },
    frameWidth: { type: String, required: true },
    frameDimensions: { type: String, required: true },
    frameColor: { type: String, required: true },
    weight: { type: String, required: true },
    weightGroup: { type: String, required: true },
    material: { type: String, required: true },
    frameMaterial: { type: String, required: true },
    templeMaterial: { type: String, required: true },
    prescriptionType: { type: String, required: true },
    frameStyle: { type: String, required: true },
    frameStyleSecondary: { type: String, required: true },
    collection: { type: String, required: true },
    productWarranty: { type: String, required: true },
    gender: { type: String, required: true },
    height: { type: String, required: true },
    condition: { type: String, required: true },
    templeColor: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: String, required: true },
    images:{type:Array,required:true}
  },
  { timestamps: true }
);

export type IProduct = InferSchemaType<typeof ProductSchema>;

const Product = models.Product || model<IProduct>('Product', ProductSchema);
// const Product =  model<IProduct>('Product', ProductSchema);

export default Product;
