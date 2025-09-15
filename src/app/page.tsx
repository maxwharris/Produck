'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

interface Product {
  _id: string
  name: string
  category: string
  purchaseDate: string
  cost: number
  description?: string
  userId: {
    _id: string
    name: string
    email: string
  }
}

export default function Home() {
  const { data: session, status } = useSession()
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingProducts()
  }, [])

  const fetchTrendingProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      // For now, just show the most recent products as "trending"
      // In a real app, you'd have a more sophisticated algorithm
      setTrendingProducts(data.slice(0, 6))
    } catch (error) {
      console.error('Error fetching trending products:', error)
      setTrendingProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-produck-bg">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-produck-brown sm:text-5xl md:text-6xl">
            Produck
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-produck-brown/70 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl font-medium">
            Discover amazing products that people love. Share your experiences and find your next favorite item.
          </p>

          {!session?.user ? (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/auth/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-produck-blue hover:bg-produck-blue/90 md:py-4 md:text-lg md:px-10"
                >
                  Join the Community
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/auth/signin"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-md text-produck-blue bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/products"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-produck-blue hover:bg-produck-blue/90 md:py-4 md:text-lg md:px-10"
                >
                  Share Your Products
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Trending Products */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-produck-brown">Trending Products</h2>
            <Link
              href="/products"
              className="text-produck-blue hover:text-produck-blue/80 font-semibold"
            >
              View All Products →
            </Link>
          </div>

          {trendingProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-produck-brown/60 mb-4 font-medium">No products shared yet. Be the first to share!</p>
              {session?.user && (
                <Link
                  href="/products"
                  className="bg-produck-blue text-white px-6 py-3 rounded hover:bg-produck-blue/90 font-semibold"
                >
                  Add Your First Product
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-produck-blue rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-semibold text-produck-brown">Discover Products</h3>
                <p className="mt-5 text-base text-produck-brown/70 font-medium">
                  Browse products shared by the community. Find inspiration for your next purchase with honest reviews and ratings.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-produck-blue rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-semibold text-produck-brown">Share Reviews</h3>
                <p className="mt-5 text-base text-produck-brown/70 font-medium">
                  Write detailed reviews with photos and ratings. Help others make informed decisions about their purchases.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-produck-blue rounded-md shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-semibold text-produck-brown">Connect with Users</h3>
                <p className="mt-5 text-base text-produck-brown/70 font-medium">
                  Follow other users to see their product recommendations and discover new items through their experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
