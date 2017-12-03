const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   name: { type: String, required: true },
   lastname: { type: String, required: true },
   username: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   email: { type: String, required: true, unique: true, lowercase: true },

}, { timestamps: true });

// Pre save para hashear la password
userSchema.pre('save', async function (next) {
   try {
      // Generar salt
      const salt = await bcrypt.genSalt(10);
      // Generar password hash (salt + password)
      const passwordHash = await bcrypt.hash(this.password, salt);
      // Reasignar la password hasheada a la password
      this.password = passwordHash;
      next();
   } catch (err) {
      next(err);
   }
});

// Metodo para comparar las passwords
userSchema.methods.isValidPassword = async function (inputPassword) {
   try {
      return await bcrypt.compare(inputPassword, this.password);
   } catch (err) {
      throw new Error(err);
   }
}

const User = mongoose.model('user', userSchema);

module.exports = User;

