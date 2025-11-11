'use client'

import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { X } from 'lucide-react'

interface ProductEditFormProps {
  setShowUpdateForm: (value: boolean) => void
  productToBeUpdate: ProductType
  setChange: (value: boolean) => void
  change: boolean
}

export default function ProductEditForm({
  setChange,
  change,
  setShowUpdateForm,
  productToBeUpdate,
}: ProductEditFormProps) {
  const [formData, setFormData] = useState({
    brandName: productToBeUpdate.brandName,
    productType: productToBeUpdate.productType,
    frameType: productToBeUpdate.frameType,
    frameShape: productToBeUpdate.frameShape,
    modelNumber: productToBeUpdate.modelNumber,
    frameSize: productToBeUpdate.frameSize,
    frameWidth: productToBeUpdate.frameWidth,
    frameDimensions: productToBeUpdate.frameDimensions,
    frameColor: productToBeUpdate.frameColor,
    weight: productToBeUpdate.weight,
    weightGroup: productToBeUpdate.weightGroup,
    material: productToBeUpdate.material,
    frameMaterial: productToBeUpdate.frameMaterial,
    templeMaterial: productToBeUpdate.templeMaterial,
    prescriptionType: productToBeUpdate.prescriptionType,
    frameStyle: productToBeUpdate.frameStyle,
    frameStyleSecondary: productToBeUpdate.frameStyleSecondary,
    collection: productToBeUpdate.collection,
    productWarranty: productToBeUpdate.productWarranty,
    gender: productToBeUpdate.gender,
    height: productToBeUpdate.height,
    condition: productToBeUpdate.condition,
    templeColor: productToBeUpdate.templeColor,
    price: productToBeUpdate.price,
    discount: productToBeUpdate.discount,
    stock: productToBeUpdate?.stock,
  })

  const [images, setImages] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>(productToBeUpdate.images ?? [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const existingFiles = images ? Array.from(images) : []
      const combinedFiles = [...existingFiles, ...newFiles]

      const dataTransfer = new DataTransfer()
      combinedFiles.forEach((file) => dataTransfer.items.add(file))
      setImages(dataTransfer.files)

      const urls = Array.from(combinedFiles).map((file) => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
  }

  const removeSelectedImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))

    if (images) {
      const dataTransfer = new DataTransfer()
      Array.from(images)
        .filter((_, i) => i !== index)
        .forEach((file) => dataTransfer.items.add(file))
      setImages(dataTransfer.files)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      for (const key in formData) {
        data.append(key, formData[key as keyof typeof formData])
      }
      data.append('_id', productToBeUpdate._id)

      if (images) {
        Array.from(images).forEach((file) => {
          data.append('images', file)
        })
      }

      const res = await axios.put('/api/update-product', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res?.status === 200) {
        Swal.fire({ title: 'Product updated!', icon: 'success' })
        setImages(null)
        setPreviewUrls([])
        setShowUpdateForm(false)
        setChange(!change)
      }
    } catch (err) {
      Swal.fire({ title: 'Oops...', text: 'Failed to update the product', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#000000b0] flex justify-center items-center p-4 overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 max-h-full overflow-y-auto">
        <button
          onClick={() => setShowUpdateForm(false)}
          className="absolute top-3 right-3 text-gray-700 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Product</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-700 font-medium">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                name={key}
                value={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}

          <div className="col-span-1 md:col-span-2">
            <label className="text-gray-700 font-medium block mb-1">
              Upload New Images (optional)
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          {previewUrls.length > 0 && (
            <div className="col-span-2 grid grid-cols-3 gap-2">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative">
                  <X
                    onClick={() => removeSelectedImage(idx)}
                    className="absolute top-1 right-1 cursor-pointer bg-white rounded-full p-1 shadow"
                  />
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
