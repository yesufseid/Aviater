"use client"

import { useState,  } from "react"
import { Check, Copy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CrashHistoryChart from "@/components/crash-history-chart"
import CrashHistoryTable from "@/components/crash-history-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import  {useLivePrediction} from "../../lib/useLivePrediction"


const bettingSites = [
  { id: "arada", name: "Arada Bet Aviator" },
  { id: "betika", name: "Betika" },
  { id: "helabet", name: "Helabet" },
  { id: "1xbet", name: "1xBet" },
]
type predictionprops={ 
confidence:string
pattern:string
prediction:string
predictionMeaning:string
}
   type DataProps={
    crashHistory:[]
     prediction:predictionprops | null
   }
export default function PredictPage() {
        const data:DataProps | null=useLivePrediction()


        if(data===null) return <p>making connection</p>
  const [selectedSite, setSelectedSite] = useState("arada")
  // const [countdown, setCountdown] = useState(30)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState("chart")
  // useEffect(() => {
    
  //   const timer = setInterval(() => {
  //     setCountdown((prev) => (prev > 0 ? prev - 1 : 30))
  //   }, 1000)
  //   return () => clearInterval(timer)
  // }, [])

  const handleCopyPrediction = () => {
    navigator.clipboard.writeText(`Next prediction: ${data.prediction?.prediction} (${data.prediction?.confidence}% confidence)`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Crash Predictor</h1>

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
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">📉 Last 100 Crash Odds</h2>
              <Tabs value={viewMode} onValueChange={setViewMode}>
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="rounded-lg bg-gray-800 p-4">
              {viewMode === "chart" ? (
                <CrashHistoryChart data={data?.crashHistory} />
              ) : (
                <CrashHistoryTable data={data?.crashHistory} />
              )}
            </div>
          </div>

          {/* Prediction Box */}
          <div>
            <h2 className="mb-4 text-xl font-bold">🧠 Next Prediction</h2>
            <div className="rounded-lg bg-gray-800 p-6">
              <div className="mb-4">
                <div className="mb-2 text-sm text-gray-400">Pattern Detected</div>
                <div className="text-lg font-mono">{data.prediction?.pattern}</div>
              </div>

              <div className="mb-4">
                <div className="mb-2 text-sm text-gray-400">Match Confidence</div>
                <div className="text-lg font-bold text-emerald-500">{data.prediction?.confidence}</div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-700">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${data.prediction?.confidence}` }}></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-2 text-sm text-gray-400">Predicted Outcome</div>
                <div
                  className={`text-2xl font-bold ${data.prediction?.prediction === "x" ? "text-red-500" : "text-emerald-500"}`}
                >
                  {data.prediction?.prediction === "x" ? "🟥" : "🟩"} {data.prediction?.prediction}
                </div>
               <div className="mb-2 text-sm text-gray-400">{data.prediction?.predictionMeaning}</div>
              </div>

              {/* <div className="mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div className="text-sm">
                  Next game in: <span className="font-bold text-yellow-500">{countdown}s</span>
                </div>
              </div> */}

              <Button onClick={handleCopyPrediction} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied!" : "Copy Prediction"}
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 rounded-lg border border-yellow-800 bg-yellow-900/20 p-4 text-sm">
              <div className="flex items-start">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                <p className="text-yellow-200">
                  Remember to play responsibly. Our predictions are based on pattern analysis but cannot guarantee
                  outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
