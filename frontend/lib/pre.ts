"use client";

type SignalType = "10>" | "25>" | "10>25>" | "";

type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

let pendings: { signal: SignalType; triggerIndex: number }[] = [];

const storedscore: Record<SignalType, boolean[]> = {
  "": [],
  "10>": [],
  "25>": [],
  "10>25>": []
};

function processData(
  crashHistory: number[],
  last10: WindowSummary[],
  last30: WindowSummary[]
): SignalType {
  if (crashHistory.length < 10) return "";
  const lastIndex = crashHistory.length - 1;
  if (lastIndex < 0) return "";

  // 1) Resolve any pending signals
  if (pendings.length) {
    const remaining: typeof pendings = [];
    for (const p of pendings) {
      const nextIdx = p.triggerIndex + 1;
      if (crashHistory.length > nextIdx) {
        const nextVal = crashHistory[nextIdx];
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

  const signal = (s10 + s25) as SignalType;

  // 3) Always queue pending — even if signal is ""
  const alreadyQueued = pendings.some(
    (p) => p.signal === signal && p.triggerIndex === lastIndex
  );
  if (!alreadyQueued) {
    pendings.push({ signal, triggerIndex: lastIndex });
  }

  return signal;
}

function resetSignals() {
  pendings = [];
  (["", "10>", "25>", "10>25>"] as SignalType[]).forEach((k) => (storedscore[k] = []));
}

export { processData, storedscore, resetSignals };
