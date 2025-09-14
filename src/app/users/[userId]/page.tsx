'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

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

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.userId as string

  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchUser()
      fetchUserProducts()
    }
  }, [userId])

  const fetchUser = async () => {
    try {
      // For now, we'll get user info from the first product
      // In a real app, you'd have a dedicated users API
      const response = await fetch(`/api/products?userId=${userId}&limit=1`)
      const products = await response.json()
      if (products.length > 0) {
        setUser(products[0].userId)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchUserProducts = async () => {
    try {
      const response = await fetch(`/api/products?userId=${userId}`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching user products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* User Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600">{products.length} products shared</p>
          </div>
          <div className="text-right">
            <Link href="/" className="text-blue-500 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* User's Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">{user.name}'s Products</h2>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products shared yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
