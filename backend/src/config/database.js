const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    
    if(!mongoUri){
      throw new Error('MONGO_URI n\'est pas défini dans .env');
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connecté avec succès");
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;