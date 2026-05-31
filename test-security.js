const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Test 1: Direct dashboard access without login
  console.log('=== Test 1: Direct /admin/dashboard without login ===');
  const page1 = await browser.newPage();
  await page1.evaluate(() => localStorage.clear());
  await page1.goto('https://mern-stack-website-nx8g.vercel.app/#/admin/dashboard');
  await page1.waitForTimeout(2000);
  console.log('URL:', page1.url());
  console.log(page1.url().includes('login') ? '✅ Redirected to login' : '❌ Still on dashboard');

  // Test 2: Manager trying to access admin dashboard
  console.log('\n=== Test 2: Manager accessing /admin/dashboard ===');
  const page2 = await browser.newPage();
  await page2.goto('https://mern-stack-website-nx8g.vercel.app/#/login');
  await page2.fill('input[type="email"]', 'testy@gmail.com'); // this is admin, need manager
  await page2.fill('input[type="password"]', 'testy123#');
  await page2.click('button[type="submit"]');
  await page2.waitForTimeout(2000);
  await page2.goto('https://mern-stack-website-nx8g.vercel.app/#/admin/dashboard');
  await page2.waitForTimeout(2000);
  console.log('URL:', page2.url());

  // Test 3: Manager role accessing manager dashboard
  console.log('\n=== Test 3: Register Manager, login, check access ===');
  const page3 = await browser.newPage();
  const email = 'mgr' + Date.now() + '@test.com';
  await page3.goto('https://mern-stack-website-nx8g.vercel.app/#/register');
  await page3.fill('input[placeholder="Enter your name"]', 'Manager');
  await page3.fill('input[placeholder="Enter your email"]', email);
  await page3.fill('input[placeholder="Enter your password"]', 'pass123');
  await page3.fill('input[placeholder="Confirm your password"]', 'pass123');
  await page3.selectOption('select', 'manager');
  await page3.click('button[type="submit"]');
  await page3.waitForTimeout(2000);

  // Try to access admin as manager
  await page3.goto('https://mern-stack-website-nx8g.vercel.app/#/admin/dashboard');
  await page3.waitForTimeout(2000);
  console.log('Manager to admin URL:', page3.url());

  // Try to access user as manager
  await page3.goto('https://mern-stack-website-nx8g.vercel.app/#/user/dashboard');
  await page3.waitForTimeout(2000);
  console.log('Manager to user URL:', page3.url());

  await browser.close();
})();
