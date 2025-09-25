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
  // 1) Always try to resolve pending
  if (pending) {
    const offset = roundCounter - pending.triggerRound;
    if (offset >= 1 && crashHistory.length - offset >= 0) {
      const nextVal = crashHistory[crashHistory.length - offset];
      storedscore25[pending.signal].push(nextVal >= 2);
      pending = null; // ✅ clear it, only one signal at a time
    }
  }

  // 🚨 Only block NEW signals, not resolution
  if (crashHistory.length < 25 || last30[0].greaterOrEqual2 < 12) {
    roundCounter++; // still count the round
    return "";
  }

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

  // 4) Stats
  const runfalse = storedscore25["25>"].filter(v => !v).length;
  const runtrue = storedscore25["25>"].filter(v => v).length;
  const diff = runtrue - runfalse;

  const check = (diff > 1) && crashHistory.length > 34 && (diff < 6);

  if (diff > 5) {
    localStorage.setItem("signalTimestamp", Date.now().toString());
  }

  return check ? s25 : "";
}



function resetSignals() {
  pending = null;
  storedscore25["25>"] = [];
}

export { processData25, storedscore25, resetSignals };
