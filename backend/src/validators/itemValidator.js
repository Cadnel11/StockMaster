const {body, param} = require('express-validator');

const validateItem = [
  body('name')
  .notEmpty().withMessage('Le nom est requis')
  .isLength({min: 2}).withMessage("Le nom doit contenir au moins 2 caractères")
  .trim(),

  body('quantity')
  .notEmpty().withMessage('La quantité est requise')
  .isInt({min: 0}).withMessage('La quantité doit être un nombre entier positif ou nul'),

  body('price')
  .notEmpty().withMessage('Le prix est requis')
  .isFloat({min: 0}).withMessage('Le prix doit être un nombre positif'),

  body('category')
  .notEmpty().withMessage('La catégorie est requise')
  .trim()
];

const validateId = [
  param("id")
  .isMongoId().withMessage('ID invalide')
];

const validateStockMovement = [
  param('id').isMongoId().withMessage('ID invalide'),
  body('quantity').notEmpty().withMessage('La quantité est requise').isInt({min: 1}).withMessage('La quantité doit être un nombre entier positif')
];

module.exports = {validateId, validateItem, validateStockMovement};