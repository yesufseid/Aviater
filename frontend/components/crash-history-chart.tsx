"use client"

import { useEffect, useRef } from "react"

interface CrashHistoryChartProps {
  data: number[]
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
      const maxValue = 7
      const minValue = -7
      const valueRange = maxValue - minValue

      // Grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1

      const steps = 14 // total lines (-7 to 7)
      for (let i = 0; i <= steps; i++) {
        const value = minValue + (i * valueRange) / steps
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight

        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(padding + chartWidth, y)
        ctx.stroke()

        // y-axis labels
        ctx.fillStyle = "#9ca3af"
        ctx.font = "12px Inter, sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(value.toFixed(1), padding - 10, y + 4)
      }

      // Threshold line at 2.0
      const threshold = 2
      const thresholdY =
        padding + chartHeight - ((threshold - minValue) / valueRange) * chartHeight
      ctx.strokeStyle = "rgba(239, 68, 68, 0.5)"
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding, thresholdY)
      ctx.lineTo(padding + chartWidth, thresholdY)
      ctx.stroke()
      ctx.setLineDash([])

      // Data
      const displayData = data.slice().reverse() // don’t mutate original
      const pointWidth = chartWidth / Math.max(1, displayData.length - 1)

      // Connecting line
      ctx.beginPath()
      ctx.strokeStyle = "rgba(16, 185, 129, 0.7)"
      ctx.lineWidth = 2

      displayData.forEach((point, i) => {
        const x = padding + i * pointWidth
        const value = Number.parseFloat(point as any)
        const y =
          padding + chartHeight - ((value - minValue) / valueRange) * chartHeight

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
        const value = Number.parseFloat(point as any)
        const y =
          padding + chartHeight - ((value - minValue) / valueRange) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = value < 2 ? "#ef4444" : "#10b981"
        ctx.fill()

        // x-axis labels every 10th point
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
