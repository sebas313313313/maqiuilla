import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Heart, Gift, Truck, Eye, Smile, Droplets, Sparkles, Palette, Flower2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AnnouncementBanner from '../components/AnnouncementBanner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Labiales', color: 'from-[#F3E8F0] to-[#C4638A]/40', icon: <Palette className="w-7 h-7" /> },
    { name: 'Ojos', color: 'from-[#F3E8F0] to-[#D4AF37]/30', icon: <Eye className="w-7 h-7" /> },
    { name: 'Rostro', color: 'from-[#C4638A]/20 to-[#D4AF37]/20', icon: <Smile className="w-7 h-7" /> },
    { name: 'Accesorios', color: 'from-[#F3E8F0] to-[#C4638A]/20', icon: <Star className="w-7 h-7" /> },
    { name: 'Uñas', color: 'from-[#C4638A]/30 to-[#D4AF37]/20', icon: <Sparkles className="w-7 h-7" /> },
    { name: 'Skincare', color: 'from-[#FDF6FA] to-[#C4638A]/40', icon: <Droplets className="w-7 h-7" /> },
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/products?featured=true');
        setFeaturedProducts(res.data.products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Promo banner */}
      <AnnouncementBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-tr from-[#FDF6FA] via-[#F3E8F0]/30 to-[#C4638A]/20 py-12 sm:py-20 lg:py-32">
        <div className="absolute top-1/2 left-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary-dark px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" /> Tu Belleza, Nuestra Inspiración
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-dark leading-tight"
            >
              Descubre tu brillo <br />
              <span className="text-primary italic font-normal">con Lirio Store</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl"
            >
              Explora nuestra colección curada de maquillaje premium y skincare. Diseñado para potenciar tu seguridad y hacerte sentir espectacular todos los días. Envíos directos en Popayán.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-4 mt-2"
            >
              <Link
                to="/shop"
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-4 rounded-3xl transition-all duration-300 shadow-md shadow-primary/20 flex items-center gap-2 group"
              >
                Comprar Ahora
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#categories"
                className="bg-white hover:bg-gray-50 text-dark border border-[#F3E8F0] font-semibold px-8 py-4 rounded-3xl transition-all duration-300 flex items-center gap-2"
              >
                Ver Categorías
              </a>
            </motion.div>
          </div>

          {/* Elegant Illustration for Lirio */}
          <div className="lg:col-span-5 hidden lg:flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-80 h-96"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30 rounded-[4rem] rotate-6 border-2 border-white shadow-lg shadow-primary/10" />
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-[4rem] p-8 flex flex-col justify-between items-center text-center shadow-md border border-white/50">
                <div className="flex flex-col items-center justify-center mt-6 gap-3">
                  <img src="/lirio-logo.png" alt="Lirio Store" className="w-48 h-auto object-contain drop-shadow-lg transition-transform duration-700 hover:scale-105" />
                  <h3 className="font-serif text-3xl font-bold text-dark">Lirio Store</h3>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Tus marcas favoritas de maquillaje a la distancia de un click, listas para ser enviadas hasta la puerta de tu casa.
                  </p>
                </div>
                <div className="w-full h-[1px] bg-primary/20 my-2" />
                <div className="flex items-center gap-1.5 text-xs text-primary-dark font-bold tracking-widest uppercase">
                  Belleza de Ensueño <Flower2 className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Strengths */}
      <section className="bg-white py-12 border-y border-[#F3E8F0]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-dark text-sm">Entregas Rápidas</h4>
              <p className="text-gray-500 text-xs">Exclusivo en la ciudad de Popayán.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-dark text-sm">Asesoría de Belleza</h4>
              <p className="text-gray-500 text-xs">Atención personalizada en tu chat de WhatsApp.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-dark text-sm">Empaque Especial</h4>
              <p className="text-gray-500 text-xs">Cada compra va en una hermosa caja de regalo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-gradient-to-b from-white to-[#FDF6FA] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-primary-dark uppercase tracking-widest">Colecciones</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark">
              Explora por Categoría
            </h2>
            <div className="w-16 h-[2px] bg-primary rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={`/shop?category=${cat.name}`}
                  className="group flex flex-col items-center gap-4 p-8 bg-white border border-[#F3E8F0]/40 rounded-[2.5rem] shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 w-full"
                >
                  <div className={`w-16 h-16 rounded-3xl bg-gradient-to-tr ${cat.color} flex items-center justify-center`}>
                    {cat.icon}
                  </div>
                  <span className="font-bold text-dark text-sm group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-bold text-primary-dark uppercase tracking-widest">Nuestras Recomendaciones</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark">
              Los Favoritos de la Tienda
            </h2>
            <div className="w-16 h-[2px] bg-primary rounded-full mt-2" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 w-full">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-gray-400 py-10 flex items-center justify-center gap-2">Pronto tendremos productos destacados para ti <Flower2 className="w-4 h-4" /></p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <Link
            to="/shop"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-sm mt-4"
          >
            Ver Todo el Catálogo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
