"use client"
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const stored: { run: boolean[] } = {
  run: [],
};

let isRunning = false;       // whether we're currently in a run
let dcWindow: number[] = []; // stores last N dc values
const WINDOW_SIZE = 3;

function dc15(last30: WindowSummary[], crashHistory: number[]) {
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

  // 🔄 Update run state first
  if (!isRunning) {
    if (allBelow15 && currentDc === 15) {
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

  // 🔥 Now push to stored AFTER updating isRunning
  stored.run.push(isRunning && lastCrash >= 2);

  return message;
}

export { dc15, stored };
