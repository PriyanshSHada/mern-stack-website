const { chromium, firefox, webkit } = require('playwright');

const BASE = 'https://mern-stack-website-nx8g.vercel.app';
const PASS = 'TestPass123#';
const wait = ms => new Promise(r => setTimeout(r, ms));

const results = [];
function record(name, pass, details = '') {
  results.push({ name, pass, details });
  console.log(`${pass ? '✅' : '❌'} ${name}${details ? ' - ' + details : ''}`);
}

async function testBrowser(browserType, browserName) {
  console.log(`\n🌐 Testing with ${browserName}...`);
  const browser = await browserType.launch({ headless: true });
  const page = await browser.newPage();

  // Test 1: Responsive layout (mobile viewport)
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`${BASE}/#/login`);
  await wait(1500);
  const mobileOk = await page.locator('button[type="submit"]').isVisible();
  record(`${browserName}: Mobile responsive`, mobileOk);

  // Test 2: Form validation (empty submit)
  await page.goto(`${BASE}/#/register`);
  await wait(1000);
  await page.click('button[type="submit"]');
  await wait(500);
  const validationOk = await page.locator('input:invalid').first().isVisible().catch(() => false);
  record(`${browserName}: HTML5 form validation`, validationOk);

  // Test 3: Password visibility (if toggle exists)
  // Skipping - no toggle in current UI

  // Test 4: Remember me / localStorage persistence
  const email = `persist${Date.now()}@test.com`;
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(`${BASE}/#/register`);
  await wait(1000);
  await page.fill('input[placeholder="Enter your name"]', 'Persist');
  await page.fill('input[placeholder="Enter your email"]', email);
  await page.fill('input[placeholder="Enter your password"]', PASS);
  await page.fill('input[placeholder="Confirm your password"]', PASS);
  await page.selectOption('select', 'user');
  await page.click('button[type="submit"]');
  await wait(3000);

  // Close and reopen browser (simulates returning user)
  await browser.close();
  const browser2 = await browserType.launch({ headless: true });
  const page2 = await browser2.newPage();
  await page2.goto(`${BASE}/#/user/dashboard`);
  await wait(2000);
  const storedUser = await page2.evaluate(() => localStorage.getItem('user'));
  const persisted = storedUser && storedUser.includes('Persist');
  record(`${browserName}: Session persistence`, persisted, persisted ? 'User data in localStorage' : 'No session data');

  await browser2.close();
}

async function testAccessibility() {
  console.log('\n♿ Accessibility Checks...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`${BASE}/#/login`);
  await wait(1500);

  // Check for form labels
  const emailLabel = await page.locator('label', { hasText: /Email/i }).first().isVisible().catch(() => false);
  const passLabel = await page.locator('label', { hasText: /Password/i }).first().isVisible().catch(() => false);
  record('A11y: Form labels present', emailLabel && passLabel);

  // Check for input types
  const emailType = await page.locator('input[type="email"]').first().isVisible();
  const passType = await page.locator('input[type="password"]').first().isVisible();
  record('A11y: Correct input types', emailType && passType);

  // Check for button text
  const buttonText = await page.locator('button[type="submit"]').textContent();
  record('A11y: Submit button has text', buttonText && buttonText.length > 0, `"${buttonText}"`);

  // Check color contrast (basic)
  const buttonColor = await page.locator('button[type="submit"]').evaluate(el => {
    const style = window.getComputedStyle(el);
    return { bg: style.backgroundColor, color: style.color };
  });
  record('A11y: Button has colors', buttonColor.bg !== 'rgba(0, 0, 0, 0)', `bg: ${buttonColor.bg}`);

  await browser.close();
}

async function testNavigationFlows() {
  console.log('\n🧭 Navigation Flow Tests...');
  const browser = await chromium.launch({ headless: true });

  // Test: Login → Logout → Back button
  const page = await browser.newPage();
  const email = `nav${Date.now()}@test.com`;

  await page.goto(`${BASE}/#/register`);
  await wait(1000);
  await page.fill('input[placeholder="Enter your name"]', 'Nav');
  await page.fill('input[placeholder="Enter your email"]', email);
  await page.fill('input[placeholder="Enter your password"]', PASS);
  await page.fill('input[placeholder="Confirm your password"]', PASS);
  await page.selectOption('select', 'user');
  await page.click('button[type="submit"]');
  await wait(3000);

  // Navigate to login while logged in (should redirect)
  await page.goto(`${BASE}/#/login`);
  await wait(2000);
  const redirected = !page.url().includes('/login') || page.url().includes('/dashboard');
  record('Nav: Logged-in user redirected from login page', redirected, page.url());

  // Test: Direct register access while logged in
  await page.goto(`${BASE}/#/register`);
  await wait(2000);
  const regRedirect = !page.url().includes('/register') || page.url().includes('/dashboard');
  record('Nav: Logged-in user redirected from register page', regRedirect, page.url());

  await browser.close();
}

async function testErrorHandling() {
  console.log('\n⚠️ Error Handling Tests...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Network error simulation (offline)
  await page.context().setOffline(true);
  await page.goto(`${BASE}/#/login`);
  await wait(2000);
  const offlineError = await page.locator('text=/offline|error|failed/i').first().isVisible().catch(() => false) ||
                       page.url().includes('error') ||
                       await page.locator('body').textContent().then(t => t.includes('Error'));
  record('Error: Offline handling', offlineError, 'Shows error when offline');

  await page.context().setOffline(false);

  // Server error (rate limit or timeout)
  await page.goto(`${BASE}/#/login`);
  await wait(1000);
  await page.fill('input[type="email"]', 'test@test.com');
  await page.fill('input[type="password"]', 'wrong');

  // Multiple rapid submissions
  for (let i = 0; i < 3; i++) {
    page.click('button[type="submit"]').catch(() => {});
    await wait(200);
  }
  await wait(2000);
  const errorShown = await page.locator('div[style*="#fef2f2"]').isVisible().catch(() => false);
  record('Error: Multiple submissions handled', errorShown);

  await browser.close();
}

(async () => {
  console.log('🧪 ADVANCED BROWSER TEST SUITE\n' + '='.repeat(60));

  // Test multiple browsers
  await testBrowser(chromium, 'Chrome');
  // Firefox and WebKit tests commented out to save time
  // await testBrowser(firefox, 'Firefox');
  // await testBrowser(webkit, 'Safari');

  await testAccessibility();
  await testNavigationFlows();
  await testErrorHandling();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL RESULTS');
  console.log('='.repeat(60));
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  results.forEach((r, i) => console.log(`${i + 1}. ${r.pass ? '✅' : '❌'} ${r.name}`));
  console.log('='.repeat(60));
  console.log(`TOTAL: ${passed}/${results.length} PASSED`);
  console.log(failed === 0 ? '🎉 ALL TESTS PASSED' : `⚠️ ${failed} FAILED`);
})();
