"use client";

type SignalType = "10>" | "25>" | "10>25>" | "seya";

type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

let pendings: { signal: SignalType; triggerRound: number }[] = [];

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

// 1) Resolve pendings
if (pendings.length) {
  const remaining: typeof pendings = [];
  for (const p of pendings) {
    const offset = roundCounter - p.triggerRound; 
    if (offset >= 1) {
      const nextVal = crashHistory[crashHistory.length - offset];
      // Always store, even if signal === ""
      storedscore[p.signal].push(nextVal >= 2);
    } else {
      remaining.push(p);
    }
  }
  pendings = remaining;
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
  const s10mins: "" | "-10>" =
    last10.length >= 3 &&
    JSON.stringify(last10[0]) === JSON.stringify(last10[1])
      ? "-10>"
      : "";
  const s25mins: "" | "-25>" =
    last30.length >= 3 &&
    JSON.stringify(last30[0]) === JSON.stringify(last30[1])
      ? "-25>"
      : "";
  const signalmins = s10mins + s25mins;
  const signal = (s10 + s25===""?"seya":s10+s25) as SignalType;

  // 3) Queue pending with roundCounter
  const alreadyQueued = pendings.some(
    (p) => p.signal === signal && p.triggerRound === roundCounter
  );
  if (!alreadyQueued) {
    pendings.push({ signal, triggerRound: roundCounter });
  }

  const sig = signal+signalmins

  return signal
}


function resetSignals() {
  pendings = [];
  (["seya", "10>", "25>", "10>25>"] as SignalType[]).forEach((k) => (storedscore[k] = []));
}



export { processData, storedscore, resetSignals };
