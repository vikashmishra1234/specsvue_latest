'use client'

import { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

interface Props {
  change: boolean
  setShowForm: (value: boolean) => void
  setChange: (value: boolean) => void
}

export default function ProductForm({ change, setShowForm, setChange }: Props) {
  const [formData, setFormData] = useState({
    brandName: '',
    productType: '',
    frameType: '',
    frameShape: '',
    modelNumber: '',
    frameSize: '',
    frameWidth: '',
    frameDimensions: '',
    frameColor: '',
    weight: '',
    weightGroup: '',
    material: '',
    frameMaterial: '',
    templeMaterial: '',
    prescriptionType: '',
    frameStyle: '',
    frameStyleSecondary: '',
    collection: '',
    productWarranty: '',
    gender: '',
    height: '',
    condition: '',
    templeColor: '',
    price: '',
    discount: '',
  })

  const fields: any = {
    brandName: 'Specsvue',
    productType: 'Sunglasses',
    frameType: 'Full Rim',
    frameShape: 'Rectangle, Rounded',
    modelNumber: '1234',
    frameSize: 'size',
    frameWidth: 'width',
    frameDimensions: '',
    frameColor: '',
    weight: '',
    weightGroup: '',
    material: '',
    frameMaterial: '',
    templeMaterial: '',
    prescriptionType: '',
    frameStyle: '',
    frameStyleSecondary: '',
    collection: '',
    productWarranty: '',
    gender: '',
    height: '',
    condition: '',
    templeColor: '',
    price: '',
    discount: '',
  }

  const [images, setImages] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase())

  const capitalizedFields = [
    'brandName',
    'productType',
    'frameType',
    'frameShape',
    'frameColor',
    'weightGroup',
    'frameMaterial',
    'templeMaterial',
    'prescriptionType',
    'frameStyle',
    'frameStyleSecondary',
    'collection',
    'productWarranty',
    'gender',
    'condition',
    'templeColor',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedValue = capitalizedFields.includes(name)
      ? capitalizeWords(value)
      : value

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const existingFiles = images ? Array.from(images) : []

      const combinedFiles = [...existingFiles, ...newFiles]
      const dataTransfer = new DataTransfer()
      combinedFiles.forEach((file) => dataTransfer.items.add(file))

      const updatedFileList = dataTransfer.files
      setImages(updatedFileList)

      const urls = Array.from(updatedFileList).map((file) =>
        URL.createObjectURL(file)
      )
      setPreviewUrls(urls)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const data = new FormData()
      for (const key in formData) {
        data.append(key, formData[key as keyof typeof formData])
      }

      if (images) {
        Array.from(images).forEach((file) => {
          data.append('images', file)
        })
      }

      const res = await axios.post('/api/admin', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res?.status === 200) {
        Swal.fire({
          title: 'Product is Added to database',
          icon: 'success',
        })
        setImages(null)
        setPreviewUrls([])
        setChange(!change)
      }
    } catch (err) {
      Swal.fire({
        title: 'Oops...',
        text: 'Product is not added to the database',
        icon: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#00000077] bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="w-full max-w-6xl bg-white p-4 sm:p-6 shadow-md rounded-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl flex justify-between font-semibold mb-4">
          Add New Product
          <button
            onClick={() => setShowForm(false)}
            className="text-xs sm:text-sm cursor-pointer hover:bg-gray-900 hover:text-white border px-3 sm:px-5 py-1 rounded"
          >
            Close
          </button>
        </h2>

        {message && <p className="mb-4 text-green-600">{message}</p>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-700 font-medium text-sm sm:text-base">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                name={key}
                placeholder={fields[key]}
                value={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize text-sm sm:text-base"
              />
            </div>
          ))}

          {/* Image Upload */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <label className="text-gray-700 font-medium block mb-1 text-sm sm:text-base">
              Product Images
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full border border-gray-300 p-2 rounded-md text-sm sm:text-base"
              required
            />
          </div>

          {/* Image Preview */}
          {previewUrls.length > 0 && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {previewUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-full h-28 sm:h-32 object-cover rounded-md border"
                />
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 text-sm sm:text-base"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
