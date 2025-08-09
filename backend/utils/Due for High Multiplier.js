function duePrediction(history) {
  const last5 = history.slice(-5);
  const lowCount = last5.filter(h => h < 2).length;
  return lowCount >= 3
    ? (2.5 + Math.random() * 3).toFixed(2) // predict high
    : (1.3 + Math.random() * 1.2).toFixed(2); // predict low
}
module.exports=duePrediction