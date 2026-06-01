const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
  },
  features: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['Labiales', 'Ojos', 'Rostro', 'Accesorios', 'Uñas', 'Skincare'],
  },
  image: {
    type: String,
    default: '',
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Índice para búsquedas por categoría
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ active: 1 });

module.exports = mongoose.model('Product', productSchema);
