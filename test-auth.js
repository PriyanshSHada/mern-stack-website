const http = require('http');

const API = 'http://localhost:5000';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          resolve({ status: res.statusCode, body: json });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testRole(role) {
  const email = `test-${role}-${Date.now()}@example.com`;
  const username = `test${role}${Date.now()}`;
  const password = 'testpass123';

  console.log(`\n--- Testing ${role.toUpperCase()} ---`);

  // 1. Register
  const reg = await request('POST', '/api/auth/register', {
    username, email, password, role
  });
  console.log(`Register status: ${reg.status}`);
  console.log(`Register response:`, JSON.stringify(reg.body, null, 2));

  if (reg.status !== 201) {
    console.log(`FAIL: Registration failed for ${role}`);
    return false;
  }

  if (reg.body.user?.role !== role) {
    console.log(`FAIL: Role mismatch! Expected '${role}', got '${reg.body.user?.role}'`);
    return false;
  }

  // 2. Login
  const login = await request('POST', '/api/auth/login', {
    email, password
  });
  console.log(`Login status: ${login.status}`);
  console.log(`Login response:`, JSON.stringify(login.body, null, 2));

  if (login.status !== 200) {
    console.log(`FAIL: Login failed for ${role}`);
    return false;
  }

  if (login.body.user?.role !== role) {
    console.log(`FAIL: Role mismatch after login! Expected '${role}', got '${login.body.user?.role}'`);
    return false;
  }

  console.log(`PASS: ${role.toUpperCase()} registration and login work correctly`);
  return true;
}

async function run() {
  console.log('Waiting for backend to be ready...');
  let ready = false;
  for (let i = 0; i < 10; i++) {
    try {
      const health = await request('GET', '/api/health');
      if (health.status === 200) {
        ready = true;
        console.log('Backend is ready!');
        break;
      }
    } catch {
      // not ready yet
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  if (!ready) {
    console.log('ERROR: Backend is not responding on port 5000');
    console.log('Make sure you run: python start.py');
    process.exit(1);
  }

  const userOk = await testRole('user');
  const managerOk = await testRole('manager');
  const adminOk = await testRole('admin');

  console.log('\n========== RESULTS ==========');
  console.log(`User:     ${userOk ? 'PASS' : 'FAIL'}`);
  console.log(`Manager:  ${managerOk ? 'PASS' : 'FAIL'}`);
  console.log(`Admin:    ${adminOk ? 'PASS' : 'FAIL'}`);

  process.exit(userOk && managerOk && adminOk ? 0 : 1);
}

run().catch(e => {
  console.error('Test error:', e.message);
  process.exit(1);
});
