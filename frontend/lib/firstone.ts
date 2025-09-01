"use client"
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const storeds: { run: boolean[] } = {
  run: [],
};

let isPendingRun = false;
let pendingCount = 0;   // how many predictions remain
let message=""
function firstOne(last30: WindowSummary[], crashHistory: number[]) {
  if (crashHistory.length < 25) return "";
  const lastCrash = crashHistory[crashHistory.length - 1];

  // Case 1: resolve pending predictions
  if (isPendingRun) {
    if (lastCrash >= 2) {
      storeds.run.push(true);
    } else {
      storeds.run.push(false);
    }

    pendingCount--;

    if (pendingCount <= 0) {
      isPendingRun = false;
      pendingCount = 0;
    }

    // while pending, we don't start a new search
    return "";
  }

  // Case 2: start new prediction only if not pending
  if (
    last30[0].greaterOrEqual2 >= 10 &&
    last30[0].greaterOrEqual2 <= 15
  ) {
    const last25 = crashHistory.slice(-25);

    // count consecutive >=2 from the start of last25
    let consecutive = 0;
    for (const crash of last25) {
      if (crash >= 2) {
        consecutive++;
      } else {
        break;
      }
    }

    // only accept streaks greater than 1
    if (consecutive > 1) {
      isPendingRun = true;
      pendingCount = consecutive;
      message= `🔮run${consecutive}`;
    }
  }

  return  isPendingRun?message:""
}

export { firstOne, storeds };
