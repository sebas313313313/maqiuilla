const express = require('express');
const router = express.Router();
const {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Rutas públicas
router.get('/', getActiveAnnouncements);

// Rutas protegidas (admin)
router.get('/admin/all', protect, isAdmin, getAllAnnouncements);
router.post('/', protect, isAdmin, upload.single('image'), createAnnouncement);
router.put('/:id', protect, isAdmin, upload.single('image'), updateAnnouncement);
router.delete('/:id', protect, isAdmin, deleteAnnouncement);

module.exports = router;
