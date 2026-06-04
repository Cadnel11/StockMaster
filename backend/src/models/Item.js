const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom de l'article est requis"],
    trim: true,
    minlength: [2, "Le nom doit contenir au moins 2 caractères"]
  },

  quantity: {
    type: Number,
    required: [true, "La quantité est requise"],
    min: [0, "La quantité ne peut pas être négative"],
    default: 0
  },

  price: {
    type: Number,
    required: [true, "Le prix est requis"],
    min: [0, "Le prix ne peut pas être négatif"],
  },

  category: {
    type: String,
    required: [true, "La catégorie est requise"],
    trim: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }
},
{
  timestamps: true,
},
);

module.exports = mongoose.model("Item", ItemSchema);