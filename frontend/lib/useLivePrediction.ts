"use client";

import { useEffect, useState, useRef } from "react";

type PredictionItem = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

type PredictionProps = {
  last30: PredictionItem[];
};

type DataProps = {
  crashHistory: number[];
  firstOneReturn:string
  only25Return:string
  storeds:{run:boolean[]}
  storedscore25:{"25>":boolean[]},
  prediction:PredictionProps,
  grater:string,
  storedscoreGrater:{"25>":boolean[]}
};

type QueueItem = {
  url: string;
  addedAt: number;
};

const demoData: DataProps = {
  crashHistory: [1.2, 2.5, 3.0, 1.9, 2.2],
  firstOneReturn:"",
   only25Return:"",
   storeds:{run:[]},
   storedscore25:{"25>":[]},
   grater:"",
   storedscoreGrater:{"25>":[]},
  prediction: {
    last30: [
      { lessThan2: 13, greaterOrEqual2: 12, dc: -3 },
      { lessThan2: 15, greaterOrEqual2: 10, dc: -5 },
      { lessThan2: 13, greaterOrEqual2: 12, dc: -1 },
    ]
  }
};

export function useLivePrediction() {
  const [data, setData] = useState<DataProps | null>(null);
  const [queuedUrls, setQueuedUrls] = useState<QueueItem[]>([]);
  const [odd, setOdd] = useState<number>(0);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  const lastDataRef = useRef<string>("");
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let retryDelay = 2000; // 2 seconds retry delay
    function connect() {
      const ws = new WebSocket("https://aviater.onrender.com");
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🔌 Predictor connected");
        setStatus("connected");
      };

      ws.onclose = () => {
        console.log("❌ Predictor disconnected, retrying...");
        setStatus("disconnected");
        reconnectTimeoutRef.current = setTimeout(connect, retryDelay);
      };

      ws.onmessage = (event) => {
        if (event.data !== lastDataRef.current) {
          lastDataRef.current = event.data;
          try {
            const parsed = JSON.parse(event.data);
               
            // Check message type
            if (parsed.type === "QUEUE_UPDATE") {
              setQueuedUrls(parsed.queuedUrls || []);
            } else if(parsed.type === "ODD_UPDATE") {
              setOdd(parsed.odd);
            }else{
              setData(parsed)
            }
          } catch (err) {
            console.error("❌ Failed to parse message", err);
          }
        }
      };

      ws.onerror = (err) => {
        console.error("⚠️ WebSocket error", err);
        ws.close(); // Ensures reconnect logic triggers
      };
    }

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return { 
    data: data? data : demoData,
    queuedUrls, // expose queued URLs
    status,
    odd
  };
}
