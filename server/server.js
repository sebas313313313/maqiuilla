const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const connectDB = require('./config/db');

// Conectar a MongoDB
connectDB();

const app = express();

// ======================================
// SEGURIDAD: Helmet (Security Headers)
// ======================================
// Helmet configura automáticamente headers como:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: SAMEORIGIN
// - X-XSS-Protection: 1; mode=block
// - Strict-Transport-Security (HSTS)
// - Content-Security-Policy
// - X-Powered-By: removed
app.use(helmet({
  contentSecurityPolicy: false, // Deshabilitado en desarrollo para permitir Vite
  crossOriginEmbedderPolicy: false, // Permite cargar recursos de uploads
}));

// ======================================
// SEGURIDAD: CORS (Cross-Origin Resource Sharing)
// ======================================
const allowedOrigins = [
  'http://localhost:5173',       // Vite dev server
  'http://127.0.0.1:5173',      // Vite dev server (alt)
  process.env.CLIENT_URL,        // URL de producción del frontend
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl, server-side)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por política CORS de Lirio Store'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight por 24 horas
}));

// Middleware de parseo
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Las imágenes se sirven directamente desde Cloudinary ahora

// Rutas API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

  app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'La imagen es muy grande. Máximo 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  }
  
  // Error de CORS
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ message: 'Acceso denegado por política CORS.' });
  }
  
  res.status(500).json({ message: 'Error interno del servidor' });
});

// En local arrancamos el servidor, en Vercel exportamos la app
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🌺 Lirio Store Server corriendo en puerto ${PORT}`);
    console.log(`📦 API: http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend: http://localhost:5173`);
  });
}

module.exports = app;
