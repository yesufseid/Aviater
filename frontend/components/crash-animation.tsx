"use client";
import { useEffect, useState } from "react";

type Props = {
  liveMultiplier: number;  // current multiplier value (streamed)
  crashPoint?: number;     // final crash value (optional until game ends)
};

export default function CrashAnimation({ liveMultiplier, crashPoint }: Props) {

  return (
    <div style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold" }}>
        <span style={{ color: "green" }}>{liveMultiplier}x</span>
      
    </div>
  );
}
