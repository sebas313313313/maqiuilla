const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Rutas públicas
router.get('/', getProducts);
router.get('/admin/all', protect, isAdmin, getAllProductsAdmin);
router.get('/:id', getProductById);

// Rutas protegidas (admin)
router.post('/', protect, isAdmin, upload.single('image'), createProduct);
router.put('/:id', protect, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;
