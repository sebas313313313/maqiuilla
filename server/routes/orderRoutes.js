const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

// Ruta pública (crear orden)
router.post('/', createOrder);

// Rutas protegidas (admin)
router.get('/stats/summary', protect, isAdmin, getOrderStats);
router.get('/', protect, isAdmin, getOrders);
router.get('/:id', protect, isAdmin, getOrderById);
router.put('/:id', protect, isAdmin, updateOrderStatus);
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router;
