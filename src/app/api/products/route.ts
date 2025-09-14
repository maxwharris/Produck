import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const userId = searchParams.get('userId')
    const searchQuery = searchParams.get('search')

    let query: any = {}

    if (categoryId) {
      // If categoryId is provided, we need to find products by category name
      // First get the category to get its name
      const Category = (await import('@/models/Category')).default
      const category = await Category.findOne({
        _id: categoryId
      })

      if (category) {
        query.category = category.name
      } else {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
    }

    if (userId) {
      query.userId = userId
    }

    if (searchQuery) {
      // Search in product name and description
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    }

    const products = await Product.find(query)
      .populate({
        path: 'userId',
        select: 'name email',
        options: { strictPopulate: false } // Allow missing references
      })
      .sort({ createdAt: -1 })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Re-enable authentication when implementing proper mobile auth
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    await dbConnect()
    const body = await request.json()

    // Extract review data from the request
    const {
      rating,
      blurb,
      photos,
      timeUsed,
      userId, // Get userId from request body for mobile app
      ...productData
    } = body

    // For mobile app testing, use userId from request body
    // In production, this would come from authenticated session
    const authenticatedUserId = userId // || session.user.id as string

    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Create the product
    const product = new Product({
      ...productData,
      userId: authenticatedUserId
    })
    await product.save()

    // If review data is provided, create the review
    if (rating && blurb && timeUsed) {
      const Review = (await import('@/models/Review')).default
      const review = new Review({
        productId: product._id,
        userId: authenticatedUserId,
        rating: parseInt(rating),
        blurb,
        photos: photos || [],
        cost: productData.cost,
        timeUsed
      })
      await review.save()
    }

    await product.populate('userId', 'name email')
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
