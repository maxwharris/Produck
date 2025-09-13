import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Review from '@/models/Review'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const review = await Review.findById(params.id).populate('productId')
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
    const body = await request.json()
    const review = await Review.findByIdAndUpdate(params.id, body, { new: true }).populate('productId')
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
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
    await dbConnect()
    const review = await Review.findByIdAndDelete(params.id)
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Review deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
