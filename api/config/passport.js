const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { JWT_SECRET } = require('./config');
const User = require('../models/userModel');

// Jwt Strategy
passport.use(new JwtStrategy({
   jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
   secretOrKey: JWT_SECRET
}, async (jwt_payload, done) => {
   try {
      // Encontrar al usuario especificado en el token
      const user = await User.findById(jwt_payload.sub);
      // Manejo si el user no existe
      if (!user) {
         return done(null, false);
      }
      // Si va bien retorno el user
      done(null, user);

   } catch (err) {
      done(err, false);
   }
}));

// Local Strategy
passport.use(new LocalStrategy({
   usernameField: 'username'
}, async (username, password, done) => {
   try {
      // Encontrar el usuario por username
      const user = await User.findOne({ username });

      // Manejo si no encuentra el usuario
      if (!user) {
         return done(null, false);
      }

      // Validar que la password sea correcta
      const isMatch = await user.isValidPassword(password);

      // Manejo si la password no es correcta
      if (!isMatch) {
         return done(null, false);
      }

      // Si todo va bien retonar el usuario
      done(null, user);

   } catch (err) {
      done(err, false);
   }

}));