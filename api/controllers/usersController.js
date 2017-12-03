const JWT = require('jsonwebtoken');

const User = require('../models/userModel');
const { JWT_SECRET } = require('../config/config');

signToken = (user) => {
  // Crea token
  return token = JWT.sign({
    iss: 'MarcioMatteucci',
    sub: user._id,
    iat: new Date().getTime(), // Current time
    exp: new Date().setDate(new Date().getDate() + 1), // 1 dia hasta que expire el token
  }, JWT_SECRET);
}

module.exports = {
  signUp: async (req, res, next) => {
    // Datos del body
    const { name, lastname, username, password } = await req.body;
    const email = await req.body.email.toLowerCase();

    // Validar que el email y username esten disponibles
    const sameEmailUser = await User.findOne({ email });
    if (sameEmailUser) {
      return res.status(403).json({ success: false, msg: 'El Email ya esta en uso' });
    }
    const sameUsernameUser = await User.findOne({ username });
    if (sameUsernameUser) {
      return res.status(403).json({ success: false, msg: 'El Nombre de Usuario ya esta en uso' });
    }

    // Crea nuevo usuario con los datos del body
    const newUser = await new User({ name, lastname, username, password, email });

    // Persistencia del nuevo usuario
    await newUser.save()
      .then(async (user) => {
        const token = await signToken(user);
        return res.status(201).json({ success: true, msg: 'Usuario creado', user, token })
      })
      .catch((err) => {
        return res.status(500).json({ success: false, msg: err });
      });

  },

  signIn: async (req, res, next) => {
    // Generar el token
    const token = signToken(req.user);
    res.status(200).json({ success: true, msg: 'Nos logeamos!', token: token });
  },

  secret: async (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Llegamos a un ruta con auth!' });
  }
}