"use client"

import { useState,  } from "react"
import { Check, Copy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CrashHistoryChart from "@/components/crash-history-chart"
import CrashHistoryTable from "@/components/crash-history-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import  {useLivePrediction} from "../../lib/useLivePrediction"
import {processData,storedscore,resetSignals,playSignal} from "@/lib/pre"
import {newPredictor,storedscores,clearCrashHistory} from "@/lib/newPredictor"
import { dc15,stored } from "@/lib/dc15"


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
  crashHistory: any[]
  prediction: PredictionProps | null
}
export default function PredictPage() {
        const { data, status,queuedUrls ,odd} = useLivePrediction();
       const procc=processData( data.crashHistory,data?.prediction?.last10,data?.prediction?.last30)
       const pro=playSignal()
       const check=pro?.includes(procc)
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

  // const handleCopyPrediction = () => {
  //   navigator.clipboard.writeText(`Next prediction: ${data.prediction?.prediction} (${data.prediction?.confidence}% confidence)`)
  //   setCopied(true)
  //   setTimeout(() => setCopied(false), 2000)
  // }
 // Helper for DC colors
  const getDcColor = (dc: number) => {
    if (dc > 0) return "text-emerald-400" // positive → green
    if (dc < 0) return "text-red-400" // negative → red
    return "text-gray-400" // zero → neutral
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
              <div>
        {status === "connecting" && "🟡 Connecting..."}
        {status === "connected" && "🟢 Connected"}
        {status === "disconnected" && "🔴 Disconnected"}
       
      </div>
      <p className="border-2 border-red-600 bg-slate-50 text-black p-2"> {odd}</p>
            <div className="rounded-lg bg-gray-800 p-6">
              <div>
               <div>
                <p>{dc15(data?.prediction?.last30,data?.crashHistory)}</p>
                <p>{newPredictor(data?.prediction?.last30,data?.crashHistory)}</p>
               <div className="flex overflow-x-auto">
                <p>run++{storedscores["run"].filter(v => v).length} {storedscores["run"].filter(v => !v).length}  </p>
  {storedscores["run"].map((p, index) => (
    <div key={index}>
      <p className={p ? "text-green-500" : "text-pink-600"}>
        {p ? "✅" : "❌"}
      </p>
    </div>
  ))}
</div>
 <div className="flex overflow-x-auto">
                <p>dc15++{stored["run"].filter(v => v).length} {stored["run"].filter(v => !v).length}  </p>
  {stored["run"].map((p, index) => (
    <div key={index}>
      <p className={p ? "text-green-500" : "text-pink-600"}>
        {p ? "✅" : "❌"}
      </p>
    </div>
  ))}
</div>
<div>
  <h3>Queued URLs:</h3>
    <ul>
      {queuedUrls.map((q, i) => (
        <li key={i}>{q.url} (added {new Date(q.addedAt).toLocaleTimeString()})</li>
      ))}
    </ul>
    </div>
                {/* <div className="flex overflow-x-auto">
                <p>10++{storedscore["10>"].filter(v => v).length} {storedscore["10>"].filter(v => !v).length}  </p>
  {storedscore["10>"].map((p, index) => (
    <div key={index}>
      <p className={p ? "text-green-500" : "text-pink-600"}>
        {p ? "✅" : "❌"}
      </p>
    </div>
  ))}
</div> */}
  {/* <div className="flex overflow-x-auto">
    <p>25++{storedscore["25>"].filter(v => v).length} {storedscore["25>"].filter(v => !v).length} </p>
    {storedscore["25>"].map((p, index) => (
      <div key={index}>
        <p className={p ? "text-green-500" : "text-pink-600"}>
          {p ? "✅" : "❌"}
        </p>
      </div>
    ))}
  </div> */}

  {/* <div className="flex overflow-x-auto">
    <p>1025++{storedscore["10>25>"].filter(v => v).length} {storedscore["10>25>"].filter(v => !v).length} </p>
    {storedscore["10>25>"].map((p, index) => (
      <div key={index}>
        <p className={p ? "text-green-500" : "text-pink-600"}>
          {p ? "✅" : "❌"}
        </p>
      </div>
    ))}
  </div> */}
   {/* <div className="flex overflow-x-auto">
    <p>seya++{storedscore["seya"].filter(v => v).length} {storedscore["seya"].filter(v => !v).length} </p>
    {storedscore["seya"].map((p, index) => (
      <div key={index}>
        <p className={p ? "text-green-500" : "text-pink-600"}>
          {p ? "✅" : "❌"}
        </p>
      </div>
    ))}
  </div> */}
  <button onClick={()=>clearCrashHistory()} className="text-pink-700 border-2 border-red-200 p-2">reset</button>
</div>

              </div>
              {/* Last 10 */}
              <div className="mb-4">
                <div className="mb-2 text-sm text-gray-400">Last 10</div>
                <div className="space-y-1">
                  {data.prediction?.last10.map((p, i) => (
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

              {/* <div className="mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div className="text-sm">
                  Next game in: <span className="font-bold text-yellow-500">{countdown}s</span>
                </div>
              </div> */}

              {/* <Button onClick={handleCopyPrediction} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied!" : "Copy Prediction"}
              </Button> */}
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
  )
}
