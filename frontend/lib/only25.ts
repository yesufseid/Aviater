"use client";

type SignalType = "25>";

type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

// only one pending at a time
let pending: { signal: SignalType; triggerRound: number } | null = null;

const storedscore25: Record<SignalType, boolean[]> = {
  "25>": [],
};

let roundCounter = 0; // global counter across the game

function processData25(
  crashHistory: number[],
  last30: WindowSummary[]
) { 
  // 1) Resolve pending
  if (pending) {
    const offset = roundCounter - pending.triggerRound;
    if (offset >= 1 && crashHistory.length - offset >= 0) {
      const nextVal = crashHistory[crashHistory.length - offset];
      storedscore25[pending.signal].push(nextVal >= 2);
      pending = null; // ✅ clear it, only one signal at a time
    }
  }
  
  if (crashHistory.length < 25 || last30[0].greaterOrEqual2 < 12) return "";
  const lastIndex = crashHistory.length - 1;
  if (lastIndex < 0) return "";

  roundCounter++; // increment each new crash
  // 2) Compute current signal
  const s25: "" | "25>" =
    last30.length >= 3 &&
    JSON.stringify(last30[0]) === JSON.stringify(last30[2])
      ? "25>"
      : "";

  // 3) Queue only if no active pending
  if (!pending && s25 !== "") {
    pending = { signal: s25, triggerRound: roundCounter };
  }
  const runfalse =storedscore25["25>"].filter(v => !v).length
  const runtrue=storedscore25["25>"].filter(v => v).length
   const diff = runtrue - runfalse;
  const check=(runtrue-runfalse)>1 && crashHistory.length>34 && (runtrue-runfalse)<6
    // ✅ when check > 5 → store timestamp
  if (diff > 5) {
    localStorage.setItem("signalTimestamp", Date.now().toString());
  }
  return check?s25:""
}


function resetSignals() {
  pending = null;
  storedscore25["25>"] = [];
}

export { processData25, storedscore25, resetSignals };
