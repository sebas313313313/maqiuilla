import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Heart, Flame } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onViewProduct }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const [quantity, setQuantity] = useState(1);

  const cartItem = cartItems.find(item => item.product === product._id);
  const currentQtyInCart = cartItem ? cartItem.quantity : 0;
  const availableToAdd = product.stock - currentQtyInCart;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantity > availableToAdd) {
      toast.error(`Solo puedes agregar ${availableToAdd} unidades más.`);
      return;
    }

    addToCart(product, quantity);
    toast.success(`¡${quantity}x ${product.name} agregado al carrito!`, {
      style: {
        border: '1px solid #C4638A',
        padding: '16px',
        color: '#1A1A2E',
        background: '#FDF6FA',
        fontFamily: 'Poppins, sans-serif',
      },
      iconTheme: {
        primary: '#C4638A',
        secondary: '#FDF6FA',
      },
    });
    setQuantity(1);
  };

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price);

  const isOutOfStock = product.stock <= 0;

  // Elegante gradiente de color por defecto en caso de no haber subido imagen aún
  const defaultPlaceholderGradient = 'bg-gradient-to-tr from-[#F3E8F0] to-[#C4638A]/30';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-3xl overflow-hidden border border-[#F3E8F0]/40 shadow-sm hover:shadow-md flex flex-col h-full group"
    >
      <div onClick={() => onViewProduct && onViewProduct(product)} className="block relative aspect-square overflow-hidden bg-gray-50 shrink-0 cursor-pointer">
        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <span className="absolute top-4 left-4 z-10 bg-gray-600/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
            Agotado
          </span>
        )}
        {/* Featured Badge */}
        {product.featured && !isOutOfStock && (
          <span className="absolute top-4 left-4 z-10 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            Tendencia <Flame className="w-3 h-3 text-yellow-300 fill-yellow-300" />
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product);
          }}
          title={isFavorite(product._id) ? "Agregado a favoritos" : "Agregar a favoritos"}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/80 backdrop-blur-md hover:bg-white text-gray-500 hover:text-red-500 rounded-full transition-all duration-300 shadow-sm group/heart"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-300 ${isFavorite(product._id) ? 'text-red-500 fill-red-500' : 'group-hover/heart:text-red-500 group-hover/heart:fill-red-100'}`} 
          />
        </button>

        {/* Product Image */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentNode.className += ` ${defaultPlaceholderGradient} flex items-center justify-center`;
              e.target.style.display = 'none';
              const span = document.createElement('span');
              span.className = 'font-serif text-primary text-xl font-semibold';
              span.innerText = product.name[0];
              e.target.parentNode.appendChild(span);
            }}
          />
        ) : (
          <div className={`w-full h-full ${defaultPlaceholderGradient} flex items-center justify-center`}>
            <span className="font-serif text-primary text-4xl font-light italic">LS</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-medium text-primary-dark uppercase tracking-widest mb-1.5">
          {product.category}
        </span>
        <button onClick={() => onViewProduct && onViewProduct(product)} className="hover:text-primary transition-colors duration-300 text-left">
          <h3 className="font-serif text-lg font-bold text-dark mb-2 line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </button>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#F3E8F0]/30">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 block font-medium">Precio</span>
            <span className="font-serif text-xl font-black text-dark tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-[10px] text-primary-dark font-bold mt-0.5">
              Stock: {product.stock}
            </span>
          </div>

          {isOutOfStock ? (
            <button
              disabled
              className="bg-gray-100 text-gray-400 p-3 rounded-full cursor-not-allowed"
              title="Agotado"
            >
              <Plus className="w-5 h-5" />
            </button>
          ) : availableToAdd <= 0 ? (
            <span className="text-xs font-bold text-gray-400 px-2 text-center leading-tight">
              Límite<br />alcanzado
            </span>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2" onClick={(e) => e.preventDefault()}>
              <div className="flex items-center border border-[#F3E8F0] rounded-xl bg-[#FDF6FA] overflow-hidden">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.max(1, q - 1)); }}
                  className="p-1.5 text-gray-500 hover:text-primary transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-1 text-xs text-dark font-bold min-w-[16px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(q => Math.min(availableToAdd, q + 1)); }}
                  className="p-1.5 text-gray-500 hover:text-primary transition-colors disabled:opacity-30"
                  disabled={quantity >= availableToAdd}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary-dark text-white p-2.5 rounded-xl transition-colors duration-300 shadow-sm shadow-primary/20 flex items-center justify-center"
                title="Añadir al carrito"
              >
                <ShoppingCart className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
