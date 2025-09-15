'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Navigation() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  if (status === 'loading') {
    return (
      <nav className="bg-produck-yellow shadow-sm border-b border-produck-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img
                src="/produck-logo-transparent.png"
                alt="Produck"
                className="h-10 w-auto"
              />
            </Link>
          </div>
            <div className="flex items-center">
              <div className="animate-pulse bg-produck-bg h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-produck-yellow shadow-sm border-b border-produck-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[80px] py-4">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img
                src="/produck-logo-transparent.png"
                alt="Produck"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-produck-blue focus:border-transparent text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Link
              href="/products"
              className="text-produck-brown hover:text-produck-brown/80 px-2 sm:px-3 py-2 rounded-md text-sm font-semibold whitespace-nowrap"
            >
              Discover
            </Link>

            {session?.user ? (
              <>
                <Link
                  href="/manage"
                  className="text-produck-brown hover:text-produck-brown/80 px-2 sm:px-3 py-2 rounded-md text-sm font-semibold whitespace-nowrap"
                >
                  Manage
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-produck-brown font-medium hidden sm:inline">
                    {session.user.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-sm hover:bg-red-700 font-semibold whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="text-produck-brown hover:text-produck-brown/80 px-2 sm:px-3 py-2 rounded-md text-sm font-semibold whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-produck-blue text-white px-2 sm:px-3 py-2 rounded-md text-sm font-semibold hover:bg-produck-blue/90 whitespace-nowrap"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
