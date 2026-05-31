const https = require('https');

const API = 'mern-stack-website-lxby.onrender.com';

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
  console.log('Checking if testy@gmail.com exists...\n');

  // Try to register testy@gmail.com
  const reg = await request('POST', '/api/auth/register', {
    username: 'testyuser', email: 'testy@gmail.com', password: 'testy123#', role: 'admin'
  });
  console.log('Register attempt:', reg.status, reg.body);

  // Try login
  const login = await request('POST', '/api/auth/login', {
    email: 'testy@gmail.com', password: 'testy123#'
  });
  console.log('Login attempt:', login.status, login.body);
}

run().catch(e => console.error(e));
