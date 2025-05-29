"use client"

import { useEffect, useRef } from "react"

interface CrashData {
  id: string
  value: string
  timestamp: any
}

interface CrashHistoryChartProps {
  data: CrashData[]
}

export default function CrashHistoryChart({ data }: CrashHistoryChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setDimensions = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 300
      }
    }

    setDimensions()
    window.addEventListener("resize", setDimensions)

    // Draw chart
    const drawChart = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Chart settings
      const padding = 40
      const chartWidth = canvas.width - padding * 2
      const chartHeight = canvas.height - padding * 2
      const maxValue = 5 // Maximum crash value to display

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding + chartHeight - (i / maxValue) * chartHeight
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(padding + chartWidth, y)
        ctx.stroke()

        // Add y-axis labels
        ctx.fillStyle = "#9ca3af"
        ctx.font = "12px Inter, sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(i.toFixed(1) + "x", padding - 10, y + 4)
      }

      // Draw threshold line at 2.0
      const thresholdY = padding + chartHeight - (2 / maxValue) * chartHeight
      ctx.strokeStyle = "rgba(239, 68, 68, 0.5)" // Red line
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding, thresholdY)
      ctx.lineTo(padding + chartWidth, thresholdY)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw data points
      const displayData = data.slice(0, 50).reverse() // Show last 50 points
      const pointWidth = chartWidth / (displayData.length - 1)

      // Draw connecting line
      ctx.beginPath()
      ctx.strokeStyle = "rgba(16, 185, 129, 0.7)"
      ctx.lineWidth = 2

      displayData.forEach((point, i) => {
        const x = padding + i * pointWidth
        const value = Number.parseFloat(point.value)
        const y = padding + chartHeight - (Math.min(value, maxValue) / maxValue) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw points
      displayData.forEach((point, i) => {
        const x = padding + i * pointWidth
        const value = Number.parseFloat(point.value)
        const y = padding + chartHeight - (Math.min(value, maxValue) / maxValue) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = value < 2 ? "#ef4444" : "#10b981" // Red for < 2.0, Green for >= 2.0
        ctx.fill()

        // Add x-axis labels for every 10th point
        if (i % 10 === 0) {
          ctx.fillStyle = "#9ca3af"
          ctx.font = "12px Inter, sans-serif"
          ctx.textAlign = "center"
          ctx.fillText((displayData.length - i).toString(), x, canvas.height - 10)
        }
      })
    }

    drawChart()

    return () => {
      window.removeEventListener("resize", setDimensions)
    }
  }, [data])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
