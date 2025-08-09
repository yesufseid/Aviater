const tf = require('@tensorflow/tfjs');

// Known patterns and reverses
const patterns = ['xxxyyy', 'xxyy', 'xxxxyyyy', 'xxxyxxx', 'xyxy', 'xxyxxy'];
const reversedPatterns = patterns.map(p => p.split('').reverse().join(''));
const allPatterns = [...patterns, ...reversedPatterns];

// Convert odds to x/y
const toXY = (arr) => arr.map(v => v < 2 ? 'x' : 'y').join('');

// Encode window: 'xyyxx' → [0,1,1,0,0]
function encodeWindow(str) {
  return str.split('').map(ch => ch === 'x' ? 0 : 1);
}

// One-hot encode label
function oneHot(index, numClasses) {
  return Array.from({ length: numClasses }, (_, i) => i === index ? 1 : 0);
}

// Create training dataset
function createDataset(historyStr, windowSize) {
  const X = [], Y = [];
  const labels = [...allPatterns, 'none'];
  for (let i = 0; i <= historyStr.length - windowSize; i++) {
    const window = historyStr.slice(i, i + windowSize);
    let labelIndex = labels.indexOf('none');

    for (let j = 0; j < allPatterns.length; j++) {
      if (window === allPatterns[j]) {
        labelIndex = j;
        break;
      }
    }

    X.push(encodeWindow(window));
    Y.push(oneHot(labelIndex, labels.length));
  }
  return { X, Y, labels };
}

// Build & train classifier
async function trainClassifier(trainX, trainY, inputSize, numClasses) {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [inputSize], units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  const xs = tf.tensor2d(trainX);
  const ys = tf.tensor2d(trainY);

  await model.fit(xs, ys, {
    epochs: 50,
    verbose: 0
  });

  return model;
}

// Main predictor
async function runPredictor(crashOdds) {
  if (crashOdds.length < 8) {
    return {
      pattern: "not enough data",
      confidence: "0%",
      prediction: "unknown",
      predictionMeaning: "unknown"
    };
  }

  const windowSize = 6; // choose based on average pattern length
  const xyStr = toXY(crashOdds);
  const { X, Y, labels } = createDataset(xyStr, windowSize);

  if (X.length === 0) {
    return {
      pattern: "not enough matching windows",
      confidence: "0%",
      prediction: "unknown",
      predictionMeaning: "unknown"
    };
  }

  const model = await trainClassifier(X, Y, windowSize, labels.length);

  // Predict last window
  const lastWindow = xyStr.slice(-windowSize);
  const encoded = encodeWindow(lastWindow);
  const input = tf.tensor2d([encoded]);

  const prediction = await model.predict(input).data();
  const bestIdx = prediction.indexOf(Math.max(...prediction));
  const predictedPattern = labels[bestIdx];
  const confidence = (prediction[bestIdx] * 100).toFixed(1) + '%';

  // Predict next char based on pattern
  let next = 'unknown';
  let meaning = 'unknown';

  if (predictedPattern !== 'none') {
    const offset = lastWindow.length;
    if (predictedPattern.length > offset) {
      next = predictedPattern[offset];
      meaning = next === 'x' ? 'Crash likely <2.0' : 'Crash likely ≥2.0';
    }
  }

  return {
    pattern: predictedPattern,
    confidence,
    prediction: next,
    predictionMeaning: meaning
  };
}

module.exports = runPredictor;
