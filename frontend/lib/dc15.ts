"use client";


type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};

const stored: { run: boolean[] } = {
  run: [],
};

let isRunning = false;


function dc15(last30: WindowSummary[], crashHistory: number[]) {
  if (crashHistory.length < 30) return "";

  const lastCrash = crashHistory[crashHistory.length - 1];
  const currentDc = last30[0].greaterOrEqual2;
  isRunning && stored.run.push(isRunning && lastCrash >= 2);
currentDc>=15?isRunning=true:isRunning=false
  


  return   isRunning?"✅dc15run":""
}

export { dc15, stored };
