import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search')

    let query: any = {}

    if (searchQuery) {
      // Search in user names
      query.name = { $regex: searchQuery, $options: 'i' }
    }

    const users = await User.find(query)
      .select('name email')
      .sort({ name: 1 })
      .limit(20) // Limit results for performance

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
