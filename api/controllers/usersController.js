const User = require('../models/userModel');
const jwt = require('../services/jwt');

module.exports = {

  /*====================
  Crear una cuenta nueva
  =====================*/
  signUp: async (req, res) => {

    // Datos del body
    const { name, lastname, username, password, role } = await req.body;
    const email = await req.body.email.toLowerCase();

    // Validar que el email y username esten disponibles
    await User.findOne({ email }).exec()
      .then((email) => {
        if (email) {
          return res.status(403).json({ msg: 'El Email ya esta en uso' });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: err });
      });

    await User.findOne({ username }).exec()
      .then((username) => {
        if (username) {
          return res.status(403).json({ msg: 'El Nombre de Usuario ya esta en uso' });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: err });
      });

    // Crea nuevo usuario con los datos del body
    const newUser = await new User({ name, lastname, username, password, email, role });

    // Persistencia del nuevo usuario
    await newUser.save()
      .then(async (user) => {
        const token = await jwt.signToken(user);
        return res.status(201).json({ msg: 'Usuario creado', user, token });
      })
      .catch((err) => {
        return res.status(500).json({ error: err });
      });

  },

  /*===============
  Login de usuario
  ===============*/
  signIn: async (req, res) => {

    // Datos del body
    const { username, password } = await req.body;

    User.findOne({ username }).exec()
      .then(async (user) => {
        if (!user) {
          return res.status(404).json({ msg: 'Nombre de Usuario y/o contraseña incorrectos' });
        }

        if (user) {
          const isMatch = await user.isValidPassword(password);

          if (!isMatch) {
            return res.status(404).json({ msg: 'Nombre de Usuario y/o contraseña incorrectos' });
          }

          const token = await jwt.signToken(user);

          res.status(200).json({ msg: 'Login satisfactorio', token });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: err });
      });

  }

}