import React, { useState, useContext, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, Star, X, Flower2, Heart, Flame } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductModal = ({ product, onClose }) => {
  const { addToCart, cartItems } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const [quantity, setQuantity] = useState(1);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  if (!product) return null;

  const cartItem = cartItems.find(item => item.product === product._id);
  const currentQtyInCart = cartItem ? cartItem.quantity : 0;
  const availableToAdd = product.stock - currentQtyInCart;

  const handleAddToCart = () => {
    if (quantity > availableToAdd) {
      toast.error(`Solo puedes agregar ${availableToAdd} unidades más.`);
      return;
    }

    addToCart(product, quantity);
    toast.success(`¡${quantity}x ${product.name} agregado(s) al carrito!`, {
      style: {
        border: '1px solid #C4638A',
        padding: '16px',
        color: '#1A1A2E',
        background: '#FDF6FA',
      },
    });
    setQuantity(1);
    onClose(); // Optional: Close modal after adding to cart
  };

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price);

  const isOutOfStock = product.stock <= 0;

  // Procesar las características (features) para mostrarlas como lista
  const featureList = product.features 
    ? product.features.split('\n').filter(f => f.trim() !== '')
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white border border-[#F3E8F0]/40 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-md hover:bg-white text-gray-500 hover:text-primary p-2.5 rounded-full transition-colors duration-300 shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8 md:p-10">
              
              {/* Product Image Area */}
              <div className="flex items-center justify-center relative bg-gray-50 rounded-[2.5rem] overflow-hidden aspect-square border border-gray-100">
                {product.featured && (
                  <span className="absolute top-6 left-6 z-10 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5">
                    Tendencia <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  </span>
                )}
                {isOutOfStock && (
                  <span className="absolute top-6 left-6 z-10 bg-gray-600/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                    Agotado
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
                  className="absolute top-6 right-6 z-10 p-3 bg-white/80 backdrop-blur-md hover:bg-white text-gray-500 hover:text-red-500 rounded-full transition-all duration-300 shadow-sm group/heart"
                >
                  <Heart 
                    className={`w-6 h-6 transition-colors duration-300 ${isFavorite(product._id) ? 'text-red-500 fill-red-500' : 'group-hover/heart:text-red-500 group-hover/heart:fill-red-100'}`} 
                  />
                </button>

                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#F3E8F0] to-[#C4638A]/30 flex items-center justify-center">
                    <span className="font-serif text-primary text-6xl font-light italic">Lirio</span>
                  </div>
                )}
              </div>

              {/* Product Details Area */}
              <div className="flex flex-col justify-center text-left gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-primary-dark uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full w-fit">
                    {product.category}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark leading-snug">
                    {product.name}
                  </h2>
                </div>

                <div className="flex items-baseline gap-4 py-3 border-y border-[#F3E8F0]/30">
                  <span className="font-serif text-3xl font-black text-primary-dark tracking-tight">
                    {formattedPrice}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${isOutOfStock ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                    {isOutOfStock ? 'Agotado' : `¡En stock! (${product.stock} disponibles)`}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-dark text-sm tracking-wide">Descripción</h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Highlights (Dynamic Features) */}
                {featureList.length > 0 && (
                  <div className="flex flex-col gap-2 bg-[#FDF6FA] border border-[#F3E8F0]/40 rounded-3xl p-5">
                    <h4 className="text-xs font-bold text-primary-dark uppercase tracking-wider flex items-center gap-1.5">
                      <Star className="w-4 h-4" /> Detalles Lirio
                    </h4>
                    <ul className="text-xs text-gray-600 flex flex-col gap-2 mt-2 list-disc list-inside">
                      {featureList.map((feature, idx) => (
                        <li key={idx} className="leading-snug">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add to cart actions */}
                {!isOutOfStock && (
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    {availableToAdd <= 0 ? (
                      <div className="w-full bg-orange-50 text-orange-600 font-bold p-4 rounded-2xl text-sm text-center border border-orange-100">
                        Has alcanzado el límite máximo de este producto en tu carrito ({product.stock} unidades).
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center border border-[#F3E8F0] rounded-2xl bg-[#FDF6FA] p-1.5">
                          <button
                            disabled={quantity <= 1}
                            onClick={() => setQuantity(quantity - 1)}
                            className="p-2.5 text-gray-500 hover:text-primary transition-colors duration-300 disabled:opacity-30"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 text-base text-dark font-black min-w-[30px] text-center">
                            {quantity}
                          </span>
                          <button
                            disabled={quantity >= availableToAdd}
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-2.5 text-gray-500 hover:text-primary transition-colors duration-300 disabled:opacity-30"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAddToCart}
                          className="flex-grow bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-sm"
                        >
                          <ShoppingCart className="w-5 h-5" /> Añadir
                        </motion.button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
