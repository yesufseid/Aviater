function predictByEdge(crashOdds) {
  const lastN = 10; // recent rounds to look at
  const recent = crashOdds.slice(-lastN);

  let forcedLows = 0;
  let lastBigHighIndex = -1;

  recent.forEach((v, idx) => {
    if (v < 2) forcedLows++;
    if (v >= 2) lastBigHighIndex = idx;
  });

  const roundsSinceLastBig = lastBigHighIndex === -1 ? lastN : (recent.length - lastBigHighIndex);

  // Simple rule:
  // - many forced lows (>=6 in last 20) AND no big high in last 8 rounds → predict y
  // - else predict x
  let prediction = 'x';
  let reason = '';

  if (forcedLows >= 5 && roundsSinceLastBig >= 2) {
    prediction = 'y';
    reason = `Many forced lows (${forcedLows}) and no crash≥2 in last ${roundsSinceLastBig} rounds`;
  } else {
    prediction = 'x';
    reason = `Recent big crash or not enough forced lows (${forcedLows})`;
  }

  return {
    pattern: reason,
    prediction: prediction,
    predictionMeaning: prediction === 'x' ? 'Crash likely <2.0' : 'Crash likely ≥2.0'
  };
}

module.exports = predictByEdge;