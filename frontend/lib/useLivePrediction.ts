"use client";

import { useEffect, useState, useRef } from "react";
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
  crashHistory: number[];
  prediction: PredictionProps;
};

// Your fallback demo data
const demoData: DataProps = {
  crashHistory: [1.2, 2.5, 3.0, 1.9, 2.2],
  prediction: {
    "last10": [
      {
        "lessThan2": 6,
        "greaterOrEqual2": 4,
        "dc": -2
      },
       {
        "lessThan2": 6,
        "greaterOrEqual2": 4,
        "dc": -2
      },
       {
        "lessThan2": 5,
        "greaterOrEqual2": 5,
        "dc": 0
      },
       {
        "lessThan2": 4,
        "greaterOrEqual2": 5,
        "dc": 1
      },
      {
        "lessThan2": 4,
        "greaterOrEqual2": 5,
        "dc": 1
      },
      {
        "lessThan2": 4,
        "greaterOrEqual2": 5,
        "dc": 1
      },
      {
        "lessThan2": 4,
        "greaterOrEqual2": 5,
        "dc": 1
      }
    ],
    "last30": [
               {
        "lessThan2": 14,
        "greaterOrEqual2": 11,
        "dc": -3
      },
      {
        "lessThan2": 15,
        "greaterOrEqual2": 10,
        "dc": -5
      },
       {
        "lessThan2": 14,
        "greaterOrEqual2": 11,
        "dc": -3
      },
      {
        "lessThan2": 13,
        "greaterOrEqual2": 11,
        "dc": -2
      },
      {
        "lessThan2": 13,
        "greaterOrEqual2": 11,
        "dc": -2
      },
       {
        "lessThan2": 13,
        "greaterOrEqual2": 11,
        "dc": -2
      },
    {
        "lessThan2": 13,
        "greaterOrEqual2": 11,
        "dc": -2
      }
    ],
    "nextValue": {
      "prediction": "≥ 2",
      "confidence": "high"
    }
  },
};

export function useLivePrediction() {
  const [data, setData] = useState<DataProps | null>(null);
  const lastDataRef = useRef<string>("");

  useEffect(() => {
    const ws = new WebSocket("wss://aviater-backend.onrender.com");

    ws.onmessage = (event) => {
      if (event.data !== lastDataRef.current) {
        lastDataRef.current = event.data;
        console.log("seta",event.data);
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
