const jwtService = require('../services/jwt.service');

module.exports = {
      isAuth: async (req, res, next) => {

            // Saca el token del header de la request
            const token = await req.headers.authorization.split(" ")[1];

            // Pasa el token y ve como se resuelve la promesa
            await jwtService.verifyToken(token)
                  .then(response => {
                        req.user = response;
                        next()
                  })
                  .catch(response => {
                        res.status(response.status).json({ msg: response.message });
                  });
      },

      isAdmin: async (req, res, next) => {

            const token = await req.headers.authorization.split(" ")[1];

            await jwtService.verifyAdminToken(token)
                  .then(response => {
                        req.user = response;
                        next()
                  })
                  .catch(response => {
                        res.status(response.status).json({ msg: response.message });
                  })

      }

}