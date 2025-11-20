import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Readable } from "stream";
import { connectToDatabase } from "@/lib/dbConnect";
import { ContactLens } from "@/models/ContactLens";

export const config = {
  api: { bodyParser: false },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

const streamToIncomingMessage = async (req: Request) => {
  const readable = Readable.from(Buffer.from(await req.arrayBuffer()));
  return Object.assign(readable, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: "",
  });
};

const parseForm = async (req: Request) => {
  const incomingReq:any = await streamToIncomingMessage(req);
  const form = new IncomingForm({ multiples: true, keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(incomingReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { fields, files }: any = await parseForm(req);

    const normalizedFields: any = {};
    for (const key in fields) {
      normalizedFields[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
    }

    const uploadedImages: string[] = [];
    const fileArray = Array.isArray(files.images) ? files.images : [files.images];

    for (const file of fileArray) {
      const upload = await cloudinary.uploader.upload(file.filepath, {
        folder: "contact-lens",
      });
      uploadedImages.push(upload.secure_url);
      fs.unlinkSync(file.filepath);
    }

    normalizedFields.images = uploadedImages;

    const newLens = new ContactLens(normalizedFields);
    await newLens.save();
    return NextResponse.json(
      { message: "Contact Lens added successfully", data: newLens },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
