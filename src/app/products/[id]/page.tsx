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
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
      fetchReviews()
    }
  }, [params.id])

  const fetchProduct = async () => {
    const response = await fetch(`/api/products/${params.id}`)
    const data = await response.json()
    setProduct(data)
  }

  const fetchReviews = async () => {
    const response = await fetch(`/api/reviews?productId=${params.id}`)
    const data = await response.json()
    setReviews(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Category: {product.category}</p>
            <p className="text-gray-600">Purchased: {new Date(product.purchaseDate).toLocaleDateString()}</p>
            <p className="text-gray-600">Cost: ${product.cost}</p>
          </div>
          {product.description && (
            <div>
              <p className="text-gray-600">Description: {product.description}</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Link
            href={`/products/${product._id}/review`}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Add Review
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mb-2">{review.blurb}</p>
                <p className="text-sm text-gray-600">Cost: ${review.cost}</p>
                <p className="text-sm text-gray-600">Time Used: {review.timeUsed}</p>
                {review.photos.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Photos:</p>
                    <div className="flex space-x-2">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={`/uploads/${photo}`}
                          alt={`Review photo ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link href="/products" className="text-blue-500 hover:underline">
          ← Back to Products
        </Link>
      </div>
    </div>
  )
}
