let storedValue = "" 
let storedscore = {
    "10>":[],
    "25>":[],
    "10>25>":[]
};

function processData(last10 ,last30) {

    let last10Signal = JSON.stringify(last10[0]) === JSON.stringify(last10[2]) ? '10>' : '';
    let last30Signal = JSON.stringify(last30[0]) === JSON.stringify(last30[2]) ? '25>' : '';

    const signal = last10Signal + last30Signal;

   return signal
}

export default processData