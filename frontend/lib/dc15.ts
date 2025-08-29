"use client"
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const stored: { run: boolean[] } = {
  run: [],
};

let isRunning = false;      // whether we're currently in a run
let lastDc: number | null = null;  
let uptrendCount = 0;       // counts how many upward moves we’ve seen in a row (ignores small dips)
// 🔹 Key for localStorage
const CRASH_HISTORY_KEY = "crashHistory";

/**
 * Load crashHistory from localStorage (or empty array if none).
 */
function loadCrashHistory(): number[] {
  try {
    const saved = localStorage.getItem(CRASH_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error("⚠️ Failed to load crashHistory:", err);
    return [];
  }
}

/**
 * Save crashHistory into localStorage.
 */
function saveCrashHistory(history: number[]) {
  try {
    localStorage.setItem(CRASH_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error("⚠️ Failed to save crashHistory:", err);
  }
}


/**
 * Merge crashHistory with stored one if current is shorter.
 */
function mergeCrashHistory(incoming: number[]): number[] {
  const stored = loadCrashHistory();
  if (incoming.length < stored.length) {
    // Merge: keep stored first, then append new ones avoiding duplicates
    const merged = [...stored, ...incoming.slice(stored.length)];
    saveCrashHistory(merged);
    return merged;
  } else {
    saveCrashHistory(incoming);
    return incoming;
  }
}

let lastCrashHistory:number[]=[]
function dc15(last30: WindowSummary[], crashHistory: number[]) {

     if(lastCrashHistory===crashHistory){
      return ""
     }else{
      lastCrashHistory=crashHistory
     }


    // 🔹 merge and persist history
  crashHistory = mergeCrashHistory(crashHistory);
  if (crashHistory.length < 15) return "";
  
  const lastCrash = crashHistory[crashHistory.length - 1];
  const currentDc = last30[0].dc;

  let message = "";

  // Track trend
  if (lastDc !== null) {
    if (currentDc > lastDc) {
      uptrendCount++; // upward move
    } else if (currentDc < lastDc) {
      uptrendCount = Math.max(0, uptrendCount - 1); // small dip reduces but doesn't kill trend
    }
  }
  lastDc = currentDc;

  // If we are already in run mode
  if (isRunning) {
    if (currentDc <= 13) {
      // stop when it falls to 13 or below
      isRunning = false;
      uptrendCount = 0;
      message = "⛔ stop";
    } else {
      message = "✅run";
    }
  } else {
    // Not running yet, check if trend reached >= 15
    if (currentDc >= 15 && uptrendCount >= 2) {
      // at least 2 upward pushes before hitting 15
      isRunning = true;
      message = "✅run";
    }
  }

  // Save result if in run mode
  if (isRunning && lastCrash) {
    stored.run.push(lastCrash >= 2);
  }

  return message;
}

export { dc15, stored };
