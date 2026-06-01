const Announcement = require('../models/Announcement');
const fs = require('fs');
const path = require('path');

// @desc    Obtener anuncios activos
// @route   GET /api/announcements
// @access  Public
const getActiveAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      active: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],
    }).sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener todos los anuncios (admin)
// @route   GET /api/announcements/admin/all
// @access  Private/Admin
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Crear anuncio
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, description, active, expiresAt } = req.body;

    const announcement = await Announcement.create({
      title,
      description: description || '',
      active: active !== undefined ? (active === 'true' || active === true) : true,
      expiresAt: expiresAt || null,
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear anuncio', error: error.message });
  }
};

// @desc    Actualizar anuncio
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Anuncio no encontrado' });
    }

    const { title, description, active, expiresAt } = req.body;

    announcement.title = title || announcement.title;
    announcement.description = description !== undefined ? description : announcement.description;
    announcement.active = active !== undefined ? (active === 'true' || active === true) : announcement.active;
    announcement.expiresAt = expiresAt !== undefined ? expiresAt : announcement.expiresAt;

    if (req.file) {
      if (announcement.image) {
        const oldPath = path.join(__dirname, '..', announcement.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      announcement.image = `/uploads/${req.file.filename}`;
    }

    const updated = await announcement.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar anuncio', error: error.message });
  }
};

// @desc    Eliminar anuncio
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Anuncio no encontrado' });
    }

    if (announcement.image) {
      const imagePath = path.join(__dirname, '..', announcement.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Anuncio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar anuncio', error: error.message });
  }
};

module.exports = {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
