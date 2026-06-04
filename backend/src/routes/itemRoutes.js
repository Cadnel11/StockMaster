const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { validateItem, validateId, validateStockMovement } = require('../validators/itemValidator');
const { protect, adminOnly } = require('../middlewares/auth');

// Routes publiques (protégées par authentification simple)
router.get('/', protect, itemController.getAllItems);
router.get('/:id', protect, validateId, itemController.getItemById);
router.get('/:id/history', protect, validateId, itemController.getItemHistory);

// Routes réservées à l'ADMIN
router.post('/', protect, adminOnly, validateItem, itemController.createItem);
router.put('/:id', protect, adminOnly, validateId, validateItem, itemController.updateItem);
router.delete('/:id', protect, adminOnly, validateId, itemController.deleteItem);

// Routes pour Admin et Employé (ajustement stock)
router.patch('/:id/add', protect, validateStockMovement, itemController.addStock);
router.patch('/:id/remove', protect, validateStockMovement, itemController.removeStock);

module.exports = router;