"use client";

type SignalType = "25>"

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
  if (crashHistory.length < 25 && last30[0].greaterOrEqual2<12 ) return "";
  const lastIndex = crashHistory.length - 1;
  if (lastIndex < 0) return "";

  roundCounter++; // increment each new crash

  // 1) Resolve pending
  if (pending) {
    const offset = roundCounter - pending.triggerRound;
    if (offset >= 1 && crashHistory.length - offset >= 0) {
      const nextVal = crashHistory[crashHistory.length - offset];
      storedscore25[pending.signal].push(nextVal >= 2);
      pending = null; // ✅ clear it, only one signal at a time
    }
  }

  // 2) Compute current signal
 
  const s25: "" | "25>" =
    last30.length >= 3 &&
    JSON.stringify(last30[0]) === JSON.stringify(last30[2])
      ? "25>"
      : "";

  const signal = (s25) as SignalType;

  // 3) Queue only if no active pending
  if (!pending) {
    pending = { signal, triggerRound: roundCounter };
  }

  return signal;
}

function resetSignals() {
  pending = null;
  (["seya", "10>", "25>", "10>25>"] as SignalType[]).forEach(
    (k) => (storedscore25[k] = [])
  );
}

export { processData25, storedscore25, resetSignals };
