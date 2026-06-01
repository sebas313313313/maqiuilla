import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ShoppingCart, Minus, Plus, Star, Heart, Flower2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const cartItem = product ? cartItems.find(item => item.product === product._id) : null;
  const currentQtyInCart = cartItem ? cartItem.quantity : 0;
  const availableToAdd = product ? product.stock - currentQtyInCart : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error al cargar producto:', error);
        toast.error('Producto no encontrado');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

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
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 w-full gap-3">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest animate-pulse">Cargando cosmético...</p>
      </div>
    );
  }

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price);

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">

      {/* Back button */}
      <div className="text-left mb-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors duration-300 text-sm font-semibold"
        >
          <ChevronLeft className="w-5 h-5" /> Regresar a la boutique
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-[#F3E8F0]/40 rounded-[3rem] p-6 sm:p-12 shadow-sm">

        {/* Product Image Area */}
        <div className="lg:col-span-6 flex items-center justify-center relative bg-gray-50 rounded-[2.5rem] overflow-hidden aspect-square border border-gray-100">
          {product.featured && (
            <span className="absolute top-6 left-6 z-10 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5">
              Favorito del Mes <Star className="w-4 h-4" />
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute top-6 left-6 z-10 bg-gray-600/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm">
              Agotado Temporalmente
            </span>
          )}

          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover max-h-[500px]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#F3E8F0] to-[#C4638A]/30 flex items-center justify-center">
              <span className="font-serif text-primary text-8xl font-light italic">Lirio</span>
            </div>
          )}
        </div>

        {/* Product Details Area */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-primary-dark uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full w-fit">
              {product.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-dark leading-snug">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-4 py-3 border-y border-[#F3E8F0]/30">
            <span className="font-serif text-3xl font-black text-primary-dark tracking-tight">
              {formattedPrice}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${isOutOfStock ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
              }`}>
              {isOutOfStock ? 'Agotado' : `¡En stock! (${product.stock} disponibles)`}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-dark text-sm tracking-wide">Descripción del Producto</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-col gap-2 bg-[#FDF6FA] border border-[#F3E8F0]/40 rounded-3xl p-5">
            <h4 className="text-xs font-bold text-primary-dark uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-4 h-4" /> Detalles Lirio
            </h4>
            <ul className="text-xs text-gray-500 flex flex-col gap-1.5 mt-1.5 list-disc list-inside">
              <li>Formulación hipoalergénica probada dermatológicamente.</li>
              <li>Cruelty-Free (libre de crueldad animal) certificado.</li>
              <li>Excelente fijación y pigmentación intensa.</li>
            </ul>
          </div>

          {/* Add to cart actions */}
          {!isOutOfStock && (
            <div className="flex flex-wrap items-center gap-4 mt-4">
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
                      className="p-2 text-gray-500 hover:text-primary transition-colors duration-300 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-5 text-base text-dark font-black min-w-[30px] text-center">
                      {quantity}
                    </span>
                    <button
                      disabled={quantity >= availableToAdd}
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-500 hover:text-primary transition-colors duration-300 disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-grow bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-3xl transition-all duration-300 shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="w-5 h-5" /> Agregar a mi Bolsa
                  </motion.button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
