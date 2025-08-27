type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const storedscores: { run: (boolean | "pending")[] } = {
  run: [],
};

// keep track if we are waiting for the next result
let isPendingRun = false;

function newPredictor(last30: WindowSummary[], crashHistory: number[]) {
  const lastCrash = crashHistory[crashHistory.length - 1];

  // If we had a pending run, resolve it now
  if (isPendingRun) {
    if (lastCrash >= 2) {
      storedscores.run.push(true);
    } else {
      storedscores.run.push(false);
    }
    isPendingRun = false; // reset
  }

  // Check condition to set up a new pending run
  if (last30[0].greaterOrEqual2 > 9 && last30[0].greaterOrEqual2 < 12&&last30[0].dc!==last30[1].dc) {
    storedscores.run.push("pending"); // optional: mark pending
    isPendingRun = true;
    return "✅run (pending)";
  }

  return "";
}

export {newPredictor,storedscores};
