const WebSocket = require("ws");
const runPredictor=require("./predicter")
const ws = new WebSocket("wss://aviator.amazingames.pw/websocket?token=b53a62dc-dbd4-4d02-84fc-9ed58f15d104&mode=play");

ws.on("open", () => {
  console.log("✅ Connected");

  // Optionally send something
  // ws.send(...);
});
let crashHistory = [
  1.73, 1, 1.01, 7.04, 1.79, 1.02, 3.11, 10.22,
  1.7, 9.24, 1.3, 1, 3.13, 1.2, 1.29, 2.77,
  2.3, 11.18, 1.25, 2.19, 1.29, 2.49,
  1.04, 1.02, 1.28, 24.45, 1.01, 1.32, 1.06,
  2.66, 1.33, 1.76
];

const listener= ws.on("message", (data) => {
    
  if (Buffer.isBuffer(data)) {
    // Handle binary message (e.g. decompress zlib)
    const zlib = require("zlib");
    zlib.inflate(data, (err, result) => {
      if (!err) {
          const message = JSON.parse(result.toString());
             if (Array.isArray(message) && message[0] === "GAME_STATE_UPDATE") {
    const data = message[1];
    if (data.is_crashed === 1 && typeof data.crash_value !== "undefined") {
       crashHistory=[...crashHistory,data.crash_value]
      console.log("💥 Crash Odds:", crashHistory);
       runPredictor(crashHistory)
    }
  }
// }
      } else {
        console.error("❌ Decompress error:", err);
      }
    });
  } else {
    console.log("📩 Text Message:", data.toString());
  }
});

ws.on("close", () => {
  console.log("❌ Disconnected");
});

ws.on("error", (err) => {
  console.error("❌ WebSocket error:", err);
});



module.exports=listener