function calculateDC(crashHistory) {
  // Helper to calculate DC for a given array of crash points
  const computeDC = (historySlice) => {
    let lessThan2 = 0;
    let greaterOrEqual2 = 0;

    for (const point of historySlice) {
      if (point < 2) lessThan2++;
      else greaterOrEqual2++;
    }

    const dc = greaterOrEqual2 > 0 ? greaterOrEqual2 - lessThan2 : 'Infinity';
    return {
      lessThan2,
      greaterOrEqual2,
      dc: parseFloat(dc)
    };
  };
///////////////////
const makePrediction = (last10, last30) => {
    const thresholds = { high: 3, medium: 2 }; // tweakable
    let prediction = "uncertain";
    let confidence = "low";

    if (last10.dc <= -thresholds.high && last30.dc <= -thresholds.medium) {
      prediction = "≥ 2";
      confidence = "high";
    } else if (last10.dc >= thresholds.high && last30.dc >= thresholds.medium) {
      prediction = "< 2";
      confidence = "high";
    } else if (last10.dc <= -thresholds.medium && last30.dc <= -thresholds.medium) {
      prediction = "≥ 2";
      confidence = "medium";
    } else if (last10.dc >= thresholds.medium && last30.dc >= thresholds.medium) {
      prediction = "< 2";
      confidence = "medium";
    }

    return { prediction, confidence };
  };

  // Simulate adding a new crash point and dropping the oldest in the slice
  const simulateNext = (historySlice, nextValue) => {
    const newSlice = [...historySlice.slice(1), nextValue];
    return computeDC(newSlice);
  };
   const simulateNextTwo = (historySlice, nextValue) => {
    const newSlice = [...historySlice.slice(2), ...nextValue];
    return computeDC(newSlice);
  };
  const simulateNextThree = (historySlice, nextValue) => {
    const newSlice = [...historySlice.slice(3), ...nextValue];
    return computeDC(newSlice);
  }

  // Function to build stats for a given slice size
  const buildStats = (size) => {
    const slice = crashHistory.slice(-size);
    return [
      computeDC(slice),
      simulateNext(slice, 1.99), // simulate < 2
      simulateNext(slice, 2), // simulate ≥ 2
      simulateNextTwo(slice, [1.99,1.22]), // simulate < 2
      simulateNextTwo(slice, [2.5,3]) ,// simulate ≥ 2
     simulateNextThree(slice, [1.99,1.22,1.44]), // simulate < 2
     simulateNextThree(slice, [2.5,3,4]) // simulate ≥ 2
    ]
  };
const l10= buildStats(10)[0]
const l25= buildStats(25)[0]
  return {
    last10: buildStats(10),
    last30: buildStats(25),
    nextValue:makePrediction(l10,l25)
  };
}

module.exports = calculateDC;
