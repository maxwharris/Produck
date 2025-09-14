'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Category {
  _id: string
  name: string
  color: string
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        console.error('Failed to fetch categories:', response.status, response.statusText)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const handleAddCategory = () => {
    setShowAddForm(true)
  }

  const handleCategoryAdded = () => {
    setShowAddForm(false)
    fetchCategories()
  }

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Categories</h1>
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddCategoryForm onCategoryAdded={handleCategoryAdded} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className="cursor-pointer bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            style={{ backgroundColor: category.color + '20', borderLeft: `4px solid ${category.color}` }}
          >
            <h3 className="text-xl font-semibold mb-2" style={{ color: category.color }}>
              {category.name}
            </h3>
            <p className="text-gray-600">Click to view products</p>
          </div>
        ))}
      </div>

      {categories.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No categories yet. Create your first category to get started!</p>
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
