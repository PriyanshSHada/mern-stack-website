const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Opening login page...');
  await page.goto('https://mern-stack-website-nx8g.vercel.app/#/login');
  await page.waitForTimeout(1000);

  // Listen for console messages
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log('Filling login form...');
  await page.fill('input[type="email"]', 'testy@gmail.com');
  await page.fill('input[type="password"]', 'testy123#');

  console.log('Clicking login...');
  await Promise.all([
    page.waitForResponse(response => response.url().includes('/api/auth/login')),
    page.click('button[type="submit"]')
  ]);

  // Get the login API response
  const responses = await page.evaluate(() => window.performance.getEntriesByType('resource'));
  const loginResponse = responses.find(r => r.name.includes('/api/auth/login'));
  console.log('Login API response status:', loginResponse?.responseStatus || 'unknown');

  await page.waitForTimeout(2000);

  // Check current URL
  const url = page.url();
  console.log('Current URL:', url);

  // Check if error is displayed
  const errorText = await page.locator('div[style*="background: #fef2f2"]').textContent().catch(() => null);
  if (errorText) {
    console.log('ERROR on page:', errorText);
  } else {
    console.log('No error visible on page');
  }

  // Take screenshot
  await page.screenshot({ path: 'login-result.png', fullPage: true });
  console.log('Screenshot saved: login-result.png');

  await browser.close();
})();
