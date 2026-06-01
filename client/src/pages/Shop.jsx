import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Search, SlidersHorizontal, X, Star } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const categories = ['Labiales', 'Ojos', 'Rostro', 'Accesorios', 'Uñas', 'Skincare'];

  // Leer categorías de la URL en caso de redirecciones desde el Home o Footer
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      setCategory(catParam);
    } else {
      setCategory('');
    }
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit: 9,
          sort,
        });

        if (category) queryParams.append('category', category);
        if (search) queryParams.append('search', search);

        const res = await axios.get(`/api/products?${queryParams.toString()}`);
        setProducts(res.data.products);
        setPages(res.data.pages);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    fetchProducts();
  }, [category, search, sort, page]);

  const handleCategorySelect = (cat) => {
    if (category === cat) {
      setCategory('');
      navigate('/shop');
    } else {
      setCategory(cat);
      navigate(`/shop?category=${cat}`);
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setCategory('');
    setSearch('');
    setSort('newest');
    setPage(1);
    navigate('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">

      {/* Page Header */}
      <div className="text-center mb-12 flex flex-col items-center gap-2">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dark">Boutique Lirio</h1>
        <p className="text-gray-500 text-sm max-w-md leading-relaxed">
          Explora nuestra selección completa de maquillaje y tratamientos cosméticos de alta gama.
        </p>
        <div className="w-12 h-[2px] bg-primary rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Filters Panel - Desktop */}
        <aside className="hidden lg:col-span-3 lg:flex flex-col gap-8 sticky top-28 self-start bg-white p-8 border border-[#F3E8F0]/40 rounded-[2rem] shadow-sm">

          {/* Search Input */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-dark text-sm tracking-wide">Buscar Producto</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej. Labial mate..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-dark text-sm tracking-wide">Colecciones</h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between ${category === cat
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-[#FDF6FA] text-gray-600 hover:bg-primary/10 hover:text-primary-dark'
                    }`}
                >
                  {cat}
                  {category === cat && <span className="text-xs">✕</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Filter */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-dark text-sm tracking-wide">Ordenar Por</h3>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark font-medium"
            >
              <option value="newest">Más Recientes</option>
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
              <option value="name">Alfabético (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(category || search || sort !== 'newest') && (
            <button
              onClick={handleClearFilters}
              className="mt-2 text-center text-xs font-bold text-primary hover:text-primary-dark underline"
            >
              Limpiar todos los filtros
            </button>
          )}
        </aside>

        {/* Mobile Filters Trigger Bar */}
        <div className="lg:hidden flex gap-4 w-full mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none text-dark"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="bg-primary text-white p-3.5 rounded-2xl flex items-center justify-center"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-80 bg-white h-full p-8 flex flex-col gap-6 overflow-y-auto animate-slide-in shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="font-serif text-lg font-bold text-dark">Filtros Lirio</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-gray-500 hover:text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sorting Filter */}
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-dark text-sm">Ordenar Por</h4>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm text-dark font-medium"
                >
                  <option value="newest">Más Recientes</option>
                  <option value="price_asc">Precio: Menor a Mayor</option>
                  <option value="price_desc">Precio: Mayor a Menor</option>
                  <option value="name">Alfabético (A-Z)</option>
                </select>
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-dark text-sm">Colecciones</h4>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { handleCategorySelect(cat); setShowMobileFilters(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${category === cat ? 'bg-primary text-white' : 'bg-[#FDF6FA] text-gray-600'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {(category || search || sort !== 'newest') && (
                <button
                  onClick={() => { handleClearFilters(); setShowMobileFilters(false); }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl text-sm mt-4 transition-all duration-300"
                >
                  Restablecer Filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <section className="lg:col-span-9 flex flex-col gap-10">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 w-full gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider animate-pulse">Cargando catálogo...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-[#F3E8F0]/30 rounded-[2.5rem] p-10">
              <Star className="w-10 h-10 mb-4 text-primary" />
              <h3 className="font-serif text-xl font-bold text-dark mb-2">No se encontraron productos</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Prueba buscando otro término o cambiando los filtros seleccionados.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-md shadow-primary/10 hover:bg-primary-dark transition-all duration-300 text-sm"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              {/* Count of items */}
              <div className="flex justify-between items-center text-left">
                <span className="text-xs text-gray-500 font-medium">
                  Mostrando {products.length} de {total} cosméticos
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} onViewProduct={setSelectedProduct} />
                ))}
              </div>

              {/* Pagination controls */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2.5 mt-8 border-t border-[#F3E8F0]/30 pt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="w-10 h-10 border border-[#F3E8F0]/60 rounded-xl flex items-center justify-center text-dark bg-white hover:bg-primary/10 hover:border-primary transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold"
                  >
                    ‹
                  </button>
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${page === i + 1
                          ? 'bg-primary text-white shadow-sm shadow-primary/25'
                          : 'border border-[#F3E8F0]/60 bg-white hover:bg-primary/10 hover:border-primary text-dark'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                    className="w-10 h-10 border border-[#F3E8F0]/60 rounded-xl flex items-center justify-center text-dark bg-white hover:bg-primary/10 hover:border-primary transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default Shop;
