const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

// Helper delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const Scraper = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--window-size=1920,1080"
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  try {
    // Retry navigation
    const maxRetries = 3;
    let navigationSuccess = false;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to load page...`);
        await page.goto("https://arada.bet/en/casino?game=%2Faviator", {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        });
        navigationSuccess = true;
        break;
      } catch (err) {
        console.log(`❌ Navigation attempt ${attempt} failed:`, err.message);
        await page.screenshot({ path: `nav-error-${attempt}.png` });
        if (attempt === maxRetries) throw new Error("Failed to load page after retries");
        await delay(10000);
      }
    }
    if (!navigationSuccess) return;

    // Fill login
    await page.waitForSelector("input[placeholder='Phone number, username or ID']", { timeout: 30000 });
    await page.type("input[placeholder='Phone number, username or ID']", process.env.ARADABET_PHONE);

    await page.type("input[placeholder='Enter your password']", process.env.ARADABET_PASSWORD);

    // Handle popup
    try {
      const popupClose = await page.$("i.pi.pi-times.close__button");
      if (popupClose) {
        console.log("⚠️ Popup detected, closing...");
        await popupClose.click();
        await delay(1000);
      }
    } catch {}

    const loginBtn = await page.$("input[type='submit'][value='Login']");
    if (!loginBtn) {
      await page.screenshot({ path: "no-login-btn.png" });
      throw new Error("Login button not found");
    }

    await loginBtn.evaluate(el => el.scrollIntoView({ behavior: "smooth", block: "center" }));
    await delay(500);
    await loginBtn.click();

    // Wait for dashboard or login error
    try {
      await page.waitForSelector(".dashboard, .login-error", { timeout: 60000 });
      console.log("✅ Login completed");
    } catch (err) {
      console.warn("⚠️ Login verification timed out:", err.message);
    }

    await delay(15000); // give page time to fully render

    // Poll for iframe reliably
    const iframeSelector = "iframe.iframe-block";
    let iframeElement = null;
    const maxIframeWait = 60000; // 60s
    const pollInterval = 2000;
    const startTime = Date.now();

    while (!iframeElement && Date.now() - startTime < maxIframeWait) {
      iframeElement = await page.$(iframeSelector);
      if (!iframeElement) await delay(pollInterval);
    }

    if (!iframeElement) {
      await page.screenshot({ path: "iframe-missing.png" });
      throw new Error("iframe.iframe-block not found after 60s");
    }

    // Get iframe src and token
    const iframeSrc = await page.$eval(iframeSelector, el => el.getAttribute("src"));
    const url = new URL(iframeSrc);
    const token = url.searchParams.get("token");
    console.log("✅ Token:", token);

    return token;

  } catch (err) {
    console.error("❌ Error:", err.message);
    await page.screenshot({ path: "error.png" });
  } finally {
    await browser.close();
  }
};

module.exports = Scraper;
