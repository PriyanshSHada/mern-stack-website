const fs = require('fs');
const path = require('path');
const https = require('https');

const DIST_DIR = path.join(__dirname, 'frontend', 'dist', 'assets');
const API = 'mern-stack-website-lxby.onrender.com';

// Step 1: Check what API URL is baked into the built frontend
function checkBuiltFrontend() {
  console.log('=== Checking built frontend JS ===');
  const files = fs.readdirSync(DIST_DIR).filter(f => f.endsWith('.js'));
  if (files.length === 0) {
    console.log('ERROR: No JS files found in frontend/dist/assets/');
    return false;
  }

  const jsFile = path.join(DIST_DIR, files[0]);
  const content = fs.readFileSync(jsFile, 'utf-8');

  // Look for the API URL pattern
  const hasLocalhost = content.includes('localhost:5000');
  const hasDeployed = content.includes('mern-stack-website-lxby.onrender.com');

  console.log(`JS file: ${files[0]}`);
  console.log(`Contains localhost:5000: ${hasLocalhost}`);
  console.log(`Contains deployed backend: ${hasDeployed}`);

  if (hasLocalhost && !hasDeployed) {
    console.log('PROBLEM: Frontend is still using localhost:5000!');
    return false;
  }
  if (hasDeployed) {
    console.log('OK: Frontend is using deployed backend URL');
    return true;
  }
  console.log('WARNING: Could not detect API URL in build');
  return false;
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: API, port: 443, path: path, method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://mern-stack-website-nx8g.vercel.app',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testFullFlow(role) {
  const email = `browser-${role}-${Date.now()}@example.com`;
  const username = `browser${role}${Date.now()}`;
  const password = 'testpass123';

  console.log(`\n=== Testing ${role.toUpperCase()} flow ===`);

  // Register
  const reg = await request('POST', '/api/auth/register', {
    username, email, password, role
  });
  console.log(`Register: ${reg.status} - ${reg.body.message || JSON.stringify(reg.body)}`);

  if (reg.status !== 201) {
    console.log(`FAIL: Registration failed`);
    return false;
  }

  // Login
  const login = await request('POST', '/api/auth/login', {
    email, password
  });
  console.log(`Login: ${login.status} - ${login.body.message || JSON.stringify(login.body)}`);

  if (login.status !== 200) {
    console.log(`FAIL: Login failed`);
    return false;
  }

  console.log(`PASS: ${role.toUpperCase()} works`);
  return true;
}

async function run() {
  console.log('Checking deployed app...\n');

  const buildOk = checkBuiltFrontend();

  console.log('\n=== Testing API endpoints (simulating browser) ===');

  const userOk = await testFullFlow('user');
  const managerOk = await testFullFlow('manager');
  const adminOk = await testFullFlow('admin');

  console.log('\n========== RESULTS ==========');
  console.log(`Build config: ${buildOk ? 'OK' : 'BROKEN'}`);
  console.log(`User API:     ${userOk ? 'PASS' : 'FAIL'}`);
  console.log(`Manager API:  ${managerOk ? 'PASS' : 'FAIL'}`);
  console.log(`Admin API:    ${adminOk ? 'PASS' : 'FAIL'}`);

  if (!buildOk) {
    console.log('\n>>> The frontend build still points to localhost!');
    console.log('>>> Run: npm run --prefix frontend build');
    console.log('>>> Then redeploy to Vercel');
  }
}

run().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
