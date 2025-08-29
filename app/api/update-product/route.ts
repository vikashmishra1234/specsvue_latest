import { NextRequest, NextResponse } from 'next/server'
import { IncomingForm } from 'formidable'
import { Readable } from 'stream'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import Product from '@/models/Product'
import { connectToDatabase } from '@/lib/dbConnect'

// Disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

const streamToIncomingMessage = async (req: Request): Promise<Readable & { headers: any; method: string; url?: string }> => {
  const readable = Readable.from(Buffer.from(await req.arrayBuffer()))
  const incoming = Object.assign(readable, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: '',
  })
  return incoming
}

const parseForm = async (req: Request) => {
  const incomingReq: any = await streamToIncomingMessage(req)
  const form = new IncomingForm({ multiples: true, keepExtensions: true })

  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(incomingReq, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export async function PUT(req: Request) {
  await connectToDatabase()

  try {
    const { fields, files } = await parseForm(req)

    const productId = fields._id || fields.id
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const normalizedFields: Record<string, string | string[]> = {}
    for (const key in fields) {
      const value = fields[key]
      normalizedFields[key] = Array.isArray(value) ? value[0] : value
    }

    const uploadedImageUrls: string[] = []

    if (files.images) {
      const images = Array.isArray(files.images) ? files.images : [files.images]

      for (const file of images) {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'products',
        })
        uploadedImageUrls.push(result.secure_url)
        fs.unlinkSync(file.filepath)
      }

      normalizedFields.images = uploadedImageUrls
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, normalizedFields, {
      new: true,
    })

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
