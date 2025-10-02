const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const chromium = require("chrome-aws-lambda");
const os = require("os");

puppeteer.use(StealthPlugin());

const Scraper=async () => {
 const executablePath = await chromium.executablePath || null;

  console.log("Chromium executablePath:", executablePath);

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: executablePath, // from chrome-aws-lambda
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  try {
    // Login with retry logic
  let navigationSuccess = false;
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to load Hulusport...`);
        await page.goto("https://arada.bet/en/casino?game=%2Faviator", {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        });
        navigationSuccess = true;
        break;
      } catch (e) {
        console.log(`❌ Navigation attempt ${attempt} failed:`, e.message);
        await page.screenshot({ path: `nav-error-attempt-${attempt}.png` });
        if (attempt === maxRetries) throw new Error("❌ Failed to load Hulusport after retries");
        await page.waitForTimeout(10000);
      }
    }

    if (!navigationSuccess) return;

 
    
   // Wait until username field appears
await page.waitForSelector("input[placeholder='Phone number, username or ID']", { timeout: 30000 });

// Fill username
await page.type("input[placeholder='Phone number, username or ID']", process.env.ARADABET_PHONE);

// Fill password
await page.type("input[placeholder='Enter your password']", process.env.ARADABET_PASSWORD);

// Wait for login button (input[type=submit][value=Login])
await page.waitForSelector("input[type='submit'][value='Login']", { timeout: 30000 });
// --- Handle popup close button if it appears ---
try {
  const popupClose = await page.$("i.pi.pi-times.close__button");
  if (popupClose) {
    console.log("⚠️ Popup detected, closing it...");
    await popupClose.click();
    await page.waitForTimeout(1000); // give UI time to update
  }
} catch (err) {
  console.log("ℹ️ No popup found, continuing...");
}
// --- Now click login button ---
const loginBtn = await page.$("input[type='submit'][value='Login']");
if (!loginBtn) {
  throw new Error("❌ Login button not found");
}

await loginBtn.evaluate(el => el.scrollIntoView({ behavior: "smooth", block: "center" }));
await page.waitForTimeout(500);

// Try multiple click strategies
await loginBtn.click(); // normal click
// OR fallback:
// await loginBtn.evaluate(el => el.click());

await page.screenshot({ path: "after-login-click.png" });
try {
  await Promise.race([
    page.waitForNavigation({ timeout: 10000 }),
    page.waitForSelector(".dashboard, .login-error", { timeout: 30000 })
  ]);

  console.log("✅ Login step completed — either navigation or selector found");
} catch (err) {
  console.error("⚠️ Login verification timed out:", err.message);
}

        await page.waitForTimeout(15000);
     console.log("✅ Logged in successfully");
// Wait for iframe element
await page.waitForSelector("iframe.iframe-block", { timeout: 30000 });

// Get the iframe element handle
await page.waitForSelector("iframe.iframe-block", { timeout: 20000 });
const iframeSrc = await page.$eval("iframe.iframe-block", el => el.getAttribute("src"));
console.log("iframe src:", iframeSrc);
const url = new URL(iframeSrc);
const token = url.searchParams.get("token");
console.log("✅ Token:", token);
  return token

  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
}

module.exports=Scraper