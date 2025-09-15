import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const product = await Product.findOne({
      _id: params.id
    }).populate('userId', 'name email')

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
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
      authenticatedUserId = (session.user as any).id
    } else {
      // Fallback to userId in body (mobile app)
      authenticatedUserId = body.userId
      // Remove userId from body so it doesn't interfere with update
      delete body.userId
    }

    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const product = await Product.findOneAndUpdate(
      { _id: params.id, userId: authenticatedUserId },
      body,
      { new: true }
    ).populate('userId', 'name email')

    if (!product) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    // Try NextAuth session first (web app)
    const session = await getServerSession(authOptions)
    let authenticatedUserId: string | undefined

    if (session?.user?.id) {
      authenticatedUserId = session.user.id as string
    } else {
      // Fallback to userId in body (mobile app)
      try {
        const body = await request.json()
        authenticatedUserId = body.userId
      } catch (error) {
        // If no body, try query params
        const { searchParams } = new URL(request.url)
        authenticatedUserId = searchParams.get('userId') || undefined
      }
    }

    if (!authenticatedUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const product = await Product.findOneAndDelete({
      _id: params.id,
      userId: authenticatedUserId
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
