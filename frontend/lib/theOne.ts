"use client"
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const thestoreds: { runB: boolean[],runS:boolean[]} = {
  runB: [],
  runS:[]
};


let isPendingRun = false;
let message = "";
let pending:string=""



function theOne(last30: WindowSummary[], crashHistory: number[]) {
  if (crashHistory.length < 10) return "";
  const lastCrash = crashHistory[crashHistory.length - 1];
  // Case 1: resolve pending predictions
  if (isPendingRun) {
    if (pending==="runB") {
      lastCrash>=2?thestoreds.runB.push(true):thestoreds.runB.push(false);
    } else if(pending==="runS") {
       lastCrash>=2?thestoreds.runS.push(true):thestoreds.runS.push(false);
    }
  }
  const ckeckrun=lastCrash>1.5
    // only accept streaks greater than 1
    if (!isPendingRun&&ckeckrun) {;
      message = `🔮run✅B`;
      const runfalse =thestoreds["runB"].filter(v => !v).length
      const runtrue=thestoreds["runB"].filter(v => v).length
      const check=(runtrue-runfalse)>1 && crashHistory.length>34 && (runtrue-runfalse)<6
      return check?message:""
    }else if(!ckeckrun){
       message = `🔮run✅S`;
      const runfalse =thestoreds["runS"].filter(v => !v).length
      const runtrue=thestoreds["runS"].filter(v => v).length
      const check=(runtrue-runfalse)>1 && crashHistory.length>34 && (runtrue-runfalse)<6
      return check?message:""   
    }

  return "";
}




export { theOne, thestoreds};
