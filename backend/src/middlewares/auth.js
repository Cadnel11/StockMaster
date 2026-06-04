const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier le token JWT
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Non autorisé. Token manquant.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalide ou expiré'
    });
  }
};

/**
 * Middleware pour vérifier le rôle ADMIN
 */
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Accès refusé. Droits administrateur requis.'
    });
  }
  next();
};

/**
 * Middleware pour vérifier le rôle ADMIN ou EMPLOYE
 */
const adminOrEmploye = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'employe') {
    return res.status(403).json({
      status: 'error',
      message: 'Accès refusé. Authentification requise.'
    });
  }
  next();
};

module.exports = {
  protect,
  adminOnly,
  adminOrEmploye
};