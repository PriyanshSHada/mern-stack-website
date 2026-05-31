const fs = require('fs');
const s = fs.readFileSync('deployed.js', 'utf8');
console.log('Has /#/login:', s.includes('/#/login'));
console.log('Has raw /login:', s.includes('window.location.href="/login"'));
console.log('Has onrender:', s.includes('onrender.com'));
console.log('Has localhost:', s.includes('localhost:5000'));
