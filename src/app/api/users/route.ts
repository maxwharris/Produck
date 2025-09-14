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

    // Transform to use 'id' instead of '_id'
    const transformedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
