'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  _id: string
  name: string
  color: string
}

interface Product {
  _id: string
  name: string
  category: string
  purchaseDate: string
  cost: number
  description?: string
}

export default function ManagePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      fetchCategories()
      fetchProducts()
    }
  }, [session, status, router])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/products?userId=${session.user.id as string}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleCategoryAdded = () => {
    setShowAddCategoryForm(false)
    fetchCategories()
  }

  const handleProductAdded = () => {
    setShowAddProductForm(false)
    fetchProducts()
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Your Content</h1>
        <p className="text-gray-600">Create categories and share your product experiences</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'categories'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'products'
              ? 'border-b-2 border-orange-500 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Products ({products.length})
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Categories</h2>
            <button
              onClick={() => setShowAddCategoryForm(true)}
              className="bg-produck-blue text-white px-4 py-2 rounded hover:bg-produck-blue"
            >
              Add Category
            </button>
          </div>

          {showAddCategoryForm && (
            <div className="mb-8">
              <AddCategoryForm onCategoryAdded={handleCategoryAdded} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-md p-6"
                style={{ backgroundColor: category.color + '20', borderLeft: `4px solid ${category.color}` }}
              >
                <h3 className="text-xl font-semibold mb-2" style={{ color: category.color }}>
                  {category.name}
                </h3>
                <p className="text-gray-600">Click to view products in this category</p>
                <Link
                  href={`/categories/${category._id}`}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  View Products →
                </Link>
              </div>
            ))}
          </div>

          {categories.length === 0 && !showAddCategoryForm && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No categories yet. Create your first category!</p>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Products</h2>
            <button
              onClick={() => setShowAddProductForm(true)}
              className="bg-produck-blue text-white px-4 py-2 rounded hover:bg-produck-blue"
            >
              Add Product
            </button>
          </div>

          {showAddProductForm && (
            <div className="mb-8">
              <AddProductForm
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onProductAdded={handleProductAdded}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">Category: {product.category}</p>
                <p className="text-gray-600 mb-2">Cost: ${product.cost}</p>
                <Link
                  href={`/products/${product._id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>

          {products.length === 0 && !showAddProductForm && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No products shared yet. Add your first product!</p>
            </div>
          )}
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

interface AddCategoryFormProps {
  onCategoryAdded: () => void
}

function AddCategoryForm({ onCategoryAdded }: AddCategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({
          name: '',
          color: '#3B82F6'
        })
        onCategoryAdded()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add category')
      }
    } catch (error) {
      alert('Error adding category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category Name</label>
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
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
          <button
            type="button"
            onClick={onCategoryAdded}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

interface AddProductFormProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  onProductAdded: () => void
}

function AddProductForm({ categories, selectedCategory, onCategoryChange, onProductAdded }: AddProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    purchaseDate: '',
    cost: '',
    description: '',
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

      // Find selected category
      const category = categories.find(c => c._id === selectedCategory)
      if (!category) {
        alert('Please select a category')
        return
      }

      // Create product with review
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          category: category.name,
          purchaseDate: new Date(formData.purchaseDate),
          cost: parseFloat(formData.cost),
          description: formData.description,
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
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
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
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
