"use client";
import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("signalTimestamp");
    if (!saved) return;

    const start = parseInt(saved, 10);
    const oneHour = 60 * 60 * 1000;

    const update = () => {
      const now = Date.now();
      const diff = oneHour - (now - start);

      if (true) {
        localStorage.removeItem("signalTimestamp");
        setTimeLeft(0);
        return;
      }

      setTimeLeft(diff);
    };

    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft <= 0) return null;

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div>
     {timeLeft===0?"":
    <div className="absolute w-[1400px] h-[500px]  z-50 bg-black text-yellow-50 flex justify-center items-center">
      ⏳ Time left: {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
    }
    </div>
  );
}
