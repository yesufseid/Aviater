"use client";

type SignalType = "10>" | "25>" | "10>25>" | "seya";

type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

// only one pending at a time
let pending: { signal: SignalType; triggerRound: number } | null = null;

const storedscore: Record<SignalType, boolean[]> = {
  "seya": [],
  "10>": [],
  "25>": [],
  "10>25>": []
};

let roundCounter = 0; // global counter across the game

function processData(
  crashHistory: number[],
  last10: WindowSummary[],
  last30: WindowSummary[]
) {
  if (crashHistory.length < 25) return "";
  const lastIndex = crashHistory.length - 1;
  if (lastIndex < 0) return "";

  roundCounter++; // increment each new crash

  // 1) Resolve pending
  if (pending) {
    const offset = roundCounter - pending.triggerRound;
    if (offset >= 1 && crashHistory.length - offset >= 0) {
      const nextVal = crashHistory[crashHistory.length - offset];
      storedscore[pending.signal].push(nextVal >= 2);
      pending = null; // ✅ clear it, only one signal at a time
    }
  }

  // 2) Compute current signal
  const s10: "" | "10>" =
    last10.length >= 3 &&
    JSON.stringify(last10[0]) === JSON.stringify(last10[2])
      ? "10>"
      : "";
  const s25: "" | "25>" =
    last30.length >= 3 &&
    JSON.stringify(last30[0]) === JSON.stringify(last30[2])
      ? "25>"
      : "";

  const signal = (s10 + s25 === "" ? "seya" : (s10 + s25)) as SignalType;

  // 3) Queue only if no active pending
  if (!pending) {
    pending = { signal, triggerRound: roundCounter };
  }

  return signal;
}

function resetSignals() {
  pending = null;
  (["seya", "10>", "25>", "10>25>"] as SignalType[]).forEach(
    (k) => (storedscore[k] = [])
  );
}

export { processData, storedscore, resetSignals };
