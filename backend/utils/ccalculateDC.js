function calculateDC(crashHistory) {
  // Helper to calculate DC for a given array of crash points
  const computeDC = (historySlice) => {
    let lessThan2 = 0;
    let greaterOrEqual2 = 0;

    for (const point of historySlice) {
      if (point < 2) lessThan2++;
      else greaterOrEqual2++;
    }

    const dc = greaterOrEqual2 - lessThan2;
    return { lessThan2, greaterOrEqual2, dc };
  };

  // Simulate adding N new crash points (drop oldest for each new one)
  const simulateNextN = (historySlice, nextValues) => {
    let newSlice = [...historySlice];
    for (const val of nextValues) {
      newSlice = [...newSlice.slice(1), val];
    }
    return computeDC(newSlice);
  };

  // Function to build stats for a given slice size
  const buildStats = (size) => {
    const slice = crashHistory.slice(-size);
    return {
      current: computeDC(slice),
      nextLessThan2: simulateNextN(slice, [1.99]),
      nextGreaterOrEqual2: simulateNextN(slice, [2])
    };
  };

  // --- Prediction Logic ---
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

  const last10 = buildStats(10).current;
  const last30 = buildStats(25).current; // you called it last30 but used 25
  const prediction = makePrediction(last10, last30);

  return {
    last10: buildStats(10),
    last30: buildStats(25),
    nextValue:prediction
  };
}

module.exports = calculateDC;
