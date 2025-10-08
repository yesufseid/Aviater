const WebSocket = require("ws");
const zlib = require("zlib");
const calculateDC =require("./ccalculateDC")
const {firstOne,storeds}=require("./firstone")
const {processData25,storedscore25}=require("./only25")


function connect(url, crashHistory, onDisconnect,broadcastToClients) {
  const ws = new WebSocket(url);

  ws.on("open", () => {
    console.log("✅ Connected to Aviator");
  });

  ws.on("message", async (data) => {
    if (Buffer.isBuffer(data)) {
      zlib.inflate(data, (err, result) => {
        if (!err) {
          try {
            const message = JSON.parse(result.toString());
           
             if (Array.isArray(message) && message[0] === "ODD_UPDATE"){
                   const odd=message[1].odd
                    broadcastToClients({
                       type: "ODD_UPDATE",
                       odd,
                     });    
             }  
            if (Array.isArray(message) && message[0] === "GAME_STATE_UPDATE") {
              const gameData = message[1];
              if (gameData.is_crashed === 1 && typeof gameData.crash_value !== "undefined") {
                const crashValue = gameData.crash_value;
                crashHistory.push(crashValue);
                if (crashHistory.length > 100) crashHistory.shift();

                (async () => {
                  const prediction = await calculateDC(crashHistory);
                  const firstOneReturn=await firstOne(prediction.last30,crashHistory)
                  const only25Return=await processData25(prediction.last30,crashHistory)
                  const payload = {
                    crashHistory,
                    firstOneReturn,
                    only25Return,
                    storeds,
                    storedscore25,
                    prediction,
                  };
                  console.log("📊 Sent to clients:", JSON.stringify({
  crashHistory,
  firstOneReturn,
 only25Return,
storeds,
storedscore25,
}, null, 2));

                  broadcastToClients(payload);
                })();
              }
            }
          } catch (e) {
            console.error("❌ JSON parse failed:", e);
          }
        } else {
          console.error("❌ Decompression error:", err);
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("⚠️ Disconnected from Aviator");
    if (typeof onDisconnect === "function") {
      onDisconnect();
    }
  
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
    
  });

  return ws;
}


module.exports = connect;
