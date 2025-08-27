type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const storedscores: { run: (boolean)[] } = {
  run: [],
};

let isPendingRun = false;

function newPredictor(last30: WindowSummary[], crashHistory: number[]) {
  if (crashHistory.length < 25) return "";
  const lastCrash = crashHistory[crashHistory.length - 1];

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
  if (last30[0].greaterOrEqual2 > 9 && last30[0].greaterOrEqual2 < 12&&last30[1].dc!==last30[0].dc) {
    isPendingRun = true;
    return "✅run";
  }

  return "";
}
export {newPredictor,storedscores};
