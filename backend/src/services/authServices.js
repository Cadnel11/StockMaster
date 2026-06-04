const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Service pour l'authentification
 */
class AuthService {
  
  /**
   * Générer un token JWT
   */
  generateToken(userId, email, role) {
    return jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7h' }
    );
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData) {
    try {
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return { success: false, error: 'Cet email est déjà utilisé' };
      }

      // Créer l'utilisateur
      const user = new User(userData);
      await user.save();

      // Générer le token
      const token = this.generateToken(user._id, user.email, user.role);

      return {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(email, password) {
    try {
      // Chercher l'utilisateur avec le password (car select: false)
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Vérifier le mot de passe
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Générer le token
      const token = this.generateToken(user._id, user.email, user.role);

      return {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer le profil utilisateur
   */
  async getProfile(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return { success: false, error: 'Utilisateur non trouvé' };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new AuthService();