// socket-server.js
const WebSocket = require("ws");


const clients = new Set()

function initializeWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("🟢 Client connected");

    ws.on("close", () => {
      clients.delete(ws);
      console.log("🔴 Client disconnected");
    });
  });
}

let crashHistory = [
  1.73, 1, 1.01, 7.04, 1.79, 1.02, 3.11, 10.22,
  1.7, 9.24, 1.3, 1, 3.13, 1.2, 1.29, 2.77,
  2.3, 11.18, 1.25, 2.19, 1.29, 2.49,
  1.04, 1.02, 1.28, 24.45, 1.01, 1.32, 1.06,
  2.66, 1.33, 1.76
];


// Function to broadcast prediction data to all clients
function broadcastToClients(data) {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }
}

module.exports = { crashHistory, broadcastToClients,initializeWebSocket };
