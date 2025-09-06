"use client"

import { useState, useEffect } from "react"
import { Check, Copy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CrashHistoryChart from "@/components/crash-history-chart"
import CrashHistoryTable from "@/components/crash-history-table"
import CrashAnimation from "@/components/crash-animation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLivePrediction } from "../../lib/useLivePrediction"
import { processData, storedscore, resetSignals,} from "@/lib/pre"
import { newPredictor, storedscores } from "@/lib/newPredictor"
import { dc15, stored } from "@/lib/dc15"
import { firstOne,storeds,constored } from "@/lib/firstone"

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

  const [results, setResults] = useState<any>({
    processed: null,
    played: null,
    dc15Result: null,
    newPredictResult: null,
    firstOneResult:null
  });

  // 🔥 Run predictors ONLY when data.prediction changes
  useEffect(() => {
    if (!data?.prediction) return;

    const processed = processData(
      data.crashHistory,
      data.prediction.last10,
      data.prediction.last30,
    );

    const played = processData(data.crashHistory,data.prediction.last10,data.prediction.last30);
    const dc15Result = dc15(data.prediction.last30, data.crashHistory);
    const newPredictResult = newPredictor(data.prediction.last30, data.crashHistory);
    const firstOneResult=firstOne(data.prediction.last30,data.crashHistory)
    setResults({
      processed,
      played,
      dc15Result,
      newPredictResult,
      firstOneResult
    });
    setDc([...dc,data?.prediction.last30[0].dc])
  }, [data?.prediction]);
    
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
                <CrashHistoryChart data={dc} />
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

            {/* odd just displays, does not trigger recompute */}
            <p className="border-2 border-green-600 rounded-full ml-auto w-20 justify-center text-center">
              {odd}
            </p>

            <div className="rounded-lg bg-gray-800 p-6">
              <div>
                 <p>{results.firstOneResult}</p>
                  {/* <p>{results.played}</p> */}
                <p>{results.dc15Result}</p>
                {/* <p>{results.newPredictResult}</p> */}
                  
                {/* Results Counters */}
                  <div className="flex overflow-x-auto">
                  <p>fistone++{storeds["run"].filter(v => v).length} {storeds["run"].filter(v => !v).length}</p>
                  {storeds["run"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div>
                  <div className="flex overflow-x-auto">
                  <p>one++{storeds["one"].filter(v => v).length} {storeds["one"].filter(v => !v).length}</p>
                  {storeds["one"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div>
                {/* <div className="flex overflow-x-auto">
                  <p>run++{storedscores["run"].filter(v => v).length} {storedscores["run"].filter(v => !v).length}</p>
                  {storedscores["run"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div> */}

                <div className="flex overflow-x-auto">
                  <p>dc15++{stored["run"].filter(v => v).length} {stored["run"].filter(v => !v).length}</p>
                  {stored["run"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3>Queued URLs: {queuedUrls.length}</h3>
                </div>
{/* 
                <div className="flex overflow-x-auto">
                  <p>10++{storedscore["10>"].filter(v => v).length} {storedscore["10>"].filter(v => !v).length}</p>
                  {storedscore["10>"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div> */}
{/* 
                <div className="flex overflow-x-auto">
                  <p>25++{storedscore["25>"].filter(v => v).length} {storedscore["25>"].filter(v => !v).length}</p>
                  {storedscore["25>"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div> */}

                {/* <div className="flex overflow-x-auto">
                  <p>1025++{storedscore["10>25>"].filter(v => v).length} {storedscore["10>25>"].filter(v => !v).length}</p>
                  {storedscore["10>25>"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div> */}

                {/* <div className="flex overflow-x-auto">
                  <p>seya++{storedscore["seya"].filter(v => v).length} {storedscore["seya"].filter(v => !v).length}</p>
                  {storedscore["seya"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div> */}
              </div>

              {/* Last 10 */}
              <div className="mb-4">
                <div className="mb-2 text-sm text-gray-400">Last 10</div>
                <div className="space-y-1">
                  {constored.map((p, i) => (
                    <div 
                      key={i} 
                      className="flex justify-between font-mono text-sm bg-gray-900 px-2 py-1 rounded"
                    >
                      <span>&lt;{p.pattern}</span>
                      <span> {p.greaterOrEqual2}</span>
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
