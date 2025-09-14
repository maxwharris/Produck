'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  category: string
  purchaseDate: string
  cost: number
  description?: string
}

interface Review {
  _id: string
  rating: number
  blurb: string
  photos: string[]
  cost: number
  timeUsed: string
  createdAt: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
      fetchReview()
    }
  }, [params.id])

  const fetchProduct = async () => {
    const response = await fetch(`/api/products/${params.id}`)
    const data = await response.json()
    setProduct(data)
  }

  const fetchReview = async () => {
    const response = await fetch(`/api/reviews?productId=${params.id}`)
    const data = await response.json()
    // Since we now create review with product, get the first (and likely only) review
    setReview(data.length > 0 ? data[0] : null)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/products" className="text-blue-500 hover:underline">
            ← Back to Categories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Product Header with Image */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-8">
            {review?.photos && review.photos.length > 0 ? (
              <img
                src={review.photos[0]}
                alt={product.name}
                className="max-w-full max-h-64 object-contain rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-400">
                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2">No image available</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Category:</span> {product.category}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Purchased:</span> {new Date(product.purchaseDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Cost:</span> ${product.cost}
                </p>
              </div>

              {product.description && (
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Description:</span>
                  </p>
                  <p className="mt-1">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      {review ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Review</h2>
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Review</h3>
              <p className="text-gray-700 leading-relaxed">{review.blurb}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Time Used:</span> {review.timeUsed}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No review available for this product.</p>
        </div>
      )}

      <div className="mt-8">
        <Link href="/products" className="text-blue-500 hover:underline">
          ← Back to Categories
        </Link>
      </div>
    </div>
  )
}
