import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let query: any = {}

    if (userId) {
      query.userId = userId
    }

    const categories = await Category.find(query)
      .sort({ name: 1 })

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
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

    // Extract userId from request body for mobile app compatibility
    const { userId, ...categoryData } = body

    // For mobile app testing, use userId from request body
    // In production, this would come from authenticated session
    const authenticatedUserId = userId // || session.user.id as string

    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const category = new Category({
      ...categoryData,
      userId: authenticatedUserId
    })
    await category.save()

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Category name already exists for this user' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
