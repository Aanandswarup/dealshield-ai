const https = require('https');

const payload = JSON.stringify({
  host: 'aanandswarup.github.io',
  key: 'd4b8e39f7a1c4e2a8b9e6c5d1f0a2b3c',
  keyLocation: 'https://aanandswarup.github.io/dealshield-ai/d4b8e39f7a1c4e2a8b9e6c5d1f0a2b3c.txt',
  urlList: [
    'https://aanandswarup.github.io/dealshield-ai/'
  ]
});

const req = https.request({
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  console.log(`IndexNow Response: ${res.statusCode} ${res.statusMessage}`);
});

req.on('error', e => console.error('Error:', e));
req.write(payload);
req.end();
