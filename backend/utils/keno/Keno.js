const WebSocket = require("ws");
const { analyzePlayerResults, getTopPlayers } = require("./analyzePlayerResults");



let reconnectDelay = 1000; // Start with 1 second
function connect() {
const ws = new WebSocket("wss://keno-nrg1.atlas-v.com/gamesocket/");

ws.on("open", () => {
  console.log("✅ Connected to Aviator");
   reconnectDelay = 1000;
});
const playerHistory = [];
let lastDrawnNumbers=[]
let ticket=[]
ws.on("message", async (data) => {
  try {
    const buffer = data;
    const jsonString = buffer.toString("utf-8");
    const datas = JSON.parse(jsonString);

    const gameId = datas.data?.game_id || "unknown_game"; // adjust as needed
     if (Array.isArray(datas.data?.tickets) && datas.data.tickets.length > 0) {
  ticket = datas.data.tickets;
}

    const drawnNumbers = datas.data?.numbers || [];

    // Log wait time if available
    if (datas.data?.time !== undefined) {
      console.log("Wait time:", datas.data.time);
    }
 if (datas.data?.numbers !== undefined) {
      lastDrawnNumbers=datas.data?.numbers
    }
    // Process and store player results if tickets exist
    if (datas.data?.numbers !== undefined && ticket.length > 0 ) {
      console.log("sya");
      
      const newResults = analyzePlayerResults(gameId, ticket, drawnNumbers);
      playerHistory.push(...newResults);
       const rsult= getTopPlayers(playerHistory)
       console.log(rsult) 
    }

    // If tickets exist, get least picked numbers and compare them
    if (ticket.length > 0 && datas.data?.time===30 && lastDrawnNumbers.length>0) {
      const result = analyzeKenoPicks(ticket, lastDrawnNumbers);
      console.log("Picked by players:", result.picked);
console.log("Not picked by any player:", result.notPicked);
console.log("Picked numbers that HIT:", result.pickedInDraw);
console.log("Picked numbers that MISSED:", result.pickedNotInDraw);

      // const won = compareKenoHitCount(picked, drawnNumbers);
      // console.log("Hits with least picked:", won);
    }
  } catch (err) {
    console.error("Error processing WebSocket message:", err);
  }
});


  ws.on('close', () => {
    console.log('Disconnected. Reconnecting...');
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 30000); // Cap at 30 seconds
  });
  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });
}

// function getLeastPickedNumbersFromTickets(tickets, topCount = 3) {
//   if (!Array.isArray(tickets)) {
//     console.error("Expected an array of tickets but got:", typeof tickets, tickets);
//     return [];
//   }

//   const frequency = {};

//   // Count number frequency from tickets
//   for (const ticket of tickets) {
//     for (const num of ticket.n) {
//       frequency[num] = (frequency[num] || 0) + 1;
//     }
//   }

//   // Ensure 1–80 are included
//   for (let i = 1; i <= 80; i++) {
//     if (!(i in frequency)) {
//       frequency[i] = 0;
//     }
//   }

//   // Sort and return least picked
//   return Object.entries(frequency)
//     .sort((a, b) => a[1] - b[1])
//     .slice(0, topCount)
//     .map(([num]) => Number(num));
// }
function analyzeKenoPicks(tickets, lastDrawnNumbers) {
  if (!Array.isArray(tickets) || !Array.isArray(lastDrawnNumbers)) {
    console.error("Invalid input. Expected arrays for tickets and lastDrawnNumbers.");
    return {
      picked: [],
      notPicked: [],
      pickedInDraw: [],
      pickedNotInDraw: []
    };
  }

  const pickedSet = new Set();

  // Collect all picked numbers from tickets
  for (const ticket of tickets) {
    for (const num of ticket.n) {
      pickedSet.add(num);
    }
  }

  const picked = Array.from(pickedSet).sort((a, b) => a - b);

  const notPicked = [];
  for (let i = 1; i <= 80; i++) {
    if (!pickedSet.has(i)) {
      notPicked.push(i);
    }
  }

  const drawnSet = new Set(lastDrawnNumbers);
  const pickedInDraw = picked.filter(num => drawnSet.has(num));
  const pickedNotInDraw = picked.filter(num => !drawnSet.has(num));

  return {
    picked,
    notPicked,
    pickedInDraw,
    pickedNotInDraw
  };
}


function compareKenoHitCount(picked, drawn) {
  const drawnSet = new Set(drawn);
  const matched = picked.filter(num => drawnSet.has(num));
  return {
    hits: matched.length,
    matched
  };
}
module.exports=connect
