"use client"
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const storeds: { run: boolean[]} = {
  run: [],
};

let constored=[]

let isPendingRun = false;
let pendingCount = 0;   // how many predictions remain
let message = "";



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
      message = "✅ run finished";
    } else {
       const runfalse =storeds["run"].filter(v => !v).length
      const runtrue=storeds["run"].filter(v => v).length
        const check=(runtrue-runfalse)>1 && crashHistory.length>39&& (runtrue-runfalse)<6
      message =check?`🔮 running... ${pendingCount} left`:""
    }

    return message;
  }

  // Case 2: start new prediction only if not pending
  if (
    last30[0].greaterOrEqual2 >= 12 &&
    last30[0].greaterOrEqual2 <= 14
  ) {
    const last25 = crashHistory.slice(-25);

    // count consecutive >=2 from the start of last25
    let consecutive = 0;
    for (const crash of last25) {
      if (crash >= 2 && consecutive<5) {
        consecutive++;
      } else {
        break;
      }
    }
  
    // only accept streaks greater than 1
    if (consecutive > 1) {
      isPendingRun = true;
      constored=calculateDC(crashHistory,consecutive)
      pendingCount = consecutive;
      message = `🔮run✅(${pendingCount})`;
      const runfalse =storeds["run"].filter(v => !v).length
        const runtrue=storeds["run"].filter(v => v).length
        const check=(runtrue-runfalse)>1 && crashHistory.length>39&& (runtrue-runfalse)<6
      return check?message:""
    }
  }

  return "";
}

function calculateDC(crashHistory, numberofcon) {
  // Count how many >= 2
  const computeGreaterOrEqual2 = (historySlice) => {
    return historySlice.filter(v => v >= 2).length;
  };

  // Simulate appending next values
  const simulateNext = (slice, nextValues) => {
    const newSlice = [...slice.slice(nextValues.length), ...nextValues];
    return computeGreaterOrEqual2(newSlice);
  };

  // Define patterns for each case (x < 2, y ≥ 2)
  const patterns = {
    2: {
      xx: [1.5, 1.7],
      xy: [1.5, 2.5],
      yx: [2.5, 1.5],
      yy: [2.5, 3.0],
    },
    3: {
      xxx: [1.2, 1.5, 1.8],
      yyy: [2.2, 3.1, 2.5],
      xxy: [1.5, 1.8, 2.5],
      yxy: [2.5, 1.5, 2.5],
      yyx: [2.5, 3.0, 1.5],
    },
    4: {
      xxxx: [1.2, 1.5, 1.7, 1.9],
      yyyy: [2.2, 3.1, 2.9, 4.0],
      xxxy: [1.5, 1.8, 1.9, 2.5],
      yyxx: [2.5, 3.0, 1.5, 1.8],
      xxyy: [1.5, 1.8, 2.5, 3.0],
      xyxy: [1.5, 2.5, 1.6, 3.0],
    },
  };

  // Take last 25 values
  const slice = crashHistory.slice(-25);

  // Build results
  const results = [];
  if (patterns[numberofcon]) {
    for (const [pattern, values] of Object.entries(patterns[numberofcon])) {
      results.push({
        pattern,
        greaterOrEqual2: simulateNext(slice, values),
      });
    }
  }

  return results;
}






export { firstOne, storeds ,constored};
