const https = require('https');
const { performance } = require('perf_hooks');

const API = 'mern-stack-website-lxby.onrender.com';

async function makeRequest(path, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: API,
      port: 443,
      path: path,
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const start = performance.now();
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        const duration = performance.now() - start;
        resolve({ status: res.statusCode, duration: Math.round(duration) });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runLoadTest() {
  console.log('⚡ LOAD TESTING\n' + '='.repeat(50));

  // Sequential requests
  console.log('\n--- Sequential Requests (10x) ---');
  const seqTimes = [];
  for (let i = 0; i < 10; i++) {
    const res = await makeRequest('/api/health');
    seqTimes.push(res.duration);
    console.log(`Request ${i + 1}: ${res.duration}ms (Status: ${res.status})`);
  }
  const avgSeq = Math.round(seqTimes.reduce((a, b) => a + b, 0) / seqTimes.length);
  console.log(`Average: ${avgSeq}ms`);

  // Parallel requests
  console.log('\n--- Parallel Requests (10x) ---');
  const start = performance.now();
  const parallel = await Promise.all(
    Array(10).fill().map(() => makeRequest('/api/health'))
  );
  const totalTime = Math.round(performance.now() - start);
  const all200 = parallel.every(r => r.status === 200);
  console.log(`All 10 completed in: ${totalTime}ms`);
  console.log(`All successful: ${all200 ? 'Yes' : 'No'}`);

  // Auth endpoint load
  console.log('\n--- Auth Endpoint Load Test ---');
  const authTimes = [];
  const testEmail = `load${Date.now()}@test.com`;

  // Register
  const regStart = performance.now();
  const reg = await makeRequest('/api/auth/register', {
    username: 'loadtest', email: testEmail, password: 'loadpass123', role: 'user'
  });
  authTimes.push({ op: 'Register', time: Math.round(performance.now() - regStart), status: reg.status });

  // Login (5 times)
  for (let i = 0; i < 5; i++) {
    const loginStart = performance.now();
    const login = await makeRequest('/api/auth/login', { email: testEmail, password: 'loadpass123' });
    authTimes.push({ op: `Login ${i + 1}`, time: Math.round(performance.now() - loginStart), status: login.status });
  }

  authTimes.forEach(t => console.log(`${t.op}: ${t.time}ms (Status: ${t.status})`));

  const avgAuth = Math.round(authTimes.reduce((a, b) => a + b.time, 0) / authTimes.length);
  console.log(`\nAverage auth time: ${avgAuth}ms`);

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 LOAD TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Health check avg (sequential): ${avgSeq}ms`);
  console.log(`Health check (10 parallel): ${totalTime}ms`);
  console.log(`Auth operations avg: ${avgAuth}ms`);
  console.log(`\nVerdict: ${avgSeq < 1000 && avgAuth < 2000 ? '✅ GOOD' : '⚠️ SLOW'}`);
}

runLoadTest().catch(console.error);
