import React from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Phone, MapPin, Clock, Github } from 'lucide-react';
import { RiInstagramLine, RiFacebookCircleLine } from 'react-icons/ri';

const Footer = () => {
  return (
    <footer className="bg-[#F3E8F0]/40 border-t border-[#F3E8F0]/70 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/lirio-logo.png" alt="Lirio Store Logo" className="h-16 w-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl font-bold tracking-wider text-dark">LIRIO</span>
                <span className="text-[9px] font-semibold tracking-[0.3em] text-primary-dark uppercase">Store</span>
              </div>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tu belleza, nuestra inspiración. Productos de maquillaje premium y skincare de la más alta calidad. Diseñado con amor para mujeres sofisticadas de Popayán.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="p-2 bg-white rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                <RiInstagramLine className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                <RiFacebookCircleLine className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-dark mb-5 relative inline-block">
              Navegación
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-primary"></span>
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-primary transition-colors duration-300">Inicio</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary transition-colors duration-300">Tienda de Productos</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors duration-300">Ver Carrito</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-bold text-dark mb-5 relative inline-block">
              Categorías
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-primary"></span>
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              <li>
                <Link to="/shop?category=Labiales" className="hover:text-primary transition-colors duration-300">Labiales</Link>
              </li>
              <li>
                <Link to="/shop?category=Ojos" className="hover:text-primary transition-colors duration-300">Maquillaje de Ojos</Link>
              </li>
              <li>
                <Link to="/shop?category=Rostro" className="hover:text-primary transition-colors duration-300">Rostro y Piel</Link>
              </li>
              <li>
                <Link to="/shop?category=Skincare" className="hover:text-primary transition-colors duration-300">Skincare</Link>
              </li>
            </ul>
          </div>

          {/* Popayan Contact info */}
          <div>
            <h3 className="font-serif text-lg font-bold text-dark mb-5 relative inline-block">
              Contacto
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-primary"></span>
            </h3>
            <ul className="flex flex-col gap-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span>Popayán, Cauca, Colombia (Envíos a domicilio en toda la ciudad)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+57 304 286 2082</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span>Lun - Sáb: 8:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#F3E8F0] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Lirio Store. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Desarrollado por</span>
            <a href="https://github.com/sebas313313313" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors font-medium">
              <Github className="w-4 h-4" />
              sebas313313313
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
