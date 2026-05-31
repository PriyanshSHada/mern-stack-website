// Paste this in your browser console (F12 → Console tab)
// This tests the deployed API directly from your browser

async function testLogin() {
  console.log('Testing API from browser...');
  try {
    const res = await fetch('https://mern-stack-website-lxby.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testy@gmail.com', password: 'testy123#' })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
    if (res.status === 200) {
      console.log('✅ API works from browser!');
    } else {
      console.log('❌ API failed:', data.message);
    }
  } catch (err) {
    console.error('❌ Network error:', err.message);
    console.log('This might be CORS, ad-blocker, or network issue.');
  }
}

testLogin();
