// Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
   JWT_SECRET: crypto // Cryto-created secret
}