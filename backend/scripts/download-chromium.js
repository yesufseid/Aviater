const chromium = require("chrome-aws-lambda");

(async () => {
  const path = await chromium.executablePath;
  if (!path) {
    throw new Error("Chromium not found during postinstall");
  }
  console.log("✅ Chromium available at:", path);
})();
