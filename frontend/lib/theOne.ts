"use client"
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const thestoreds: { runB: boolean[],runS:boolean[],run2:boolean[]} = {
  runB: [],
  runS:[],
  run2:[]
};


let isPendingRun = false;
let message = "";
let pending:string=""
let pandingrun2=0



function theOne(last30: WindowSummary[], crashHistory: number[]) {
  if (crashHistory.length < 25  ) return "";
  const lastCrash = crashHistory[crashHistory.length - 1];
  // Case 1: resolve pending predictions
  if (isPendingRun) {
    isPendingRun=false
    if (pending==="runB") {
      lastCrash>=2?thestoreds.runB.push(true):thestoreds.runB.push(false);
    } else if(pending==="runS") {
       lastCrash>=2?thestoreds.runS.push(true):thestoreds.runS.push(false);
    }
if (pandingrun2 > 0) {
  thestoreds.run2.push(lastCrash >= 2);
  pandingrun2--;
}

  }
  if(lastCrash>2 || last30[0].greaterOrEqual2 <14) return ""

const last25 = crashHistory.slice(-25);
 if (!hasStreakOf4(last25) && pandingrun2 === 0) {
  const last2 = last25.slice(-2);
  if (last2.length === 2 && last2[0] < 2 && last2[1] < 2) {
    // message = "🔮run2";
    pandingrun2 = 2;   // we will check next 2 rounds
    return message;
  }
}



  const ckeckrun=lastCrash>1.5
    // only accept streaks greater than 1
    if (!isPendingRun&&ckeckrun) {;
      pending="runB"
      isPendingRun=true
      message = `🔮run✅B`;
      const runfalse =thestoreds["runB"].filter(v => !v).length
      const runtrue=thestoreds["runB"].filter(v => v).length
      const check=(runtrue-runfalse)>1 && crashHistory.length>30 && (runtrue-runfalse)<6
      return message
    }else if(!ckeckrun){
      pending="runS"
      isPendingRun=true
       message = `🔮run✅S`;
      const runfalse =thestoreds["runS"].filter(v => !v).length
      const runtrue=thestoreds["runS"].filter(v => v).length
      const check=(runtrue-runfalse)>1 && crashHistory.length>30 && (runtrue-runfalse)<6
      return  message 
    }

  return "";
}


// check for >3 consecutive >=2 in the last 25
function hasStreakOf4(crashes: number[]): boolean {
  let count = 0;
  for (const crash of crashes) {
    if (crash >= 2) {
      count++;
      if (count >= 4) return true;
    } else {
      count = 0;
    }
  }
  return false;
}


export { theOne, thestoreds};
