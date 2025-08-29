"use client"
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const storedscores: { run: boolean[] } = {
  run: [],
};

let isPendingRun = false;
let lastDc = 1000;

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
 * Clear crashHistory from localStorage.
 */
function clearCrashHistory() {
  try {
    localStorage.removeItem(CRASH_HISTORY_KEY);
    console.log("🗑️ Cleared crashHistory from localStorage");
  } catch (err) {
    console.error("⚠️ Failed to clear crashHistory:", err);
  }
}

/**
 * Merge crashHistory with stored one if current is shorter.
 */
function mergeCrashHistory(incoming: number[]): number[] {

  const stored = loadCrashHistory();
  console.log("stored",stored);
  
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
function newPredictor(last30: WindowSummary[], crashHistory: number[]) {
     if(lastCrashHistory===crashHistory){
      return ""
     }else{
      lastCrashHistory=crashHistory
     }
    // 🔹 merge and persist history
  crashHistory = mergeCrashHistory(crashHistory);
  if (crashHistory.length < 25) return "";

  // 🔹 merge and persist history
  crashHistory = mergeCrashHistory(crashHistory);

  const lastCrash = crashHistory[crashHistory.length - 1];
  lastDc = last30[0].dc;

  // Case 1: resolve pending first
  if (isPendingRun) {
    isPendingRun = false; // reset immediately
    if (lastCrash >= 2) {
      storedscores.run.push(true);
    } else {
      storedscores.run.push(false);
    }
  }

  // Case 2: no pending, check if we should set pending
  if (
    last30[0].greaterOrEqual2 > 9 &&
    last30[0].greaterOrEqual2 < 12 &&
    last30[1].dc !== last30[0].dc &&
    lastDc <= last30[0].dc
  ) {
    isPendingRun = true;
    return "✅run";
  }

  return "";
}

export { newPredictor, storedscores, clearCrashHistory };
