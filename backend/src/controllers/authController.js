const { validationResult } = require('express-validator');
const authService = require('../services/authServices');

/**
 * Contrôleur pour l'authentification
 */
class AuthController {
  
  /**
   * Inscription
   */
  async register(req, res) {
    console.log('📝 Tentative d\'inscription...');
    
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erreurs de validation:', errors.array());
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const result = await authService.register(req.body);
    console.log('📦 Résultat service:', result);

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Inscription réussie',
      data: result.data
    });
  }

  /**
   * Connexion
   */
  async login(req, res) {
    console.log('🔐 Tentative de connexion...');
    
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (!result.success) {
      return res.status(401).json({
        status: 'error',
        message: result.error
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Connexion réussie',
      data: result.data
    });
  }

  /**
   * Récupérer le profil
   */
  async getProfile(req, res) {
    const result = await authService.getProfile(req.user.id);

    if (!result.success) {
      return res.status(404).json({
        status: 'error',
        message: result.error
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.data
    });
  }
}

module.exports = new AuthController();