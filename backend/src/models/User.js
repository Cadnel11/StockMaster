const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');




const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    },

    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Format d\'email invalide'],
    },

    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      select: false,
    },

    role: {
      type: String,
      enum: ['admin', 'employe'],
      default: 'employe'
    },
  },
  {
    timestamps: true,
  },
);


UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(
    parseInt(process.env.BCRYPT_ROUNDS) || 10
  );

  this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.comparePassword = async function(candidatePassword){
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)