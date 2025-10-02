const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const chromium = require('@sparticuz/chromium');
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-extra");

puppeteer.use(StealthPlugin());

const Scraper = async () => {
  let browser;
  try {
    // Launch Chromium with Render-compatible args
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--disable-gpu'
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath:await chromium.executablePath(),
      headless: false, // true in production
    });

    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    );

    // Retry logic for page navigation
    let navigationSuccess = false;
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to load Hulusport...`);
        await page.goto("https://arada.bet/en/casino?game=%2Faviator", {
          waitUntil: "networkidle2", // more reliable
          timeout: 120000 // 2 minutes
        });
        navigationSuccess = true;
        break;
      } catch (e) {
        console.log(`❌ Navigation attempt ${attempt} failed:`, e.message);
        const screenshotPath = `/tmp/nav-error-attempt-${attempt}.png`;
        await page.screenshot({ path: screenshotPath });
        console.log(`📸 Screenshot saved to ${screenshotPath}`);
        if (attempt === maxRetries) throw new Error("❌ Failed to load Hulusport after retries");
        await page.waitForTimeout(10000);
      }
    }

    if (!navigationSuccess) return;

    // Wait for login form
    await page.waitForSelector("input[placeholder='Phone number, username or ID']", { timeout: 60000 });
    await page.type("input[placeholder='Phone number, username or ID']", process.env.ARADABET_PHONE);
    await page.type("input[placeholder='Enter your password']", process.env.ARADABET_PASSWORD);

    // Handle potential popup
    try {
      const popupClose = await page.$("i.pi.pi-times.close__button");
      if (popupClose) {
        console.log("⚠️ Popup detected, closing...");
        await popupClose.click();
        await page.waitForTimeout(1000);
      }
    } catch (err) {
      console.log("ℹ️ No popup found, continuing...");
    }

    // Click login button
    const loginBtn = await page.$("input[type='submit'][value='Login']");
    if (!loginBtn) throw new Error("❌ Login button not found");

    await loginBtn.evaluate(el => el.scrollIntoView({ behavior: "smooth", block: "center" }));
    await page.waitForTimeout(500);
    await loginBtn.click();

    // Wait for either dashboard or login error
    try {
      await Promise.race([
        page.waitForNavigation({ timeout: 60000 }),
        page.waitForSelector(".dashboard, .login-error", { timeout: 60000 })
      ]);
      console.log("✅ Login step completed");
    } catch (err) {
      const screenshotPath = `/tmp/login-error.png`;
      await page.screenshot({ path: screenshotPath });
      console.error(`⚠️ Login verification timed out: ${err.message}`);
      console.log(`📸 Screenshot saved to ${screenshotPath}`);
      throw err;
    }

    // Extra wait to ensure page fully loads
    await page.waitForTimeout(15000);

    // Wait for iframe and extract token
    await page.waitForSelector("iframe.iframe-block", { timeout: 60000 });
    const iframeSrc = await page.$eval("iframe.iframe-block", el => el.getAttribute("src"));
    if (!iframeSrc) throw new Error("❌ iframe src not found");

    const url = new URL(iframeSrc);
    const token = url.searchParams.get("token");
    console.log("✅ Token:", token);

    return token;

  } catch (error) {
    const screenshotPath = `/tmp/error.png`;
    if (browser) {
      try {
        const pages = await browser.pages();
        if (pages.length > 0) await pages[0].screenshot({ path: screenshotPath });
      } catch (screenshotErr) {
        console.error("⚠️ Failed to capture error screenshot:", screenshotErr.message);
      }
    }
    console.error('❌ Scraper error:', error.message);
    console.log(`📸 Screenshot saved to ${screenshotPath}`);
    return null;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = Scraper;