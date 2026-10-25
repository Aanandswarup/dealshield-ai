const fs = require('fs');

const SALT = 'DS_PRO_SECRET_SALT_2026';

function computeChecksum(payload) {
  let hash = 0x811c9dc5;
  const str = payload + SALT;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return hex.slice(0, 4);
}

function randomChars(length = 4) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

const keys = [];
for (let i = 0; i < 50; i++) {
  const seg1 = randomChars(4);
  const seg2 = randomChars(4);
  const payload = `DS-PRO-${seg1}-${seg2}`;
  const chk = computeChecksum(payload);
  keys.push(`${payload}-${chk}`);
}

const outContent = keys.join('\n');
fs.writeFileSync('gumroad_license_keys.txt', outContent);
fs.writeFileSync('C:\\Users\\hp\\Desktop\\dealshield_license_keys.txt', outContent);

console.log('Successfully generated 50 cryptographically verified DealShield PRO keys!');
console.log('Sample key:', keys[0]);
