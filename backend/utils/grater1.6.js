"use client";

let pending1 = false; // track if a 1.6 prediction is active
let pending2 = false; // track if a 1.1 prediction is active
let message = "";

const storedscoreGrater = {
  "1.6>": [],
  "1.1<": []
};

function processGrater(last30, crashHistory) { 
  if (!Array.isArray(crashHistory) || crashHistory.length === 0) return "";

  const lastVal = crashHistory[crashHistory.length - 1];

  // 1) Resolve pending predictions
  if (pending1) {
    storedscoreGrater["1.6>"].push(lastVal >= 2);
    pending1 = false;
  } else if (pending2) {
    storedscoreGrater["1.1<"].push(lastVal >= 2);
    pending2 = false;
  }

  // 2) Reset signals if performance low
  if (last30[0]?.greaterOrEqual2 < 8) {
    resetSignals();
  }

  // 3) Block NEW predictions if history not ready
  if (crashHistory.length < 25 || last30[0]?.greaterOrEqual2 < 10) {
    return "";
  }

  // 4) Make predictions (fixed: use pending1/pending2 instead of undefined `pending`)
  if (lastVal > 1.6 && !pending1 && !pending2) {
    message = "run1.6";
    pending1 = true;
  } else if (lastVal < 1.1 && !pending1 && !pending2) {
    message = "run1.1";
    pending2 = true;
  } else {
    message = "";
  }

  // 5) Stats and conditions
  const results1 = storedscoreGrater["1.6>"];
  const diff1 = results1.filter(v => v).length - results1.filter(v => !v).length;
  const check1 = diff1 > 1 && diff1 < 6 && crashHistory.length > 30;

  const results2 = storedscoreGrater["1.1<"];
  const diff2 = results2.filter(v => v).length - results2.filter(v => !v).length;
  const check2 = diff2 > 1 && diff2 < 6 && crashHistory.length > 30;

  if (message === "run1.6" && check1) return message;
  if (message === "run1.1" && check2) return message;
  
  return "";
}

function resetSignals() {
  pending1 = false;
  pending2 = false;
  storedscoreGrater["1.6>"] = [];
  storedscoreGrater["1.1<"] = [];
}

module.exports = { processGrater, storedscoreGrater };
