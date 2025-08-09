function getStats(history) {
  const last10 = history.slice(-10);
  const last50 = history.slice(-50);
  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

  return {
    average10: avg(last10).toFixed(2),
    average50: avg(last50).toFixed(2),
    percentUnder2x: (history.filter(h => h < 2).length / history.length * 100).toFixed(1),
    hotStreak: history.slice(-5).every(h => h > 2),
    coldStreak: history.slice(-5).every(h => h < 2),
  };
}

module.exports=getStats