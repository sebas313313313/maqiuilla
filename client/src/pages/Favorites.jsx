import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { FavoritesContext } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`/api/products?limit=100&ids=${favorites.join(',')}`);
        // As the response has { products, page, pages, total }
        // Let's filter locally just in case to match the exact favorites (though the query does it)
        const fetchedProducts = response.data.products || [];
        setProducts(fetchedProducts.filter(p => favorites.includes(p._id)));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest animate-pulse">
          Buscando tus favoritos...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#F3E8F0]/50 pb-8">
        <div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors mb-4 bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full text-sm">
            <ArrowLeft className="w-4 h-4" /> Seguir explorando
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dark flex items-center gap-3">
            Tus Favoritos <Heart className="w-8 h-8 text-red-500 fill-red-500 animate-pulse" />
          </h1>
          <p className="text-gray-500 mt-3 text-lg max-w-2xl">
            Tu lista de deseos personal. Los cosméticos que te enamoraron, guardados aquí para cuando decidas llevarlos contigo.
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[3rem] border border-[#F3E8F0]/40 shadow-sm max-w-3xl mx-auto">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-red-300" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-dark mb-4">
            Tu lista de deseos está vacía
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Aún no has guardado ningún producto. Explora nuestro catálogo y presiona el corazón en los productos que más te gusten para guardarlos aquí.
          </p>
          <Link
            to="/shop"
            className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Descubrir Cosméticos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onViewProduct={setSelectedProduct} 
            />
          ))}
        </div>
      )}

      {/* Product Modal for Quick View */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default Favorites;
