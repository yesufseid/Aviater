import Link from "next/link"
import { TrendingUp } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 py-12 text-gray-300">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-bold text-emerald-500">
              <TrendingUp className="h-6 w-6" />
              <span>CrashPredictor</span>
            </Link>
            <p className="mt-2 text-sm text-gray-400">AI-powered crash prediction for smarter betting decisions.</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/predict" className="hover:text-emerald-500">
                  Predictor
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Supported Sites</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-emerald-500">
                  Arada Bet Aviator
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500">
                  Betika
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500">
                  Helabet
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500">
                  1xBet
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-emerald-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-500">
                  Responsible Gambling
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} CrashPredictor. All rights reserved.</p>
          <p className="mt-2">This tool is for entertainment purposes only. Please gamble responsibly.</p>
        </div>
      </div>
    </footer>
  )
}
