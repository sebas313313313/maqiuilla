const express = require('express');
const router = express.Router();
const { loginUser, getMe, registerUser } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/register', protect, isAdmin, registerUser);

// RUTA TEMPORAL PARA CREAR ADMIN EN LA NUBE
router.get('/temp-seed', async (req, res) => {
  const User = require('../models/User');
  try {
    await User.deleteMany({});
    await User.create({
      name: 'Admin Lirio',
      email: 'admin@lirio.com',
      password: 'lirio2026',
      role: 'admin'
    });
    res.send('<h1>✅ Cuenta Administradora Creada en la Nube con Exito! Ya puedes iniciar sesion.</h1>');
  } catch (error) {
    res.send('Error: ' + error.message);
  }
});

module.exports = router;
