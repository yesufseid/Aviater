
type WindowSummary = {
  lessThan2: number;
  greaterOrEqual2: number;
  dc: number;
};
function newPredictor(last30: WindowSummary[]){
   if(last30[0].lessThan2>9&&last30[0].lessThan2<12){
    return "✅run"
   }
return ""
}


export default newPredictor