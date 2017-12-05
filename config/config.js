// Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
   port: process.env.PORT || 3000,
   localDbUri: 'mongodb://localhost:27017/mean-jwt-blog-db',
   JWT_SECRET: crypto // Cryto-created secret
}