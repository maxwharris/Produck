import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Review from '@/models/Review'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const review = await Review.findOne({
      _id: params.id,
      userId: (session.user as any).id
    }).populate('productId').populate('userId', 'name email')

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }
    return NextResponse.json(review)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    // Parse request body first
    const body = await request.json()

    // Try NextAuth session first (web app)
    const session = await getServerSession(authOptions)
    let authenticatedUserId: string | undefined

    if (session?.user?.id) {
      authenticatedUserId = (session.user as any).id as string
    } else {
      // Fallback to userId in body (mobile app)
      authenticatedUserId = body.userId
      // Remove userId from body so it doesn't interfere with update
      delete body.userId
    }

    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const review = await Review.findOneAndUpdate(
      { _id: params.id, userId: authenticatedUserId },
      body,
      { new: true }
    ).populate('productId').populate('userId', 'name email')

    if (!review) {
      return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 })
    }
    return NextResponse.json(review)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const review = await Review.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Review deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
