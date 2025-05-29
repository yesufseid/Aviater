import Link from "next/link"
import { ArrowRight, BarChart2, Brain, LineChart, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import CrashAnimation from "@/components/crash-animation"
import TestimonialSlider from "@/components/testimonial-slider"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <CrashAnimation />
        </div>
        <div className="container relative z-10 px-4 text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
            🎯 Predict the Next Crash — <span className="text-emerald-500">Beat the Odds</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
            Our AI-powered algorithm analyzes real crash patterns to help you make smarter predictions.
          </p>
          <Button asChild size="lg" className="bg-emerald-600 text-lg hover:bg-emerald-700">
            <Link href="/predict">
              Try the Predictor Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-900 py-20">
        <div className="container px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                icon: <LineChart className="h-10 w-10 text-emerald-500" />,
                title: "Track Live Crash Odds",
                description: "Our system monitors crash games in real-time across multiple platforms.",
              },
              {
                icon: <BarChart2 className="h-10 w-10 text-emerald-500" />,
                title: "Analyze Patterns in Real Time",
                description: "Advanced algorithms detect recurring patterns in crash sequences.",
              },
              {
                icon: <Brain className="h-10 w-10 text-emerald-500" />,
                title: "Get Next-Round Prediction",
                description: "Receive data-driven predictions with confidence ratings.",
              },
              {
                icon: <TrendingUp className="h-10 w-10 text-emerald-500" />,
                title: "Make Your Move",
                description: "Use our insights to make more informed betting decisions.",
              },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center rounded-lg bg-gray-800 p-6 text-center">
                <div className="mb-4 rounded-full bg-gray-700 p-3">{step.icon}</div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use Our Bot Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">Why Use Our Bot?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-3 text-2xl text-emerald-500">✔</span>
                  <span className="text-lg">
                    <strong className="text-emerald-400">80%+ pattern match detection</strong>
                    <p className="mt-1 text-gray-300">
                      Our algorithm consistently identifies recurring patterns with high accuracy.
                    </p>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-2xl text-emerald-500">✔</span>
                  <span className="text-lg">
                    <strong className="text-emerald-400">Live data from Arada Bet Aviator</strong>
                    <p className="mt-1 text-gray-300">
                      Real-time integration with popular betting platforms for up-to-the-second data.
                    </p>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-2xl text-emerald-500">✔</span>
                  <span className="text-lg">
                    <strong className="text-emerald-400">Built for consistent prediction improvement</strong>
                    <p className="mt-1 text-gray-300">
                      Our system learns and adapts with each game to improve future predictions.
                    </p>
                  </span>
                </li>
              </ul>
              <Button asChild size="lg" className="mt-8 bg-emerald-600 hover:bg-emerald-700">
                <Link href="/predict">Join the Prediction Revolution</Link>
              </Button>
            </div>
            <div>
              <TestimonialSlider />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
