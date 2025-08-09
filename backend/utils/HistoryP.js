const regressionToMean= require("./Trend Reversal Prediction")
const movingAveragePrediction=require("./Moving Average Predictor")
const duePrediction=require("./Due for High Multiplier")
const getStats =require("./getstat")


function HistoryP(history) {
     const d1=regressionToMean(history)
     const d2=movingAveragePrediction(history)
     const d3=duePrediction(history)
     const d4=getStats(history)

     return {
        Trend:d1,
        Average:d2,
        due:d3,
        stats:d4
     }
}


module.exports=HistoryP