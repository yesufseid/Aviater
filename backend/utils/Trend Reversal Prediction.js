const getStats =require("./getstat")

function regressionToMean(history) {
  const avg = getStats(history).average50;
  const last = history[history.length - 1];
  return last < avg
    ? (parseFloat(avg) + Math.random()).toFixed(2)
    : (parseFloat(avg) - Math.random()).toFixed(2);
}

module.exports= regressionToMean;