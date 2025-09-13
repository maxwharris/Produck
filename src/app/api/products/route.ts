import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET() {
  try {
    await dbConnect()
    const products = await Product.find({}).sort({ createdAt: -1 })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const product = new Product(body)
    await product.save()
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
