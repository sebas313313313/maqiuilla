const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: String,
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  customerName: {
    type: String,
    required: [true, 'El nombre del cliente es obligatorio'],
    trim: true,
  },
  customerPhone: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true,
  },
  neighborhood: {
    type: String,
    required: [true, 'El barrio es obligatorio'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true,
  },
  city: {
    type: String,
    default: 'Popayán',
    trim: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
