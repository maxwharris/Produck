'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  _id: string
  name: string
  email: string
}

interface Product {
  _id: string
  name: string
  category: string
  purchaseDate: string
  cost: number
  description?: string
  userId: User
}

interface Review {
  _id: string
  rating: number
  photos: string[]
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="h-48 bg-produck-bg flex items-center justify-center">
        {review?.photos && review.photos.length > 0 ? (
          <img
            src={review.photos[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-produck-brown/40">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-xs font-medium">No image</p>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-produck-brown mb-2">{product.name}</h3>

        {/* User Info */}
        <div className="mb-2">
          <Link
            href={`/users/${product.userId._id}`}
            className="text-produck-blue hover:text-produck-blue/80 text-sm font-medium"
          >
            by {product.userId.name}
          </Link>
        </div>

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
            <span className="text-sm text-produck-brown/70 font-medium">({review.rating}/5)</span>
          )}
        </div>

        <p className="text-produck-brown/80 mb-2 font-semibold">Cost: ${product.cost}</p>
        {product.description && (
          <p className="text-produck-brown/60 mb-4 line-clamp-2 font-medium">{product.description}</p>
        )}
        <div className="mt-4">
          <Link
            href={`/products/${product._id}`}
            className="bg-produck-blue text-white px-4 py-2 rounded hover:bg-produck-blue/90 inline-block text-sm font-semibold"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
