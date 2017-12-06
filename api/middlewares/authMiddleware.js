const jwt = require('../services/jwt');

module.exports = {
   isAuth: (req, res, next) => {

      // Saca el token del header de la request
      const token = req.headers.authorization.split(" ")[1];

      // Pasa el token y ve como se resuelve la promesa
      jwt.verifyToken(token)
         .then(response => {
            req.user = response;
            next()
         })
         .catch(response => {
            res.status(response.status).json({ success: false, msg: response.message });
         });
   },

   isAdmin: (req, res, next) => {

      const token = req.headers.authorization.split(" ")[1];

      jwt.verifyAdminToken(token)
         .then(response => {
            req.user = response;
            next()
         })
         .catch(response => {
            res.status(response.status).json({ success: false, msg: response.message });
         })

   }

}