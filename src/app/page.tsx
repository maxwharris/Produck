import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Product Tracker</h1>
      </div>

      <div className="relative flex place-items-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Track Your Products</h2>
          <Link href="/products" className="bg-blue-500 text-white px-4 py-2 rounded">
            View Products
          </Link>
        </div>
      </div>
    </main>
  )
}
