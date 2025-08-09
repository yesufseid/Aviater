const getStats =require("./getstat")

function movingAveragePrediction(history) {
  const avg = getStats(history).average10;
  return (parseFloat(avg) + Math.random()).toFixed(2);
}


module.exports=movingAveragePrediction