"use client"
;

const storeds = {
  run: [],
};


let isPendingRun = false;
let pendingCount = 0;   // how many predictions remain
let message = "";


function firstOne(last30, crashHistory) {
  if (crashHistory.length < 25) return "";
  const lastCrash = crashHistory[crashHistory.length - 1];

  // Case 1: resolve pending predictions
  if (isPendingRun) {
    if (lastCrash >= 2) {
      storeds.run.push(true);
    } else {
      storeds.run.push(false);
    }
 if(last30[0].greaterOrEqual2 < 10){
     resetSignals()
  }
    pendingCount--;

    if (pendingCount <= 0) {
      isPendingRun = false;
      pendingCount = 0;
      const runfalse =storeds["run"].filter(v => !v).length
      const runtrue=storeds["run"].filter(v => v).length
        const check=(runtrue-runfalse)&& crashHistory.length>30&& (runtrue-runfalse)<6
      message =check?"✅ run finished":""
    } else {
       const runfalse =storeds["run"].filter(v => !v).length
      const runtrue=storeds["run"].filter(v => v).length
        const check=(runtrue-runfalse)>1&& crashHistory.length>30&& (runtrue-runfalse)<6
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
      pendingCount = consecutive;
      message = `🔮run✅(${pendingCount})`;
      const runfalse =storeds["run"].filter(v => !v).length
        const runtrue=storeds["run"].filter(v => v).length
        const check=(runtrue-runfalse)>1 && crashHistory.length>30&& (runtrue-runfalse)<6
      return check? message:""
    }
  }

  return "";
}

function resetSignals() {
  storeds["run"] = [];
}
module.exports={firstOne,storeds}