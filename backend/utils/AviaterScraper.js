const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const chromium = require('@sparticuz/chromium-min');
const fs = require("fs");
const path = require("path");

puppeteer.use(StealthPlugin());

const Scraper = async () => {
  let browser;
  try {
    // Configure Chromium for Render environment
    const executablePath = await chromium.executablePath();
    
    console.log('🚀 Launching browser in Render environment...');
    
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-software-rasterizer',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--window-size=1920,1080'
      ],
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      executablePath,
      headless: chromium.headless, // Use chromium's headless mode
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Set realistic user agent and viewport
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    );

    // Set longer timeouts for Render's slower environment
    page.setDefaultTimeout(120000);
    page.setDefaultNavigationTimeout(120000);

    // Retry logic for page navigation
    let navigationSuccess = false;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} to load Aradabet...`);
        
        // Use networkidle0 for better reliability
        await page.goto("https://arada.bet/en/casino?game=%2Faviator", {
          waitUntil: "networkidle0",
          timeout: 120000
        });
        
        navigationSuccess = true;
        console.log('✅ Page loaded successfully');
        break;
      } catch (e) {
        console.log(`❌ Navigation attempt ${attempt} failed:`, e.message);
        
        if (attempt === maxRetries) {
          throw new Error(`❌ Failed to load Aradabet after ${maxRetries} retries: ${e.message}`);
        }
        
        console.log(`⏳ Waiting 10 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    if (!navigationSuccess) {
      throw new Error('Navigation failed after all retries');
    }

    // Wait for login form with more specific selector
    console.log('🔍 Waiting for login form...');
    await page.waitForSelector("input[placeholder='Phone number, username or ID']", { 
      timeout: 60000 
    }).catch(() => {
      throw new Error('Login form not found within timeout');
    });

    // Fill login credentials
    console.log('📝 Filling login credentials...');
    await page.type("input[placeholder='Phone number, username or ID']", process.env.ARADABET_PHONE || '');
    await page.type("input[placeholder='Enter your password']", process.env.ARADABET_PASSWORD || '');

    // Handle potential popup with better selector
    try {
      console.log('🔍 Checking for popup...');
      const popupClose = await page.$(".pi-times.close__button, .close-button, [aria-label='close']");
      if (popupClose) {
        console.log("⚠️ Popup detected, closing...");
        await popupClose.click();
        await page.waitForTimeout(2000);
      }
    } catch (err) {
      console.log("ℹ️ No popup found or error closing popup");
    }

    // Click login button with better error handling
    console.log('🔑 Clicking login button...');
    const loginBtn = await page.$("input[type='submit'][value='Login'], button[type='submit']");
    if (!loginBtn) {
      throw new Error("❌ Login button not found");
    }

    await loginBtn.click();

    // Wait for navigation or dashboard with better handling
    console.log('⏳ Waiting for login to complete...');
    try {
      await page.waitForNavigation({ 
        waitUntil: 'networkidle0',
        timeout: 60000 
      });
      console.log("✅ Navigation after login completed");
    } catch (navError) {
      console.log("ℹ️ No navigation detected, checking for dashboard elements...");
      // Check if we're already on the dashboard
      const dashboardElement = await page.$('.dashboard, .user-profile, .balance');
      if (!dashboardElement) {
        throw new Error('Login failed - neither navigation nor dashboard elements found');
      }
      console.log("✅ Dashboard elements found without navigation");
    }

    // Extra wait for dynamic content
    console.log('⏳ Waiting for page to fully load...');
    await page.waitForTimeout(10000);

    // Wait for iframe and extract token with better error handling
    console.log('🔍 Looking for iframe...');
    await page.waitForSelector("iframe.iframe-block", { 
      timeout: 60000 
    }).catch(() => {
      throw new Error('Iframe not found within timeout');
    });

    const iframeSrc = await page.$eval("iframe.iframe-block", el => el.getAttribute("src"));
    if (!iframeSrc) {
      throw new Error("❌ iframe src attribute not found");
    }

    console.log('🔗 Iframe source:', iframeSrc);
    
    const url = new URL(iframeSrc);
    const token = url.searchParams.get("token");
    
    if (!token) {
      throw new Error("❌ Token not found in iframe URL");
    }

    console.log("✅ Token extracted successfully");
    return token;

  } catch (error) {
    console.error('❌ Scraper error:', error.message);
    
    // Try to capture screenshot for debugging
    try {
      if (browser) {
        const pages = await browser.pages();
        if (pages.length > 0) {
          const screenshot = await pages[0].screenshot({ encoding: 'base64' });
          console.log('📸 Error screenshot (base64):', screenshot.substring(0, 100) + '...');
        }
      }
    } catch (screenshotErr) {
      console.error("⚠️ Failed to capture error screenshot:", screenshotErr.message);
    }
    
    return null;
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('🔚 Browser closed');
      } catch (closeError) {
        console.error('⚠️ Error closing browser:', closeError.message);
      }
    }
  }
};

module.exports = Scraper;