"use client";

import { useEffect, useState, useRef } from "react";

type PredictionProps = {
  confidence: string;
  pattern: string;
  prediction: string;
  predictionMeaning: string;
};

type DataProps = {
  crashHistory: number[];
  prediction: PredictionProps;
};

// Your fallback demo data
const demoData: DataProps = {
  crashHistory: [1.2, 2.5, 3.0, 1.9, 2.2],
  prediction: {
    confidence: "10%",
    pattern: "xxyy",
    prediction: "y",
    predictionMeaning: "Crash likely above 2.0",
  },
};

export function useLivePrediction() {
  const [data, setData] = useState<DataProps | null>(null);
  const lastDataRef = useRef<string>("");

  useEffect(() => {
    const ws = new WebSocket("http://localhost:3001");

    ws.onmessage = (event) => {
      if (event.data !== lastDataRef.current) {
        lastDataRef.current = event.data;
        setData(JSON.parse(event.data));
      }
    };

    ws.onopen = () => console.log("🔌 Predictor connected");
    ws.onclose = () => console.log("❌ Predictor disconnected");

    return () => ws.close();
  }, []);
  
  // Return live data if available, otherwise fallback demo data
  return data?.prediction ? data : demoData;

}
