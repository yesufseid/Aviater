// const WebSocket = require("ws");
// const zlib = require("zlib");
// const runPredictor = require("./predicter");
// const { crashHistory, broadcastToClients } = require("./socket-server");

// let reconnectDelay = 1000; // Start with 1 second
// function connect() {
// const ws = new WebSocket(process.env.APIKEY);

// ws.on("open", () => {
//   console.log("✅ Connected to Aviator");
//    reconnectDelay = 1000;
// });

// ws.on("message", (data) => {
//   if (Buffer.isBuffer(data)) {
//     zlib.inflate(data, (err, result) => {
//       if (!err) {
//         const message = JSON.parse(result.toString());

//         if (Array.isArray(message) && message[0] === "GAME_STATE_UPDATE") {
//           const gameData = message[1];

//           if (gameData.is_crashed === 1 && typeof gameData.crash_value !== "undefined") {
//             crashHistory.push(gameData.crash_value);
//             if (crashHistory.length > 100) crashHistory.shift();

//             const prediction = runPredictor(crashHistory);

//             const payload = {
//               crashHistory: [...crashHistory],
//               prediction,
//               timestamp: Date.now(),
//             };
  
//             console.log("📊 Sent to clients:", payload);
//             broadcastToClients(payload);
//           }
//         }
//       } else {
//         console.error("❌ Decompression error:", err);
//       }
//     });
//   }
// });

//   ws.on('close', () => {
//     console.log('Disconnected. Reconnecting...');
//     setTimeout(connect, reconnectDelay);
//     reconnectDelay = Math.min(reconnectDelay * 2, 30000); // Cap at 30 seconds
//   });
//   ws.on('error', (err) => {
//     console.error('WebSocket error:', err.message);
//   });
// }
// connect();