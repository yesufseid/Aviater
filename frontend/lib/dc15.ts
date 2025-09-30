"use client";


type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const stored: { run: boolean[] } = {
  run: [],
};
let protecter=0
let isRunning = false;
let dc16=false

function dc15(last30: WindowSummary[], crashHistory: number[]) {
  if (crashHistory.length < 25) return "";

  const lastCrash = crashHistory[crashHistory.length - 1];
  const currentDc = last30[0].greaterOrEqual2;
  isRunning && stored.run.push(isRunning && lastCrash >= 2);
const last25 = crashHistory.slice(-25);
 let consecutive = 0;
    for (const crash of last25) {
      if (crash >= 2) {
        consecutive++;
      } else {
        break;
      }
    }
if(consecutive>4) return ""


  currentDc >= 16? dc16 = true:""
currentDc>=15 && dc16 ?isRunning=true:isRunning=false
  !isRunning?dc16=false:""
  const runfalse =stored["run"].filter(v => !v).length
  const runtrue=stored["run"].filter(v => v).length
  const check=(runtrue-runfalse)-protecter>1 && crashHistory.length>30 && (runtrue-runfalse)<6
  if(check&&(runtrue-runfalse)>2){
    protecter=1
  }else{
    protecter=0
  }
  return isRunning&&"✅dc15run"
}

export { dc15, stored };
