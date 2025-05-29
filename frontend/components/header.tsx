import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-emerald-500">
          <TrendingUp className="h-6 w-6" />
          <span>CrashPredictor</span>
        </Link>

        <nav className="hidden space-x-6 md:flex">
          <Link href="/" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
            Home
          </Link>
          <Link href="/predict" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
            Predictor
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
            How It Works
          </Link>
          <Link href="#" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="hidden border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white md:inline-flex"
          >
            Log In
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Sign Up</Button>
        </div>
      </div>
    </header>
  )
}
