const JWT = require('jsonwebtoken');
const moment = require('moment');

const { JWT_SECRET } = require('../../config/config');

module.exports = {
   signToken: (user) => {

      const payload = {
         sub: user._id,
         role: user.role,
         iat: moment().unix(), // Current time
         exp: moment().add(1, 'days').unix() // 1 dia hasta que expire el token
      }

      return JWT.sign(payload, JWT_SECRET);
   },

   verifyToken: (token) => {
      const decoded = new Promise((resolve, reject) => {
         try {
            const payload = JWT.decode(token, JWT_SECRET);

            if (payload.exp <= moment().unix()) {
               reject({
                  status: 401,
                  message: 'Token ha expirado'
               });
            }
            resolve(payload.sub)

         } catch (err) {
            reject({
               status: 500,
               message: 'Token Inválido'
            });
         }
      });

      return decoded
   },

   verifyAdminToken: (token) => {
      const decoded = new Promise((resolve, reject) => {
         try {
            const payload = JWT.decode(token, JWT_SECRET);

            if (payload.exp <= moment().unix()) {
               reject({
                  status: 401,
                  message: 'Token ha expirado'
               });
            }

            if (payload.role !== 'admin') {
               reject({
                  status: 401,
                  message: 'No tienes permiso de Administrador'
               })
            }
            resolve(payload.sub)

         } catch (err) {
            reject({
               status: 500,
               message: 'Token Inválido'
            });
         }
      });

      return decoded

   }
}