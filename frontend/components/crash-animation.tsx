"use client";
import { ListVideo } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  liveMultiplier: number;  // current multiplier value (streamed)
  crashPoint?: number;     // final crash value (optional until game ends)
};

export default function CrashAnimation({ liveMultiplier, crashPoint }: Props) {
  const [displayValue, setDisplayValue] = useState(liveMultiplier);
  const [crashed, setCrashed] = useState(false);
   
  useEffect(() => {
    setDisplayValue(liveMultiplier);

    if (crashPoint !== undefined && liveMultiplier >= crashPoint) {
      setCrashed(true);
      setDisplayValue(crashPoint); // lock at crash point
    }else if(liveMultiplier){
      setCrashed(false);
      setDisplayValue(liveMultiplier); // lock at crash point
    }
  }, [liveMultiplier, crashPoint]);

  return (
    <div style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>
      {!crashed ? (
        <span style={{ color: "green" }}>
          {displayValue}x
        </span>
      ) : (
        <span style={{ color: "red" }}>
          💥 {displayValue}x CRASHED!
        </span>
      )}
    </div>
  );
}
