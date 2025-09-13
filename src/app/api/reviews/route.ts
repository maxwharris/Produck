import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Review from '@/models/Review'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    let query = {}
    if (productId) {
      query = { productId }
    }

    const reviews = await Review.find(query).populate('productId').sort({ createdAt: -1 })
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const review = new Review(body)
    await review.save()
    await review.populate('productId')
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
