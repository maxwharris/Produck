'use client'

import { useState, useEffect } from 'react'
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
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [review, setReview] = useState<Review | null>(null)

  useEffect(() => {
    fetchReview()
  }, [product._id])

  const fetchReview = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${product._id}`)
      const data = await response.json()
      if (data.length > 0) {
        setReview(data[0])
      }
    } catch (error) {
      console.error('Error fetching review:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>

      {/* Star Rating */}
      <div className="flex items-center mb-2">
        <div className="flex text-yellow-400 mr-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={review && i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
        {review && (
          <span className="text-sm text-gray-600">({review.rating}/5)</span>
        )}
      </div>

      <p className="text-gray-600 mb-2">Purchased: {new Date(product.purchaseDate).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-2">Cost: ${product.cost}</p>
      {product.description && (
        <p className="text-gray-500 mb-4">{product.description}</p>
      )}
      <div className="mt-4">
        <Link
          href={`/products/${product._id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
        >
          View Details & Review
        </Link>
      </div>
    </div>
  )
}
