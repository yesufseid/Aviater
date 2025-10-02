const WebSocket = require("ws");
const connect = require("./listener");
const Scraper = require("./AviaterScraper");
let lastConnectedUrl = null;
let queuedUrls = []; // store multiple { url, addedAt }
let activeConnection = null;
let crashHistory = [];
let sessionTimer = null;
let sessionEndTime = null;
// const url="wss://aviator.amazingames.pw/websocket?token=f6e67edd-4b30-4311-aed5-08886e3e42a0&mode=play"
const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes
const URL_TTL = 10 * 60 * 1000; // 10 minutes
const clients = new Set();

// function startSession(url) {
//   lastConnectedUrl = url;
//   sessionEndTime = Date.now() + SESSION_DURATION;

//   if (typeof activeConnection?.close === "function") {
//     activeConnection.close();
//     console.log("🔌 Previous listener closed");
//   }

//   activeConnection = connect(url, crashHistory, onAviatorDisconnect, broadcastToClients);
//   console.log(`✅ Started new session for ${url}`);
//   broadcastQueueUpdate(); // 🔔 send updated queue after switch
//   clearTimeout(sessionTimer);
//   sessionTimer = setTimeout(() => {
//     console.log("⏳ Session expired");
//     const next = getNextValidUrl();
//     if (next) {
//       console.log("🔄 Switching to queued URL:", next.url);
//       startSession(next.url);
//     } else {
//       console.log("⚠️ No queued URL. Waiting for new one...");
//       lastConnectedUrl = null;
//     }
//   }, SESSION_DURATION);
// }

async function onAviatorDisconnect() {
  console.log("❌ Aviator connection closed, fetching new token...");

  try {
    const token ="6df67bbb-1654-4cc3-bffd-c6396f0f38b3"
    const url = `wss://aviator.amazingames.pw/websocket?token=${token}&mode=play`;

    console.log("🔄 Reconnecting with new token:", url);

    // close old connection if still hanging
    if (typeof activeConnection?.close === "function") {
      activeConnection.close();
    }

    activeConnection = connect(url, crashHistory, onAviatorDisconnect, broadcastToClients);
  } catch (err) {
    console.error("⚠️ Failed to get new token during reconnect:", err);
    // retry after a short delay
    setTimeout(onAviatorDisconnect, 5000);
  }

  // --- keep your old code commented ---
  // console.log("❌ Aviator connection closed before session ended.");
  // const next = getNextValidUrl();
  // if (next) {
  //   console.log("🔄 Using queued URL immediately:", next.url);
  //   startSession(next.url);
  // } else if (Date.now() < sessionEndTime) {
  //   console.log("♻️ Reconnecting to same session URL...");
  //   startSession(lastConnectedUrl);
  // } else {
  //   console.log("⚠️ Session time ended, waiting for new URL...");
  //   lastConnectedUrl = null;
  // }
}


/**
 * Get the next valid queued URL (not older than 10 min)
 */
// function getNextValidUrl() {
//   const now = Date.now();
//   // Remove expired ones
//   queuedUrls = queuedUrls.filter(item => now - item.addedAt < URL_TTL);
//   return queuedUrls.shift() || null; // take first valid
// }

async function initializeWebSocket(server) {
  try {
    const token = await Scraper(); // ✅ await the scraper
    const url = `wss://aviator.amazingames.pw/websocket?token=${token}&mode=play`;
    console.log("server " + url);

    connect(url, crashHistory, onAviatorDisconnect, broadcastToClients);

    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
      clients.add(ws);
      console.log("🟢 Client connected");

      //   ws.on("message", (data) => {
      //     try {
      //       const msg = JSON.parse(data);
      //       if (msg.type === "NEW_WSS_URL") {
      //         console.log("🌐 Received new WSS URL from extension:", msg.url);

      //         if (!lastConnectedUrl) {
      //           startSession(msg.url);
      //         } else if (msg.url !== lastConnectedUrl) {
      //        const alreadyQueued = queuedUrls.some(item => item.url === msg.url);
      //         if (!alreadyQueued) {
      //           console.log("📌 URL received during active session, queued:", msg.url);
      //              queuedUrls.push({ url: msg.url, addedAt: Date.now() });
      //            broadcastQueueUpdate(); // 🔔 notify clients about new queue
      // }
      // } else {
      //           console.log("⚠️ Same URL as active session, ignoring");
      //         }
      //       }
      //     } catch (err) {
      //       console.error("❌ Failed to parse message:", err);
      //     }
      //   });

      ws.on("close", () => {
        clients.delete(ws);
        console.log("🔴 Client disconnected");
      });
    });
  } catch (err) {
    console.error("❌ Failed to initialize WebSocket:", err);
  }
}

function broadcastToClients(data) {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }
}
function broadcastQueueUpdate() {
  broadcastToClients({
    type: "QUEUE_UPDATE",
    queuedUrls,
  });
}

module.exports = {
  broadcastToClients,
  initializeWebSocket,
};
