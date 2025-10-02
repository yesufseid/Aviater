const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const Scraper = async () => {
  let browser;
  try {
    console.log('🚀 Launching browser on Render...');
    
    // For Render environment - use these specific options
    const launchOptions = {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-software-rasterizer',
        '--window-size=1920,1080'
      ],
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      headless: true,
      ignoreHTTPSErrors: true,
    };

    // Add executable path for different environments
    if (process.env.NODE_ENV === 'production') {
      // On Render, use the built-in Chromium
      console.log('🔧 Production environment detected');
    } else {
      console.log('🔧 Development environment detected');
    }

    console.log('📋 Launch options:', JSON.stringify({
      ...launchOptions,
      executablePath: 'using puppeteer built-in chromium'
    }, null, 2));

    browser = await puppeteer.launch(launchOptions);
    console.log('✅ Browser launched successfully');

    const page = await browser.newPage();
    console.log('📄 New page created');

    // Set realistic user agent
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    );

    // Set timeouts
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    // Navigate to the page
    console.log('🌐 Navigating to Aradabet...');
    await page.goto("https://arada.bet/en/casino?game=%2Faviator", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    console.log('✅ Page loaded');

    // Wait for login form
    console.log('🔍 Waiting for login form...');
    await page.waitForSelector("input[placeholder='Phone number, username or ID']", { 
      timeout: 30000 
    });

    // Fill login credentials
    console.log('📝 Filling login credentials...');
    await page.type("input[placeholder='Phone number, username or ID']", process.env.ARADABET_PHONE || '');
    await page.type("input[placeholder='Enter your password']", process.env.ARADABET_PASSWORD || '');

    // Handle potential popup
    try {
      console.log('🔍 Checking for popup...');
      const popupClose = await page.$("i.pi.pi-times.close__button");
      if (popupClose) {
        console.log("⚠️ Popup detected, closing...");
        await popupClose.click();
        await page.waitForTimeout(2000);
      }
    } catch (err) {
      console.log("ℹ️ No popup found or error closing popup");
    }

    // Click login button
    console.log('🔑 Clicking login button...');
    const loginBtn = await page.$("input[type='submit'][value='Login']");
    if (!loginBtn) {
      throw new Error("❌ Login button not found");
    }

    await loginBtn.click();

    // Wait for login to complete
    console.log('⏳ Waiting for login to complete...');
    try {
      await page.waitForNavigation({ 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      console.log("✅ Navigation after login completed");
    } catch (navError) {
      console.log("ℹ️ No navigation detected, checking for dashboard...");
      // Check if we're already logged in
      const dashboardElement = await page.$('.dashboard, [class*="user"]');
      if (!dashboardElement) {
        console.log("❌ Login may have failed");
      } else {
        console.log("✅ Dashboard elements found");
      }
    }

    // Wait for iframe
    console.log('🔍 Looking for iframe...');
    await page.waitForSelector("iframe.iframe-block", { 
      timeout: 30000 
    });

    const iframeSrc = await page.$eval("iframe.iframe-block", el => el.getAttribute("src"));
    if (!iframeSrc) {
      throw new Error("❌ iframe src not found");
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
    console.error('Stack trace:', error.stack);
    
    // Try to capture page content for debugging
    if (browser) {
      try {
        const pages = await browser.pages();
        if (pages.length > 0) {
          const currentUrl = await pages[0].url();
          console.log('🌐 Current URL:', currentUrl);
          
          const pageTitle = await pages[0].title();
          console.log('📄 Page title:', pageTitle);
        }
      } catch (debugError) {
        console.error('⚠️ Debug info error:', debugError.message);
      }
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