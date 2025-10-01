"use client"

import { useState, useEffect } from "react"
import { Check, Copy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CountdownTimer from "@/components/timeStanp"
import CrashAnimation from "@/components/crash-animation"
import CrashPointsHistory from "@/components/crashpoint-history"
import { useLivePrediction } from "../../lib/useLivePrediction"
import { processData, } from "@/lib/pre"
import { newPredictor,  } from "@/lib/newPredictor"
import { dc15, stored } from "@/lib/dc15"
import { firstOne,storeds, } from "@/lib/firstone"
import {processData25,storedscore25} from "@/lib/only25"
import {theOne,thestoreds} from "@/lib/theOne"

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

let  stopLoss=0


export default function PredictPage() {
  const { data, status, queuedUrls, odd } = useLivePrediction();
  const [dc,setDc]=useState<number[]>([])
  const lastCrash = data.crashHistory[data.crashHistory.length - 1];
  useEffect(()=>{
    if(data.prediction.last30[0].greaterOrEqual2>=12){
       stopLoss++
    }
  },[data?.crashHistory])
  
  const [results, setResults] = useState<any>({
    processed: null,
    played: null,
    dc15Result: null,
    newPredictResult: null,
    firstOneResult:null,
    only25:null,
    One:null
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
    const only25=processData25(data.crashHistory,data.prediction.last30)
    const One=theOne(data.prediction.last30,data.crashHistory)
    setResults({
      processed,
      played,
      dc15Result,
      newPredictResult,
      firstOneResult,
      only25,
      One
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
    <>{stopLoss>=15?(
      <div className="flex justify-center items-center text-red-600 font-bold text-2xl">
         STOP LOSS
      </div>):
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
           <p className="text-pink-600" >{stopLoss}</p>
            {/* odd just displays, does not trigger recompute */}
            <p className="border-2 border-green-600 rounded-full ml-auto w-20 justify-center text-center">
              {data?.crashHistory.length}
            </p> 

            <div className="rounded-lg bg-gray-800 p-6">
              <div>
                 {/* <p>{results.firstOneResult}</p> */}
                  {/* <p>{results.played}</p> */}
                <p>{results.dc15Result}</p>
                <p>{results.only25}</p>
                <p>{results.One}</p>
                {/* <p>{results.newPredictResult}</p> */}
                  
                {/* Results Counters */}
                  {/* <div className="flex overflow-x-auto">
                  <p>fistone++{storeds["run"].filter(v => v).length} {storeds["run"].filter(v => !v).length}</p>
                  {storeds["run"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div> */}
                <div className="flex overflow-x-auto">
                  <p>B++{thestoreds["runB"].filter(v => v).length} {thestoreds["runB"].filter(v => !v).length}</p>
                  {thestoreds["runB"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex overflow-x-auto">
                  <p>S++{thestoreds["runS"].filter(v => v).length} {thestoreds["runS"].filter(v => !v).length}</p>
                  {thestoreds["runS"].map((p, index) => (
                    <div key={index}>
                      <p className={p ? "text-green-500" : "text-pink-600"}>
                        {p ? "✅" : "❌"}
                      </p>
                    </div>
                  ))}
                </div>
                 {/* <div className="flex overflow-x-auto">
                  <p>run2++{thestoreds["run2"].filter(v => v).length} {thestoreds["run2"].filter(v => !v).length}</p>
                  {thestoreds["run2"].map((p, index) => (
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

                <div className="flex overflow-x-auto">
                  <p>25++{storedscore25["25>"].filter(v => v).length} {storedscore25["25>"].filter(v => !v).length}</p>
                  {storedscore25["25>"].map((p, index) => (
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
}</>
  )
}
