'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
}

export default function AddReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    rating: 5,
    blurb: '',
    cost: '',
    timeUsed: ''
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    const response = await fetch(`/api/products/${params.id}`)
    const data = await response.json()
    setProduct(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload photos first
      const uploadedPhotos: string[] = []
      for (const photo of photos) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', photo)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          uploadedPhotos.push(uploadData.filename)
        }
      }

      // Create review
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: params.id,
          ...formData,
          cost: parseFloat(formData.cost),
          photos: uploadedPhotos
        })
      })

      if (response.ok) {
        router.push(`/products/${params.id}`)
      } else {
        alert('Failed to add review')
      }
    } catch (error) {
      alert('Error adding review')
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Add Review for {product.name}</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Review</label>
            <textarea
              name="blurb"
              value={formData.blurb}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your review here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cost ($)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time Used</label>
            <input
              type="text"
              name="timeUsed"
              value={formData.timeUsed}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 2 weeks, 3 months"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Photos (Optional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {photos.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">{photos.length} file(s) selected</p>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Adding Review...' : 'Add Review'}
            </button>
            <Link
              href={`/products/${params.id}`}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
