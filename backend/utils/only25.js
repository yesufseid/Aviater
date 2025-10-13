



let pending = false; // ✅ just track if a prediction is active

const storedscore25= {
  "25>": [],
};
let protecter=0
function processData25(
  last30,
  crashHistory,
) { 
  // 1) Resolve pending prediction
  if (pending && crashHistory.length > 0) {
    const lastVal = crashHistory[crashHistory.length - 1];
    storedscore25["25>"].push(lastVal >= 2);
    pending = false; // clear it after resolving
  }


  if(last30[0].greaterOrEqual2 < 10){
     resetSignals()
  }
  // 2) Block NEW predictions if history not ready
  if (crashHistory.length < 25 || last30[0].greaterOrEqual2 < 12) {
    return "";
  }

  // 3) Compute current signal
  const s25=
    last30.length >= 3 &&
    JSON.stringify(last30[0]) === JSON.stringify(last30[2])
      ? "25>"
      : "";

  // 4) Queue only if no active pending
  if (!pending && s25 !== "") {
    pending = true;
  }

  // 5) Stats
  const results = storedscore25["25>"];
  const runfalse = results.filter(v => !v).length;
  const runtrue = results.filter(v => v).length;
  const diff =(runtrue - runfalse)

  const check = (diff > 1) && crashHistory.length > 30 && (diff < 6);
 
//   if (diff > 5) {
//   localStorage.setItem("signalTimestamp", Date.now().toString());
// }
  return  check?s25:""
}

function resetSignals() {
  pending = false;
  storedscore25["25>"] = [];
}

module.exports= { processData25, storedscore25};
