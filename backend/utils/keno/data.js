const smartMoneySignal= require("./Biguser")
const crowdFomoIndicator=require("./crowdFomoIndicator")



function HistoryData(data) {
    const user=data.bets
    const total=data.numOfBets
     const d1=smartMoneySignal(user)
     const d2=crowdFomoIndicator(total)

     return {
        smart:d1,
        crowd:d2,
     }
}


module.exports=HistoryData