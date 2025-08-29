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
let dcWindow: number[] = [];  // stores last N dc values
const WINDOW_SIZE = 5;
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
  dcWindow.push(currentDc);

  // Keep only last N values
  if (dcWindow.length > WINDOW_SIZE) {
    dcWindow.shift();
  }

  let message = "";

  // ✅ Check if all last N values are < 15
  const allBelow15 = dcWindow.every(dc => dc < 15);

  // ✅ Optional: Check if they’re increasing
  const strictlyIncreasing = dcWindow.every(
    (dc, i) => i === 0 || dc > dcWindow[i - 1]
  );

  // If we are already in run mode
if (!isRunning) {
    if (allBelow15 && strictlyIncreasing) {
      isRunning = true;
      message = "✅ run (trend detected)";
    }
  } else {
    if (currentDc <= 13) {
      isRunning = false;
      dcWindow = []; // reset trend tracking
      message = "⛔ stop";
    } else {
      message = "✅ run";
    }
  }

  return message;
}

export { dc15, stored };
