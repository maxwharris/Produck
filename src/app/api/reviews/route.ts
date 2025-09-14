import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Review from '@/models/Review'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    let query: any = {}
    if (productId) {
      query.productId = productId
    } else {
      // If no productId specified, require authentication for user's own reviews
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      query.userId = session.user.id as string
    }

    const reviews = await Review.find(query)
      .populate('productId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const body = await request.json()
    const review = new Review({
      ...body,
      userId: session.user.id as string
    })
    await review.save()
    await review.populate('productId')
    await review.populate('userId', 'name email')
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
