const axios = require('./frontend/node_modules/axios');

const axiosInstance = axios.create({
  baseURL: 'https://mern-stack-website-lxby.onrender.com/api',
  withCredentials: true,
  headers: {
    'Origin': 'https://mern-stack-website-nx8g.vercel.app'
  }
});

async function testRole(role) {
  const email = `browser-${role}-${Date.now()}@example.com`;
  const username = `browser${role}${Date.now()}`;
  const password = 'testpass123';

  console.log(`\n=== Testing ${role.toUpperCase()} (browser-like) ===`);

  try {
    const reg = await axiosInstance.post('/auth/register', {
      username, email, password, role
    });
    console.log(`Register: ${reg.status} - ${reg.data.message}`);
    console.log(`User role: ${reg.data.user.role}`);

    if (reg.data.user.role !== role) {
      console.log(`FAIL: Wrong role saved!`);
      return false;
    }
  } catch (err) {
    console.log(`Register FAILED:`, err.response?.status, err.response?.data || err.message);
    return false;
  }

  try {
    const login = await axiosInstance.post('/auth/login', { email, password });
    console.log(`Login: ${login.status} - ${login.data.message}`);
    console.log(`User role: ${login.data.user.role}`);

    if (login.data.user.role !== role) {
      console.log(`FAIL: Wrong role after login!`);
      return false;
    }
  } catch (err) {
    console.log(`Login FAILED:`, err.response?.status, err.response?.data || err.message);
    return false;
  }

  console.log(`PASS: ${role.toUpperCase()} works`);
  return true;
}

async function run() {
  console.log('Testing with axios (browser-like)...');

  const userOk = await testRole('user');
  const managerOk = await testRole('manager');
  const adminOk = await testRole('admin');

  console.log('\n========== RESULTS ==========');
  console.log(`User:     ${userOk ? 'PASS' : 'FAIL'}`);
  console.log(`Manager:  ${managerOk ? 'PASS' : 'FAIL'}`);
  console.log(`Admin:    ${adminOk ? 'PASS' : 'FAIL'}`);
}

run().catch(e => console.error('Error:', e.message));
