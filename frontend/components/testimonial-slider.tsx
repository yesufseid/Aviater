"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Michael T.",
    avatar: "M",
    rating: 5,
    text: "This predictor has completely changed my approach to Aviator games. The pattern recognition is incredibly accurate!",
  },
  {
    id: 2,
    name: "Sarah K.",
    avatar: "S",
    rating: 4,
    text: "I was skeptical at first, but after using it for a week, I'm impressed with the consistency of the predictions.",
  },
  {
    id: 3,
    name: "David R.",
    avatar: "D",
    rating: 5,
    text: "The real-time analysis gives me confidence in my betting decisions. Definitely worth it!",
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="rounded-lg bg-gray-800 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold">
              {testimonials[currentIndex].avatar}
            </div>
            <div>
              <div className="font-medium">{testimonials[currentIndex].name}</div>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    fill={i < testimonials[currentIndex].rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <blockquote className="mb-6 text-lg italic text-gray-300">"{testimonials[currentIndex].text}"</blockquote>

        <div className="flex justify-between">
          <Button variant="outline" size="icon" onClick={prevTestimonial} className="border-gray-700 hover:bg-gray-700">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-1">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${i === currentIndex ? "bg-emerald-500" : "bg-gray-600"}`}
              ></div>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={nextTestimonial} className="border-gray-700 hover:bg-gray-700">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
