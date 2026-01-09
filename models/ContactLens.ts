import mongoose, { Schema, models, model, InferSchemaType } from 'mongoose';

const ContactLensSchema = new Schema(
  {
    name: { type: String, required: true },
    brandName: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number }, // Discounted price
    stock: { type: Number, default: 0 },
    
    // Lens Specifics
    lensType: { type: String, enum: ['Daily', 'Bi-weekly', 'Monthly', 'Yearly'], required: true },
    material: { type: String },
    waterContent: { type: String },
    baseCurve: { type: [Number], required: true }, // Array of available base curves
    diameter: { type: [Number], required: true },   // Array of available diameters
    
    // Power/Prescription Availability
    powerMin: { type: Number, required: true },
    powerMax: { type: Number, required: true },
    powerStep: { type: Number, default: 0.25 },
    
    // Astigmatism (Toric)
    isToric: { type: Boolean, default: false },
    cylinderMin: { type: Number },
    cylinderMax: { type: Number },
    cylinderStep: { type: Number },
    axisMin: { type: Number },
    axisMax: { type: Number },
    axisStep: { type: Number },

    // Colors (for colored lenses)
    colors: { type: [String], default: [] },
    
    packSize: { type: String }, // e.g., "30 lenses per box"

    featureImages: { type: [String], default: [] }, // Carousel images
    images: { type: [String], default: [] }, // Product images
  },
  { timestamps: true }
);

export type IContactLens = InferSchemaType<typeof ContactLensSchema>;

const ContactLens = models.ContactLens || model<IContactLens>('ContactLens', ContactLensSchema);

export default ContactLens;
