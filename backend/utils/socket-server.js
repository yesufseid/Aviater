const WebSocket = require("ws");
const connect = require("./listener");

let lastConnectedUrl = null;
let queuedUrl = null;
let activeConnection = null;
let crashHistory = [];
let sessionTimer = null;
let sessionEndTime = null;
const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes
const clients = new Set();

function startSession(url) {
  lastConnectedUrl = url;
  sessionEndTime = Date.now() + SESSION_DURATION;

  if (typeof activeConnection?.close === "function") {
    activeConnection.close();
    console.log("🔌 Previous listener closed");
  }

  activeConnection = connect(url, crashHistory, onAviatorDisconnect,broadcastToClients);
  console.log(`✅ Started new session for ${url}`);

  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    console.log("⏳ Session expired");
    if (queuedUrl) {
      console.log("🔄 Switching to queued URL:", queuedUrl);
      const next = queuedUrl;
      queuedUrl = null;
      startSession(next);
    } else {
      console.log("⚠️ No queued URL. Waiting for new one...");
      lastConnectedUrl = null;
    }
  }, SESSION_DURATION);
}

function onAviatorDisconnect() {
  console.log("❌ Aviator connection closed before session ended.");
  if (queuedUrl) {
    console.log("🔄 Using queued URL immediately:", queuedUrl);
    const next = queuedUrl;
    queuedUrl = null;
    startSession(next);
  } else if (Date.now() < sessionEndTime) {
    console.log("♻️ Reconnecting to same session URL...");
    startSession(lastConnectedUrl);
  } else {
    console.log("⚠️ Session time ended, waiting for new URL...");
    lastConnectedUrl = null;
  }
}

function initializeWebSocket(server) {
 const wss = new WebSocket.Server({ server});


  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("🟢 Client connected");

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data);
        if (msg.type === "NEW_WSS_URL") {
          console.log("🌐 Received new WSS URL from extension:", msg.url);

          if (!lastConnectedUrl) {
            startSession(msg.url);
          } else if (msg.url !== lastConnectedUrl) {
            console.log("📌 URL received during active session, queued:", msg.url);
            queuedUrl = msg.url;
          } else {
            console.log("⚠️ Same URL as active session, ignoring");
          }
        }
      } catch (err) {
        console.error("❌ Failed to parse message:", err);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log("🔴 Client disconnected");
    });
  });
}

function broadcastToClients(data) {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }
}

module.exports = {
  broadcastToClients,
  initializeWebSocket,
};
