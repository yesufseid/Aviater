const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const Scraper = async () => {
  let browser;
  try {
    console.log('🚀 Launching browser...');
    
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
      ],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Set realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    );

    // Navigate to page
    console.log('🌐 Navigating to Aradabet...');
    await page.goto("https://arada.bet/en/casino?game=%2Faviator", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    // Wait for login form
    console.log('🔍 Waiting for login form...');
    await page.waitForSelector("input[placeholder='Phone number, username or ID']", { timeout: 30000 });

    // Fill credentials
    console.log('📝 Filling credentials...');
    await page.type("input[placeholder='Phone number, username or ID']", process.env.ARADABET_PHONE);
    await page.type("input[placeholder='Enter your password']", process.env.ARADABET_PASSWORD);

    // Handle popup if present
    try {
      const popupClose = await page.$("i.pi.pi-times.close__button");
      if (popupClose) {
        console.log("⚠️ Closing popup...");
        await popupClose.click();
        await page.waitForTimeout(1000);
      }
    } catch (err) {
      console.log("ℹ️ No popup found");
    }

    // FIXED LOGIN SECTION
    console.log('🔑 Looking for login button...');
    const loginBtn = await page.$("input[type='submit'][value='Login']");
    if (!loginBtn) {
      await page.screenshot({ path: '/tmp/login-button-error.png' });
      throw new Error("❌ Login button not found");
    }

    console.log('✅ Login button found, clicking...');
    await loginBtn.click();

    // Improved login verification
    console.log('⏳ Waiting for login to complete...');
    try {
      // Wait for navigation with shorter timeout
      await page.waitForNavigation({ 
        waitUntil: 'networkidle0', 
        timeout: 15000 
      });
      console.log("✅ Navigation detected - login successful");
    } catch (navError) {
      console.log("ℹ️ No navigation detected, checking for dashboard...");
      
      // Check for dashboard elements
      try {
        await page.waitForSelector('.dashboard, [class*="user"], [class*="profile"]', { 
          timeout: 10000 
        });
        console.log("✅ Dashboard elements found");
      } catch (dashboardError) {
        // Check for errors
        const loginError = await page.$('.login-error, .error, [class*="error"]');
        if (loginError) {
          const errorText = await page.evaluate(el => el.textContent?.trim(), loginError);
          throw new Error(`❌ Login failed: ${errorText || 'Unknown error'}`);
        }
        
        // Final check - if we're not on login page, assume success
        const currentUrl = page.url();
        if (!currentUrl.includes('login')) {
          console.log("✅ Not on login page - assuming login successful");
        } else {
          await page.screenshot({ path: '/tmp/login-failed.png' });
          throw new Error('❌ Login verification failed');
        }
      }
    }

    console.log("✅ Login process completed");

    // Wait for iframe
    console.log('🔍 Waiting for iframe...');
    await page.waitForSelector("iframe.iframe-block", { timeout: 30000 });

    const iframeSrc = await page.$eval("iframe.iframe-block", el => el.getAttribute("src"));
    const url = new URL(iframeSrc);
    const token = url.searchParams.get("token");
    
    console.log("✅ Token extracted:", token);
    return token;

  } catch (error) {
    console.error('❌ Scraper error:', error.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = Scraper;