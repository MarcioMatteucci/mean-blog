const jwt = require('../services/jwt');

module.exports = {
      isAuth: async (req, res, next) => {

            // Saca el token del header de la request
            const token = await req.headers.authorization.split(" ")[1];

            // Pasa el token y ve como se resuelve la promesa
            await jwt.verifyToken(token)
                  .then(response => {
                        req.user = response;
                        next()
                  })
                  .catch(response => {
                        res.status(response.status).json({ success: false, msg: response.message });
                  });
      },

      isAdmin: async (req, res, next) => {

            const token = await req.headers.authorization.split(" ")[1];

            await jwt.verifyAdminToken(token)
                  .then(response => {
                        req.user = response;
                        next()
                  })
                  .catch(response => {
                        res.status(response.status).json({ success: false, msg: response.message });
                  })

      }

}