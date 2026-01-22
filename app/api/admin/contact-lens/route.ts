import { NextResponse } from "next/server";
import ContactLens from "@/models/ContactLens";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload buffer to Cloudinary
const uploadFileToCloudinary = (file: File, folder: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const stream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) {
              console.error("Cloudinary Upload Error:", error);
              return reject(error);
          }
          if (result) {
              return resolve(result.secure_url);
          }
          reject(new Error("Cloudinary upload failed with no result"));
        }
      );

      Readable.from(buffer).pipe(stream);
    } catch (err) {
        console.error("Error preparing file for upload:", err);
        reject(err);
    }
  });
};

// Ensure database connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

// Shared Form Processing
async function processFormData(formData: FormData) {
    const body: any = {};
    const textFields = [
      'name', 'brandName', 'description', 'price', 'salePrice', 'stock',
      'lensType', 'material', 'waterContent', 'packSize',
      'powerMin', 'powerMax', 'powerStep',
      'cylinderMin', 'cylinderMax', 'cylinderStep',
      'axisMin', 'axisMax', 'axisStep'
    ];
    
    textFields.forEach(field => {
       const value = formData.get(field);
       if (value) body[field] = value;
    });

    const arrayFields = ['baseCurve', 'diameter', 'colors'];
    arrayFields.forEach(field => {
      const value = formData.get(field);
      if (value) {
        try {
            if (typeof value === 'string' && value.includes(',')) {
                 body[field] = value.split(',').map(v => v.trim());
            } else {
                 body[field] = JSON.parse(value as string);
            }
        } catch (e) {
             body[field] = [value];
        }
      }
    });

    body.isToric = formData.get('isToric') === 'true';
    return body;
}

// Upload Helper for Arrays
async function handleImageUploads(formData: FormData, fieldName: string) {
    const files = formData.getAll(fieldName) as File[];
    const urls = [];
    for (const file of files) {
        if(file.size > 0 && file.name) {
            const url = await uploadFileToCloudinary(file, 'contact-lenses');
            urls.push(url);
        }
    }
    return urls;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();
    const body = await processFormData(formData);

    const featureImages = await handleImageUploads(formData, "featureImages");
    const productImages = await handleImageUploads(formData, "images");

    if (featureImages.length > 0) body.featureImages = featureImages;
    if (productImages.length > 0) body.images = productImages;

    const newLens = await ContactLens.create(body);
    return NextResponse.json({ success: true, product: newLens });

  } catch (error: any) {
    console.error("Error adding contact lens:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      await connectDB();
      const formData = await req.formData();
      const id = formData.get('_id') as string;

      if (!id) {
          return NextResponse.json({ success: false, error: "Missing Product ID" }, { status: 400 });
      }

      const body = await processFormData(formData);

      // Handle images: append new ones to existing? or replace?
      // Simple logic: if new images uploaded, REPALCE all. 
      // If we want to keep existing, client should handle logic or we need more complex logic.
      // For this MVP, if new images are sent, we assume we update the list.
      // Ideally, the client sends "existingImages" list + "newFiles".
      // Let's check if the client sends existing images as string?
      
      // We'll adopt a hybrid: read 'existingImages' (urls) + upload new files.
      
      const featureImagesNew = await handleImageUploads(formData, "featureImages");
      const productImagesNew = await handleImageUploads(formData, "images");

      // We need to fetch existing to merge if the client doesn't send full state
      // OR we expect the client to use a different field for existing urls.
      // Simplest: Just use what is uploaded if present.
      
      if (featureImagesNew.length > 0) body.featureImages = featureImagesNew;
      if (productImagesNew.length > 0) body.images = productImagesNew;

      const updatedLens = await ContactLens.findByIdAndUpdate(id, body, { new: true });
      return NextResponse.json({ success: true, product: updatedLens });

    } catch (error: any) {
      console.error("Error updating contact lens:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
        }

        await ContactLens.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting contact lens:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
