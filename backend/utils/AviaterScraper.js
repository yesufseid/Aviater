const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteer = require("puppeteer-extra");

puppeteer.use(StealthPlugin());

// helper function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const Scraper = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  try {
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
        await delay(10000); // was page.waitForTimeout(10000)
      }
    }

    if (!navigationSuccess) return;

    await page.waitForSelector("input[placeholder='Phone number, username or ID']", { timeout: 30000 });
    await page.type("input[placeholder='Phone number, username or ID']", process.env.ARADABET_PHONE);

    await page.type("input[placeholder='Enter your password']", process.env.ARADABET_PASSWORD);

    await page.waitForSelector("input[type='submit'][value='Login']", { timeout: 30000 });

    try {
      const popupClose = await page.$("i.pi.pi-times.close__button");
      if (popupClose) {
        console.log("⚠️ Popup detected, closing it...");
        await popupClose.click();
        await delay(1000); // was page.waitForTimeout(1000)
      }
    } catch (err) {
      console.log("ℹ️ No popup found, continuing...");
    }

    const loginBtn = await page.$("input[type='submit'][value='Login']");
    if (!loginBtn) {
      await page.screenshot({ path: 'no-login-btn.png' });
      throw new Error("❌ Login button not found");
    }

    await loginBtn.evaluate(el => el.scrollIntoView({ behavior: "smooth", block: "center" }));
    await delay(500); // was page.waitForTimeout(500)

    await loginBtn.click();
    await page.screenshot({ path: "after-login-click.png" });

 try {
  await page.waitForSelector(".dashboard, .login-error", { timeout: 30000 });
  console.log("✅ Login step completed — dashboard or error appeared");
} catch (err) {
  console.error("⚠️ Login verification timed out:", err.message);
}


    await delay(15000); // was page.waitForTimeout(15000)
    console.log("✅ Logged in successfully");

    await page.waitForSelector("iframe.iframe-block", { timeout: 30000 });
    const iframeSrc = await page.$eval("iframe.iframe-block", el => el.getAttribute("src"));
    const url = new URL(iframeSrc);
    const token = url.searchParams.get("token");
    console.log("✅ Token:", token);

    return token;
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'error.png' });
  } finally {
    await browser.close();
  }
};

module.exports = Scraper;
