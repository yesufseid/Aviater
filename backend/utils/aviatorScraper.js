

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const runPredictor = require("./predicter");
const { broadcastToClients, crashHistory } = require("./socket-server");

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  // Login to AradaBet
  await page.goto("https://arada.bet/en/auth/signin", {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  page.on("console", (msg) => {
    msg.args().forEach(async (arg) => {
      const val = await arg.jsonValue();
      // console.log("🧠 BROWSER LOG:", val);
    });
  });

  await page.waitForSelector("input[placeholder='Phone number, username or ID']", { timeout: 30000 });
  await page.type("input[placeholder='Phone number, username or ID']", process.env.ARADABET_PHONE);
  await page.type("input[placeholder='Enter your password']", process.env.ARADABET_PASSWORD);
  await page.waitForSelector(".auth__button", { timeout: 10000 });

  await Promise.all([
    page.click(".auth__button"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
  console.log("✅ Logged in successfully");

  await page.goto("https://arada.bet/en/casino?game=%2Faviator", {
    waitUntil: "networkidle2",
  });
  await new Promise(resolve => setTimeout(resolve, 8000)); // Give time for iframes to load


  let innerFrame = null;
  let lastCrash = null;
  let missedCycles = 0;

  async function getInnerFrame() {
    try {
      const outerFrame = page.frames().find(f => f.url().includes("gamew.amazingames.pw"));
      if (!outerFrame) throw new Error("❌ Outer iframe not found");

      const foundInner = outerFrame.childFrames().find(f => f.url().includes("aviator.amazingames.pw"));
      if (!foundInner) throw new Error("❌ Inner Aviator iframe not found");

      console.log("✅ Inner Aviator iframe found:", foundInner.url());
      return foundInner;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }

  async function startCrashPolling() {
    if (!innerFrame) innerFrame = await getInnerFrame();
    if (!innerFrame) {
      console.warn("🔁 Retrying frame extraction in 5s...");
      setTimeout(startCrashPolling, 5000);
      return;
    }

    setInterval(async () => {
      try {
        const value = await innerFrame.evaluate(() => {
          const payouts = Array.from(document.querySelectorAll(".payouts-block .payout.ng-star-inserted > div"));
          const text = payouts[0]?.textContent?.trim();
          return text && text.includes("x") ? text.replace("x", "").trim() : null;
        });

        if (value) {
          missedCycles = 0;
          const crash = parseFloat(value);
          if (!isNaN(crash) && crash !== lastCrash) {
            lastCrash = crash;
            crashHistory.push(crash);
            if (crashHistory.length > 100) crashHistory.shift();

            const prediction = runPredictor(crashHistory);
            broadcastToClients({
              crashHistory: [...crashHistory],
              prediction,
              timestamp: Date.now(),
            });

            console.log("📊 Crash Detected:", crash);
          }
        } else {
          missedCycles++;
          if (missedCycles >= 5) {
            console.warn("⚠️ Missed 5 reads — reloading innerFrame...");
            innerFrame = await getInnerFrame();
            missedCycles = 0;
          }
        }
      } catch (err) {
        console.error("⛔ Error reading crash data. Reconnecting in 5s...", err.message);
        innerFrame = null;
        setTimeout(startCrashPolling, 5000);
      }
    }, 3000);
  }

  startCrashPolling();
})();
