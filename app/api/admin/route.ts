// app/api/admin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { IncomingForm } from 'formidable'
import { Readable } from 'stream'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import Product from '@/models/Product'

// Disable Next.js body parsing (important for formidable)
export const config = {
  api: {
    bodyParser: false,
  },
}

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

// Convert Fetch Request to Node stream for formidable
const streamToIncomingMessage = async (req: Request): Promise<Readable & { headers: any; method: string; url?: string }> => {
  const readable = Readable.from(Buffer.from(await req.arrayBuffer()))
  const incoming = Object.assign(readable, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: '',
  })
  return incoming
}

// Parse the form
const parseForm = async (req: Request) => {
  const incomingReq:any = await streamToIncomingMessage(req)
  const form = new IncomingForm({ multiples: true, keepExtensions: true })

  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(incomingReq, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

// POST handler
export async function POST(req: Request) {
  try {
    
    const { fields, files } = await parseForm(req)

    // Convert any single-item array fields to strings
    const normalizedFields: Record<string, string|string[]> = {}
    for (const key in fields) {
      const value = fields[key]
      normalizedFields[key] = Array.isArray(value) ? value[0] : value
    }

    const uploadedImageUrls: string[] = []

    const images = Array.isArray(files.images) ? files.images : [files.images]

    for (const file of images) {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'products',
      })
      uploadedImageUrls.push(result.secure_url)
      fs.unlinkSync(file.filepath)
    }
    normalizedFields.images = uploadedImageUrls
      const newProduct = new Product(normalizedFields)
      
      await newProduct.save()
    return NextResponse.json({
      message: 'Product added successfully',
      product: {
        ...normalizedFields,
        images: uploadedImageUrls,
      },
    })
  } catch (err) {
    console.error('Error uploading:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
