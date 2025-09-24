"use client";
import React from "react";

type Props = {
  crashPoints: number[]; // full history array
};

export default function CrashPointsHistory({ crashPoints }: Props) {
  // keep only the last 25
  const last25 = crashPoints.slice(-25);

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {last25.map((point, idx) => (
        <span
          key={idx}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: point < 2 ? "red" : "green",
          }}
        >
          {point.toFixed(2)}x
        </span>
      ))}
    </div>
  );
}
