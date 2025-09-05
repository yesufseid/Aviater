"use client"
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const storeds: { run: boolean[],one:boolean[] } = {
  run: [],
  one:[]
};

let isPendingRun = false;
let pendingCount = 0;   // how many predictions remain
let message = "";
let  isone=false


function firstOne(last30: WindowSummary[], crashHistory: number[]) {
  if (crashHistory.length < 25) return "";
  const lastCrash = crashHistory[crashHistory.length - 1];

  // Case 1: resolve pending predictions
  if (isPendingRun) {
    if (lastCrash >= 2) {
      storeds.run.push(true);
      isone&&storeds.one.push(true)
      isone=false
    } else {
      storeds.run.push(false);
    }

    pendingCount--;

    if (pendingCount <= 0) {
      isPendingRun = false;
      pendingCount = 0;
      message = "✅ run finished";
    } else {
      message = `🔮 running... ${pendingCount} left`;
    }

    return message;
  }

  // Case 2: start new prediction only if not pending
  if (
    last30[0].greaterOrEqual2 >= 11 &&
    last30[0].greaterOrEqual2 <= 13
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
      isone=true
      pendingCount = consecutive;
      message = `🔮run✅(${pendingCount})`;
      return message;
    }
  }

  return "";
}

export { firstOne, storeds };
