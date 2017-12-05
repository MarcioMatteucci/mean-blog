const jwt = require('../services/jwt');

module.exports = {
   isAuth: (req, res, next) => {

      const token = req.headers.authorization.split(" ")[1];

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