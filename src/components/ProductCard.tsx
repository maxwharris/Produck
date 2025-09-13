import Link from 'next/link'

interface Product {
  _id: string
  name: string
  category: string
  purchaseDate: string
  cost: number
  description?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-2">Category: {product.category}</p>
      <p className="text-gray-600 mb-2">Purchased: {new Date(product.purchaseDate).toLocaleDateString()}</p>
      <p className="text-gray-600 mb-2">Cost: ${product.cost}</p>
      {product.description && (
        <p className="text-gray-500 mb-4">{product.description}</p>
      )}
      <div className="flex space-x-2">
        <Link
          href={`/products/${product._id}`}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          View Details
        </Link>
        <Link
          href={`/products/${product._id}/review`}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
        >
          Add Review
        </Link>
      </div>
    </div>
  )
}
