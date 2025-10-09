"use client"

import { useState, useEffect } from "react"
import { Check, Copy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CountdownTimer from "@/components/timeStanp"
import CrashAnimation from "@/components/crash-animation"
import CrashPointsHistory from "@/components/crashpoint-history"
import { useLivePrediction } from "../../lib/useLivePrediction"


const bettingSites = [
  { id: "arada", name: "Arada Bet Aviator" },
  { id: "betika", name: "Betika" },
  { id: "helabet", name: "Helabet" },
  { id: "1xbet", name: "1xBet" },
]

type PredictionItem = {
  lessThan2: number
  greaterOrEqual2: number
  dc: number
}

type PredictionProps = { 
  last10: PredictionItem[]
  last30: PredictionItem[]
  nextValue:{prediction:string,confidence:string}
}

type DataProps = {
   dc:number
  crashpoint: number

}




export default function PredictPage() {
  const { data, status, queuedUrls, odd } = useLivePrediction();
  const [dc,setDc]=useState<number[]>([])
  const lastCrash = data.crashHistory[data.crashHistory.length - 1];
   const [isRunning, setIsRunning] = useState(false)
  const [showRunner, setShowRunner] = useState(false)
 useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    if (data.only25Return === "25>" && odd < 25) {
      setShowRunner(true)
      setIsRunning(false)

      // After 6 seconds, start running
      timer = setTimeout(() => setIsRunning(true), 6000)
    } else {
      // Reset if condition changes or odd >= 25
      setShowRunner(false)
      setIsRunning(false)
      clearTimeout(timer)
    }

    return () => clearTimeout(timer)
  }, [data.only25Return, odd])
    
  if (data === null) return <p>making connection</p>

  const [selectedSite, setSelectedSite] = useState("arada")
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState("chart")

  const getDcColor = (dc: number) => {
    if (dc > 0) return "text-emerald-400" // positive → green
    if (dc < 0) return "text-red-400" // negative → red
    return "text-gray-400" // zero → neutral
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Crash Predictor</h1>
         <CountdownTimer />
        {/* Site Selector */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium">Choose Betting Site</label>
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="w-full max-w-xs bg-gray-800">
              <SelectValue placeholder="Select a betting site" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800">
              {bettingSites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Crash History Viewer */}
          <div className="lg:col-span-2 flex-col items-center justify-center">
            <CrashPointsHistory crashPoints={data?.crashHistory}  />
          <CrashAnimation  liveMultiplier={odd}  crashPoint={lastCrash} />
          </div>

          {/* Prediction Box */}
          <div>
            <h2 className="mb-4 text-xl font-bold">🧠 Next Prediction</h2>
            <div>
              {status === "connecting" && "🟡 Connecting..."}
              {status === "connected" && "🟢 Connected"}
              {status === "disconnected" && "🔴 Disconnected"}
            </div>
            {/* odd just displays, does not trigger recompute */}
            <p className="border-2 border-green-600 rounded-full ml-auto w-20 justify-center text-center">
              {data?.crashHistory.length}
            </p> 

            <div className="rounded-lg bg-gray-800 p-6">
              <div>
                <div className="flex items-center space-x-2">
    {showRunner && odd < 25 && (
    <span
      className={`text-2xl transition-all ${
        isRunning ? "animate-run" : "animate-idle"
      }`}
    >
      🏃‍♂️
    </span>
  )}
</div>

                <div>
                  <h3>Queued URLs: {queuedUrls.length}</h3>
                </div>

                <div className="flex overflow-x-auto">
                  <p>25++{data.storedscore25["25>"].filter(v => v).length} {data.storedscore25["25>"].filter(v => !v).length}</p>
                  {data.storedscore25["25>"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last 30 */}
              <div className="mb-4">
                <div className="mb-2 text-sm text-gray-400">Last 25</div>
                <div className="space-y-1">
                  {data.prediction?.last30.map((p, i) => (
                    <div 
                      key={i} 
                      className="flex justify-between font-mono text-sm bg-gray-900 px-2 py-1 rounded"
                    >
                      <span>&lt;2: {p.lessThan2}</span>
                      <span>≥2: {p.greaterOrEqual2}</span>
                      <span className={getDcColor(p.dc)}>DC: {p.dc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-lg border border-yellow-800 bg-yellow-900/20 p-4 text-sm">
          <div className="flex items-start">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
            <p className="text-yellow-200">
              Remember to play responsibly. Our predictions are based on pattern analysis but cannot guarantee outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
