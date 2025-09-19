"use client"
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const thestoreds: { run: boolean[]} = {
  run: [],
};


let isPendingRun = false;
let pendingCount = 0;   // how many predictions remain
let message = "";
let runone=false


function theOne(last30: WindowSummary[], crashHistory: number[]) {
  if (crashHistory.length < 25) return "";
  const lastCrash = crashHistory[crashHistory.length - 1];

  // Case 1: resolve pending predictions
  if (!isPendingRun && runone ) {
      runone=false
    if (lastCrash >= 2) {
      thestoreds.run.push(true);
    } else {
      thestoreds.run.push(false);
    }

    pendingCount--;

    if (pendingCount <= 0) {
      isPendingRun = false;
      pendingCount = 0;
      message = "";
    } else {
      message = ``;
    }

    return message;
  }

  // Case 2: start new prediction only if not pending
  if (
    last30[0].greaterOrEqual2 >= 5 &&
    last30[0].greaterOrEqual2 <= 18
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
     if(consecutive>1){
      isPendingRun = true;
      pendingCount = consecutive
     }
    // only accept streaks greater than 1
    if (consecutive === 1 && !isPendingRun ) {;
      runone=true
      message = `🔮run✅one`;
      const runfalse =thestoreds["run"].filter(v => !v).length
      const runtrue=thestoreds["run"].filter(v => v).length
      const check=(runtrue-runfalse)>2 && crashHistory.length>39
      return check?message:""
    }
  }

  return "";
}




export { theOne, thestoreds};
