const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const User = require('./models/User');
const Product = require('./models/Product');
const Announcement = require('./models/Announcement');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Crear admin por defecto
    const adminExists = await User.findOne({ email: 'admin@lirio.com' });
    if (!adminExists) {
      await User.create({
        name: 'Administrador Lirio',
        email: 'admin@lirio.com',
        password: 'lirio2026',
        role: 'admin',
      });
      console.log('👤 Admin creado: admin@lirio.com / lirio2026');
    } else {
      console.log('👤 Admin ya existe');
    }

    // Crear productos de ejemplo
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const products = [
        {
          name: 'Labial Matte Velvet Rose',
          description: 'Labial de larga duración con acabado mate aterciopelado. Color intenso que no transfiere. Fórmula hidratante con vitamina E.',
          price: 35000,
          category: 'Labiales',
          stock: 25,
          featured: true,
          active: true,
        },
        {
          name: 'Paleta de Sombras Sunset Dreams',
          description: '12 tonos cálidos desde dorados hasta burgundy. Acabados mate, shimmer y glitter. Altamente pigmentada y blendeable.',
          price: 65000,
          category: 'Ojos',
          stock: 15,
          featured: true,
          active: true,
        },
        {
          name: 'Base Líquida Full Coverage',
          description: 'Base de cobertura total con SPF 30. Acabado natural que dura hasta 24 horas. Disponible en 20 tonos.',
          price: 48000,
          category: 'Rostro',
          stock: 30,
          featured: true,
          active: true,
        },
        {
          name: 'Set de Brochas Professional Pink',
          description: 'Set de 12 brochas profesionales con mango de oro rosa. Cerdas sintéticas ultra suaves. Incluye estuche de viaje.',
          price: 85000,
          category: 'Accesorios',
          stock: 10,
          featured: true,
          active: true,
        },
        {
          name: 'Máscara de Pestañas Volume Extreme',
          description: 'Máscara waterproof con cepillo curvo para máximo volumen y curvatura. No apelmaza ni deja grumos.',
          price: 28000,
          category: 'Ojos',
          stock: 40,
          featured: false,
          active: true,
        },
        {
          name: 'Delineador Líquido Precision',
          description: 'Delineador de punta fina para trazos precisos. Secado rápido, resistente al agua. Color negro intenso.',
          price: 22000,
          category: 'Ojos',
          stock: 35,
          featured: false,
          active: true,
        },
        {
          name: 'Polvo Compacto HD Finish',
          description: 'Polvo translúcido de alta definición. Controla el brillo sin resecar. Efecto foto-ready.',
          price: 32000,
          category: 'Rostro',
          stock: 20,
          featured: false,
          active: true,
        },
        {
          name: 'Esmalte Gel Effect Cherry Blossom',
          description: 'Esmalte con efecto gel sin necesidad de lámpara UV. Secado rápido en 60 segundos. Duración de hasta 7 días.',
          price: 15000,
          category: 'Uñas',
          stock: 50,
          featured: false,
          active: true,
        },
        {
          name: 'Sérum Facial Vitamina C',
          description: 'Sérum iluminador con 20% de vitamina C pura. Reduce manchas oscuras y unifica el tono. Textura ligera de rápida absorción.',
          price: 55000,
          category: 'Skincare',
          stock: 18,
          featured: true,
          active: true,
        },
        {
          name: 'Lip Gloss Crystal Shine',
          description: 'Gloss labial con acabado espejo ultra brillante. No pegajoso, hidrata con ácido hialurónico. Aroma a vainilla.',
          price: 25000,
          category: 'Labiales',
          stock: 30,
          featured: false,
          active: true,
        },
        {
          name: 'Corrector Líquido Bright Eyes',
          description: 'Corrector de ojeras de alta cobertura. Ilumina y corrige imperfecciones. Fórmula con cafeína para desinflar.',
          price: 27000,
          category: 'Rostro',
          stock: 22,
          featured: false,
          active: true,
        },
        {
          name: 'Esponja Beauty Blender Rosa',
          description: 'Esponja de maquillaje de microfibra premium. Aplicación impecable sin absorber producto. Libre de látex.',
          price: 18000,
          category: 'Accesorios',
          stock: 45,
          featured: false,
          active: true,
        },
      ];

      await Product.insertMany(products);
      console.log(`📦 ${products.length} productos de ejemplo creados`);
    } else {
      console.log(`📦 Ya existen ${productCount} productos`);
    }

    // Crear anuncios de ejemplo
    const announcementCount = await Announcement.countDocuments();
    if (announcementCount === 0) {
      await Announcement.insertMany([
        {
          title: '🌺 ¡Gran Apertura Lirio Store! 20% de descuento en todo',
          description: 'Celebra con nosotras la apertura de nuestra tienda online. Usa el código LIRIO20 en tu primer pedido.',
          active: true,
        },
        {
          title: '💄 Nuevos Labiales Matte - Colección Lirio',
          description: 'Descubre los 8 nuevos tonos de nuestra colección exclusiva. Colores vibrantes y fórmula de larga duración.',
          active: true,
        },
      ]);
      console.log('📢 Anuncios de ejemplo creados');
    }

    console.log('\n✅ Seed completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    process.exit(1);
  }
};

seedDB();
