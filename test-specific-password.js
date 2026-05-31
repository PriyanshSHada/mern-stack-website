const https = require('https');

const API = 'mern-stack-website-lxby.onrender.com';
const email = 'testy' + Date.now() + '@gmail.com';
const username = 'testy' + Date.now();
const password = 'testy123#';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: API, port: 443, path: path, method: method,
      headers: { 'Content-Type': 'application/json', ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) }
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

async function run() {
  console.log('Email:', email);
  console.log('Password:', password);

  console.log('\n--- REGISTER ---');
  const reg = await request('POST', '/api/auth/register', { username, email, password, role: 'admin' });
  console.log(reg.status, reg.body);

  console.log('\n--- LOGIN ---');
  const login = await request('POST', '/api/auth/login', { email, password });
  console.log(login.status, login.body);

  console.log('\n--- LOGIN with WRONG password ---');
  const login2 = await request('POST', '/api/auth/login', { email, password: 'wrongpassword' });
  console.log(login2.status, login2.body);
}

run().catch(e => console.error(e));
