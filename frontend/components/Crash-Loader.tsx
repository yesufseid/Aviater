"use client";
import { useEffect, useState } from "react";

export default function CrashLoader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#888",
        marginTop: "1rem",
      }}
    >
      Waiting for next round{dots}
    </div>
  );
}
