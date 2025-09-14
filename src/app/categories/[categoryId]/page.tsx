'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

interface Category {
  _id: string
  name: string
  color: string
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (categoryId) {
      fetchCategory()
      fetchProducts()
    }
  }, [categoryId])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`)
      if (response.ok) {
        const data = await response.json()
        setCategory(data)
      }
    } catch (error) {
      console.error('Error fetching category:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?categoryId=${categoryId}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setShowAddForm(true)
  }

  const handleProductAdded = () => {
    setShowAddForm(false)
    fetchProducts()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link href="/products" className="text-blue-500 hover:underline">
            ← Back to Categories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: category.color }}
          >
            {category.name}
          </h1>
          <Link href="/products" className="text-blue-500 hover:underline">
            ← Back to Categories
          </Link>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddProductForm
            categoryId={categoryId}
            categoryName={category.name}
            onProductAdded={handleProductAdded}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {products.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No products in this category yet. Add your first product!</p>
        </div>
      )}
    </div>
  )
}

interface AddProductFormProps {
  categoryId: string
  categoryName: string
  onProductAdded: () => void
}

function AddProductForm({ categoryId, categoryName, onProductAdded }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    purchaseDate: '',
    cost: '',
    description: '',
    // Review fields
    rating: '',
    blurb: '',
    photos: [] as File[],
    timeUsed: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        photos: Array.from(e.target.files)
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First upload photos if any
      let photoUrls: string[] = []
      if (formData.photos.length > 0) {
        const formDataUpload = new FormData()
        formData.photos.forEach((photo, index) => {
          formDataUpload.append('files', photo)
        })

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          photoUrls = uploadData.urls || []
        }
      }

      // Create product with review
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          category: categoryName,
          purchaseDate: new Date(formData.purchaseDate),
          cost: parseFloat(formData.cost),
          description: formData.description,
          // Review data
          rating: parseInt(formData.rating),
          blurb: formData.blurb,
          photos: photoUrls,
          timeUsed: formData.timeUsed
        })
      })

      if (response.ok) {
        setFormData({
          name: '',
          purchaseDate: '',
          cost: '',
          description: '',
          rating: '',
          blurb: '',
          photos: [],
          timeUsed: ''
        })
        onProductAdded()
      } else {
        alert('Failed to add product')
      }
    } catch (error) {
      alert('Error adding product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Product to {categoryName}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Details */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-3">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Review Details */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Initial Review</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating (1-5 stars)</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Rating</option>
                <option value="1">⭐ 1 Star</option>
                <option value="2">⭐⭐ 2 Stars</option>
                <option value="3">⭐⭐⭐ 3 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time Used</label>
              <input
                type="text"
                name="timeUsed"
                value={formData.timeUsed}
                onChange={handleChange}
                placeholder="e.g., 2 weeks, 3 months"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Review</label>
              <textarea
                name="blurb"
                value={formData.blurb}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>



            <div>
              <label className="block text-sm font-medium mb-1">Photos (Optional)</label>
              <input
                type="file"
                name="photos"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Product & Review'}
          </button>
          <button
            type="button"
            onClick={onProductAdded}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
