
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import ContactLens from "@/models/ContactLens";
import mongoose from "mongoose";

// Ensure database connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    // Text Fields
    const body: any = {};
    const textFields = [
      'name', 'brandName', 'description', 'price', 'salePrice', 'stock',
      'lensType', 'material', 'waterContent', 'packSize',
      'powerMin', 'powerMax', 'powerStep',
      'cylinderMin', 'cylinderMax', 'cylinderStep',
      'axisMin', 'axisMax', 'axisStep'
    ];
    
    // Process simple text fields
    textFields.forEach(field => {
       const value = formData.get(field);
       if (value) body[field] = value;
    });

    // Process Arrays (JSON parsed)
    const arrayFields = ['baseCurve', 'diameter', 'colors'];
    arrayFields.forEach(field => {
      const value = formData.get(field);
      if (value) {
        try {
            // If it's a comma separated string, split it. If it's a JSON string, parse it.
            // For form-data usually sent as stringified JSON or separate fields. 
            // Assuming simplified approach: comma separated strings for simplicity or JSON
            if (typeof value === 'string' && value.includes(',')) {
                 body[field] = value.split(',').map(v => v.trim());
            } else {
                 body[field] = JSON.parse(value as string);
            }
        } catch (e) {
             // Fallback if parsing fails, treat as single item array or empty
             body[field] = [value];
        }
      }
    });

     // Checkbox/Boolean
    body.isToric = formData.get('isToric') === 'true';

    // Image Upload Handling
    const featureImages = formData.getAll("featureImages") as File[];
    const productImages = formData.getAll("images") as File[];

    const saveImages = async (files: File[]) => {
      const savedNames = [];
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Save to public/uploads or similar. For consistency with existng code, assuming public/images or similar local storage for now 
        // or cloudinary if used. The previous "ProductForm" used local path or similar? 
        // Checking previous code... it seems they might be using a simple approach or external.
        // Let's use a standard public/uploads approach for this example or keep it simple.
        
        // REVISIT: The user's env has Cloudinary dependency in package.json.
        // But for this quick implementation, I will save locally to public/uploads/contact-lenses
        // ensuring the directory exists.
        
        const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
        const uploadDir = path.join(process.cwd(), "public/uploads/contact-lenses");
         // Ensure dir exists - Node 10+ recursive
        await import('fs').then(fs => fs.promises.mkdir(uploadDir, { recursive: true }));
        
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        savedNames.push(`/uploads/contact-lenses/${fileName}`);
      }
      return savedNames;
    };

    if (featureImages.length > 0) body.featureImages = await saveImages(featureImages);
    if (productImages.length > 0) body.images = await saveImages(productImages);

    const newLens = await ContactLens.create(body);
    
    return NextResponse.json({ success: true, product: newLens });

  } catch (error: any) {
    console.error("Error adding contact lens:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
