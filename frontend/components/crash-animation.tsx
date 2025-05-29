"use client"

import { useEffect, useRef } from "react"

export default function CrashAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let animationFrameId: number
    const points: { x: number; y: number; value: number; color: string }[] = []

    // Generate initial points
    for (let i = 0; i < 20; i++) {
      const value = 1 + Math.random() * 4
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        value: value,
        color: value < 2 ? "#ef4444" : "#10b981",
      })
    }

    // Animation function
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connecting lines
      ctx.beginPath()
      ctx.strokeStyle = "rgba(16, 185, 129, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
          }
        }
      }
      ctx.stroke()

      // Draw points and values
      points.forEach((point) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = point.color
        ctx.fill()

        ctx.font = "bold 14px Inter, sans-serif"
        ctx.fillStyle = point.color
        ctx.fillText(point.value.toFixed(2) + "x", point.x + 8, point.y + 4)

        // Move points
        point.x += (Math.random() - 0.5) * 0.5
        point.y += (Math.random() - 0.5) * 0.5

        // Keep points within bounds
        if (point.x < 0) point.x = canvas.width
        if (point.x > canvas.width) point.x = 0
        if (point.y < 0) point.y = canvas.height
        if (point.y > canvas.height) point.y = 0
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full" />
}
