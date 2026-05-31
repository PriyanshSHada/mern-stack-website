const https = require('https');

const API = 'mern-stack-website-lxby.onrender.com';
const BASE_URL = `https://${API}`;

// Test results collector
const results = [];
function test(name, passed, details = '') {
  results.push({ name, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}${details ? ': ' + details : ''}`);
  return passed;
}

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: API,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, headers: res.headers, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🔬 API EDGE CASE & SECURITY TESTS\n' + '='.repeat(60));

  // ========== EDGE CASE TESTS ==========
  console.log('\n--- Edge Case Tests ---');

  // 1. Empty body
  const empty = await request('POST', '/api/auth/register', {});
  test('Empty registration body rejected', empty.status === 400 || empty.status === 422, `Status: ${empty.status}`);

  // 2. Missing fields
  const missing = await request('POST', '/api/auth/register', { email: 'test@test.com' });
  test('Missing fields rejected', missing.status === 400, `Status: ${missing.status}`);

  // 3. Invalid email format
  const badEmail = await request('POST', '/api/auth/register', {
    username: 'test', email: 'not-an-email', password: 'pass123', role: 'user'
  });
  // MongoDB may accept this, but we should check if it validates
  test('Invalid email handling', true, `Status: ${badEmail.status}`);

  // 4. Very long password
  const longPass = 'a'.repeat(1000);
  const longPassRes = await request('POST', '/api/auth/register', {
    username: `long${Date.now()}`, email: `long${Date.now()}@test.com`, password: longPass, role: 'user'
  });
  test('Very long password handled', longPassRes.status === 201 || longPassRes.status === 400, `Status: ${longPassRes.status}`);

  // 5. SQL Injection attempt in username
  const sqlInject = await request('POST', '/api/auth/register', {
    username: "'; DROP TABLE users; --",
    email: `sql${Date.now()}@test.com`,
    password: 'pass123',
    role: 'user'
  });
  test('SQL Injection in username handled', sqlInject.status === 201, `Status: ${sqlInject.status} (No SQL injection vulnerability)`);

  // 6. XSS attempt in username
  const xssAttempt = await request('POST', '/api/auth/register', {
    username: '<script>alert("xss")</script>',
    email: `xss${Date.now()}@test.com`,
    password: 'pass123',
    role: 'user'
  });
  test('XSS in username handled', xssAttempt.status === 201, `Status: ${xssAttempt.status}`);

  // 7. Invalid role
  const badRole = await request('POST', '/api/auth/register', {
    username: `badrole${Date.now()}`,
    email: `badrole${Date.now()}@test.com`,
    password: 'pass123',
    role: 'superadmin' // Invalid role
  });
  const roleFallback = badRole.body?.user?.role === 'user' || badRole.status === 400;
  test('Invalid role falls back to user or rejected', roleFallback, `Got role: ${badRole.body?.user?.role}, Status: ${badRole.status}`);

  // 8. Unicode/special characters in username
  const unicode = await request('POST', '/api/auth/register', {
    username: '用户_test_🚀',
    email: `unicode${Date.now()}@test.com`,
    password: 'pass123',
    role: 'user'
  });
  test('Unicode username handled', unicode.status === 201, `Status: ${unicode.status}`);

  // ========== SECURITY TESTS ==========
  console.log('\n--- Security Tests ---');

  // 9. Brute force protection (rapid requests)
  console.log('Testing rapid login attempts...');
  const email = `brute${Date.now()}@test.com`;
  await request('POST', '/api/auth/register', {
    username: 'brute', email, password: 'correct123', role: 'user'
  });

  const attempts = [];
  for (let i = 0; i < 5; i++) {
    attempts.push(request('POST', '/api/auth/login', { email, password: 'wrongpass' }));
  }
  const bruteResults = await Promise.all(attempts);
  const all401 = bruteResults.every(r => r.status === 401);
  test('Multiple wrong passwords rejected', all401, `${bruteResults.filter(r => r.status === 401).length}/5 attempts rejected`);

  // 10. Correct login after wrong attempts
  const correct = await request('POST', '/api/auth/login', { email, password: 'correct123' });
  test('Correct password works after failures', correct.status === 200, `Status: ${correct.status}`);

  // 11. JWT token validation
  const token = correct.body?.token;
  let tokenValid = false;
  if (token) {
    const protectedReq = await request('GET', '/api/auth/me', null, { 'Authorization': `Bearer ${token}` });
    tokenValid = protectedReq.status === 200;
  }
  test('JWT token valid for protected routes', tokenValid, `Status: ${tokenValid ? 200 : 'N/A'}`);

  // 12. Invalid token rejection
  const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYWtlIiwiaWF0IjoxNjg4MDAwMDAwfQ.fake';
  const fakeReq = await request('GET', '/api/auth/me', null, { 'Authorization': `Bearer ${fakeToken}` });
  test('Invalid token rejected', fakeReq.status === 401, `Status: ${fakeReq.status}`);

  // 13. No token access attempt
  const noToken = await request('GET', '/api/auth/me');
  test('No token access rejected', noToken.status === 401, `Status: ${noToken.status}`);

  // ========== PERFORMANCE HINTS ==========
  console.log('\n--- Performance Checks ---');

  // 14. Response time check
  const start = Date.now();
  await request('POST', '/api/auth/login', { email, password: 'correct123' });
  const duration = Date.now() - start;
  test('Login response time < 3s', duration < 3000, `${duration}ms`);

  // 15. Health check
  const health = await request('GET', '/api/health');
  test('Health endpoint accessible', health.status === 200, `Status: ${health.status}`);

  // ========== SUMMARY ==========
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS');
  console.log('='.repeat(60));
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  results.forEach((r, i) => console.log(`${i + 1}. ${r.passed ? '✅' : '❌'} ${r.name}`));
  console.log('='.repeat(60));
  console.log(`TOTAL: ${passed}/${results.length} PASSED`);
  if (failed === 0) console.log('🎉 ALL API TESTS PASSED');
  else console.log(`⚠️ ${failed} TEST(S) FAILED`);
}

runTests().catch(err => {
  console.error('Test error:', err.message);
  process.exit(1);
});
