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
    const sameEmailUser = await User.findOne({ email });
    if (sameEmailUser) {
      return res.status(403).json({ msg: 'El email está en uso' });
    }

    const sameUsernameUser = await User.findOne({ username });
    if (sameUsernameUser) {
      return res.status(403).json({ msg: 'El nombre de usuario está en uso' });
    }

    // Crea nuevo usuario con los datos del body
    const newUser = await new User({ name, lastname, username, password, email, role });

    // Persistencia del nuevo usuario
    await newUser.save()
      .then(async (user) => {
        const tokenInfo = await jwt.signToken(user);
        return res.status(201).json({ msg: 'Usuario creado', user, tokenInfo });
      })
      .catch(async (err) => {
        console.log(err);
        return res.status(500).json({ msg: 'Hay un error', error: err });
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
          return res.status(404).json({ msg: 'Nombre de usuario y/o contraseña incorrectos' });
        }

        if (user) {
          const isMatch = await user.isValidPassword(password);

          if (!isMatch) {
            return res.status(404).json({ msg: 'Nombre de usuario y/o contraseña incorrectos' });
          }

          const token = await jwt.signToken(user);

          res.status(200).json({ msg: 'Login satisfactorio', token });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: err });
      });

  },

  /*==================
  Chequea el Username
  ===================*/
  checkUsername: async (req, res) => {

    const username = await req.query.username;

    User.findOne({ username }).exec()
      .then(async (user) => {
        if (user) {
          return res.status(200).json({ isUsernameAvailable: false, msg: 'El nombre de usuario está en uso' });
        } else if (!user) {
          return res.status(200).json({ isUsernameAvailable: true, msg: 'El nombre de usario está disponible' });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: err });
      });
  },

  /*================
  Chequea el Email
  =================*/
  checkEmail: async (req, res) => {

    const email = await req.query.email;

    User.findOne({ email }).exec()
      .then(async (user) => {
        if (user) {
          return res.status(200).json({ isEmailAvailable: false, msg: 'El email está en uso' });
        } else if (!user) {
          return res.status(200).json({ isEmailAvailable: true, msg: 'El email está disponible' });
        }
      })
      .catch((err) => {
        return res.status(500).json({ error: err });
      });

  }

}