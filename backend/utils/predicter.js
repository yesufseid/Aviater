// STEP 1: Convert odds to 'x' (crash < 2) or 'y' (crash ≥ 2)
const toXY = (arr) => arr.map(v => v < 2 ? 'x' : 'y').join('');

// STEP 2: Define known patterns
const patterns = ['xxxyyy', 'xxyy', 'xxxxyyyy', 'xxxyxxx', 'xyxy', 'xxyxxy'];
const reversedPatterns = patterns.map(p => p.split('').reverse().join(''));
const allPatterns = [...patterns, ...reversedPatterns];

// STEP 3: Pattern matcher
function matchPattern(historyStr, pattern) {
  let count = 0;
  for (let i = 0; i <= historyStr.length - pattern.length; i++) {
    if (historyStr.slice(i, i + pattern.length) === pattern) count++;
  }
  return count;
}

function findBestPattern(historyStr, patterns, threshold = 0.1) {
  let best = null;
  for (const pattern of patterns) {
    const matches = matchPattern(historyStr, pattern);
    const windows = historyStr.length - pattern.length + 1;
    const ratio = matches / windows;
    if (ratio >= threshold && (!best || ratio > best.ratio)) {
      best = { pattern, ratio };
    }
  }
  return best;
}

// STEP 4: Predict based on pattern match
function predictNext(xyStr, pattern) {
  const windowSize = pattern.length - 1;
  const recent = xyStr.slice(-windowSize);

  // Example: recent = 'xxx', look for pattern starting with 'xxx'
  if (pattern.startsWith(recent)) {
    return pattern[windowSize]; // return next expected character
  }

  return null;
}

// STEP 5: Main predictor
function runPredictor(crashOdds) {
  const xy = toXY(crashOdds);
  const patternFound = findBestPattern(xy, allPatterns);

  if (!patternFound) {
    console.log("❌ No strong pattern found.");
    return;
  }

  const prediction = predictNext(xy, patternFound.pattern);
  const actual = xy[xy.length - 1];

  console.log("📈 XY History:", xy);
  console.log("🧩 Best Pattern:", patternFound.pattern, `(${(patternFound.ratio * 100).toFixed(1)}%)`);
  console.log("🔍 Recent:", xy.slice(-patternFound.pattern.length + 1), "→ Predict Next:", prediction);
  console.log("🎯 Last Actual Value:", actual);
}

module.exports = runPredictor;
