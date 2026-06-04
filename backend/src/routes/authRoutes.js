const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { protect } = require('../middlewares/auth');

// Routes publiques
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Routes protégées
router.get('/profile', protect, authController.getProfile);

module.exports = router;