import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Home, LogOut, Flower2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { getCartCount } = useContext(CartContext);
  const { isAuthenticated, logout, admin } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary font-semibold' : 'text-dark hover:text-primary transition-colors duration-300';
  };

  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-secondary/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/lirio-logo.png" alt="Lirio Store" className="h-12 w-auto object-contain" />
          <span className="font-serif text-xl font-bold tracking-wider text-dark">Lirio <span className="text-sm font-sans text-primary font-bold bg-primary/10 px-2 py-1 rounded-md ml-1">Panel Admin</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hola, {admin?.name || 'Administradora'}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-sm bg-primary/10 hover:bg-primary hover:text-white text-primary-dark px-3 py-1.5 rounded-full transition-all duration-300 font-medium"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#FDF6FA]/90 backdrop-blur-md border-b border-[#F3E8F0]/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <img src="/lirio-logo.png" alt="Lirio Store Logo" className="h-10 sm:h-12 md:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl font-bold tracking-wider text-[#1A1A2E] relative">
                  LIRIO
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full"></span>
                </span>
                <span className="text-[9px] font-semibold tracking-[0.3em] text-primary-dark uppercase">Store</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Inicio</Link>
            <Link to="/shop" className={isActive('/shop')}>Tienda</Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2.5 bg-primary/5 hover:bg-primary/10 rounded-full transition-all duration-300 group">
              <ShoppingBag className="w-5 h-5 text-dark group-hover:text-primary transition-colors duration-300" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FDF6FA] shadow-sm animate-bounce">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Admin Access Icon */}
            {isAuthenticated && (
              <Link to="/admin/dashboard" className="flex items-center gap-1.5 bg-accent/10 hover:bg-accent/20 text-accent font-medium px-4 py-2 rounded-full transition-all duration-300">
                <User className="w-4 h-4" /> Panel
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Cart Icon (always visible) */}
            <Link to="/cart" className="relative p-2.5 bg-primary/5 rounded-full">
              <ShoppingBag className="w-5 h-5 text-dark" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FDF6FA]">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-dark hover:text-primary focus:outline-none transition-colors duration-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#FDF6FA] border-b border-[#F3E8F0]/60 shadow-lg py-4 px-6 flex flex-col space-y-4 animate-fade-in z-50">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-lg font-medium text-dark border-b border-[#F3E8F0]/30 pb-2"
          >
            <Home className="w-5 h-5 text-primary" /> Inicio
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-lg font-medium text-dark border-b border-[#F3E8F0]/30 pb-2"
          >
            <ShoppingBag className="w-5 h-5 text-primary" /> Tienda
          </Link>
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-lg font-medium text-dark border-b border-[#F3E8F0]/30 pb-2"
          >
            <ShoppingBag className="w-5 h-5 text-primary" /> Ver Carrito ({getCartCount()})
          </Link>
          {isAuthenticated && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-lg font-medium text-accent pt-2"
            >
              <User className="w-5 h-5" /> Ir al Panel Administrador
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
