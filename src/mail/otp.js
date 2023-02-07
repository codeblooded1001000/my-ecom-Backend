// const otp = require('otp');
// const secret = 'your_secret_key';
// const token = otp.generate(secret);
// console.log(token);

// const isValid = otp.verify(token, secret);
// console.log(isValid);

const speakeasy = require('speakeasy');
const secret = speakeasy.generateSecret({length: 20});
console.log(secret.base32); // secret key
const token = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32',
});
console.log(token);

const verified = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: `${token}`,
  window: 1, // The number of windows of time to check
});
console.log(verified);

