'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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

interface User {
  _id: string
  name: string
  email: string
}

interface Category {
  _id: string
  name: string
  color: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(query)
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'users'>('all')

  useEffect(() => {
    if (query) {
      setSearchTerm(query)
      performSearch(query)
    } else {
      setLoading(false)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      // Search products
      const productResponse = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
      const productData = await productResponse.json()
      setProducts(productData)

      // Search users
      const userResponse = await fetch(`/api/users?search=${encodeURIComponent(searchQuery)}`)
      const userData = await userResponse.json()
      setUsers(userData)

      // Also fetch categories for potential category search
      const categoryResponse = await fetch('/api/categories')
      const categoryData = await categoryResponse.json()
      setCategories(categoryData)
    } catch (error) {
      console.error('Search error:', error)
      setProducts([])
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.history.replaceState({}, '', `/search?q=${encodeURIComponent(searchTerm.trim())}`)
      performSearch(searchTerm.trim())
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="absolute right-2 top-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>

        {query && (
          <p className="text-gray-600 mb-6">
            Showing results for: <span className="font-medium">"{query}"</span>
          </p>
        )}
      </div>

      {/* Tab Navigation */}
      {(products.length > 0 || users.length > 0) && (
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Results ({products.length + users.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Users ({users.length})
          </button>
        </div>
      )}

      {/* Search Results */}
      {((activeTab === 'all' || activeTab === 'products') && products.length > 0) ||
      ((activeTab === 'all' || activeTab === 'users') && users.length > 0) ? (
        <div className="space-y-12">
          {/* Products Section */}
          {(activeTab === 'all' || activeTab === 'products') && products.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">
                  Products ({products.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Users Section */}
          {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">
                  Users ({users.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {users.map((user) => (
                  <div key={user._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
                      <Link
                        href={`/users/${user._id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">
            We couldn't find any products matching "{query}"
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Try:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Checking your spelling</li>
              <li>• Using different keywords</li>
              <li>• Searching for a product category</li>
            </ul>
          </div>
          <div className="mt-6">
            <Link
              href="/products"
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search for products</h3>
          <p className="text-gray-500">
            Enter a search term above to find products shared by the community
          </p>
        </div>
      )}

      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
