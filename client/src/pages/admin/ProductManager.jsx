import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Eye, Check, X, Star, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Labiales');
  const [stock, setStock] = useState('0');
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['Labiales', 'Ojos', 'Rostro', 'Accesorios', 'Uñas', 'Skincare'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/products/admin/all');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      toast.error('Error al cargar catálogo de productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setFeatures('');
    setPrice('');
    setCategory('Labiales');
    setStock('10');
    setFeatured(false);
    setActive(true);
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setFeatures(product.features || '');
    setPrice(product.price.toString());
    setCategory(product.category);
    setStock(product.stock.toString());
    setFeatured(product.featured);
    setActive(product.active);
    setImageFile(null);
    setImagePreview(product.image || '');
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás segura de que deseas eliminar permanentemente este producto de la tienda?')) return;

    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Producto eliminado de la tienda');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('No se pudo eliminar el producto');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;

    if (!name || !description || !price || !stock) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('features', features);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('featured', featured);
    formData.append('active', active);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('¡Producto actualizado exitosamente! 💄');
      } else {
        await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('¡Producto creado y subido al catálogo! 🌸');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Error al guardar producto');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-dark">Gestión de Productos</h1>
          <p className="text-gray-500 text-sm">Crea, edita o elimina cosméticos y artículos del catálogo de Lirio Store.</p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-md shadow-primary/20 flex items-center gap-2 text-sm shrink-0"
        >
          <Plus className="w-5 h-5" /> Añadir Cosmético
        </button>
      </div>

      {/* Grid or table view */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 w-full gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-xs font-semibold tracking-wider">Cargando catálogo...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#F3E8F0]/40 rounded-[2rem] p-10 flex flex-col items-center gap-4">
          <span className="text-4xl">💄</span>
          <h3 className="font-serif text-xl font-bold text-dark">No hay productos registrados</h3>
          <p className="text-gray-500 text-sm max-w-xs">Comienza subiendo tus primeros labiales, brochas o sérums.</p>
          <button onClick={openCreateModal} className="bg-primary text-white font-semibold px-6 py-2.5 rounded-full text-sm mt-2">
            Añadir mi primer producto
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#F3E8F0]/40 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FDF6FA]/60 text-gray-400 font-bold border-b border-[#F3E8F0]/20 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Imagen</th>
                  <th className="px-6 py-4 text-left">Nombre</th>
                  <th className="px-6 py-4 text-left">Categoría</th>
                  <th className="px-6 py-4 text-left">Precio</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Destacado</th>
                  <th className="px-6 py-4 text-left">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors duration-250">
                    <td className="px-6 py-4 shrink-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-serif text-primary-dark font-black">LS</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark">{product.name}</span>
                        <span className="text-gray-400 text-xs line-clamp-1 max-w-xs">{product.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary/10 text-primary-dark text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-dark">
                      ${product.price.toLocaleString('es-CO')}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-600">
                      {product.stock} unds
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <span className="text-accent font-bold text-xs flex items-center gap-1">
                          <Star className="w-3 h-3" /> Sí
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${product.active ? 'bg-green-400' : 'bg-gray-300'}`} title={product.active ? 'Activo' : 'Inactivo'} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 bg-gray-50 hover:bg-primary/10 text-gray-500 hover:text-primary rounded-xl transition-all duration-300"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-red-500 rounded-xl transition-all duration-300"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-[#F3E8F0]/40 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 sm:p-10 shadow-2xl flex flex-col gap-6 animate-fade-in text-left">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-serif text-2xl font-bold text-dark">
                {editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-dark transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Product name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Labial Matte Velvet Rose"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción Completa *</label>
                <textarea
                  required
                  placeholder="Ej. Labial de larga duración con acabado mate..."
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark resize-none"
                />
              </div>

              {/* Features */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detalles Lirio (Opcional)</label>
                <textarea
                  placeholder="Ej. Formulación hipoalergénica.&#10;Libre de crueldad animal.&#10;Separar cada detalle con una nueva línea."
                  rows="3"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark resize-none"
                />
              </div>

              {/* Category, price, stock fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none text-dark font-medium"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Precio (COP) *</label>
                  <input
                    type="number"
                    required
                    placeholder="35000"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stock (Unidades) *</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Imagen de Referencia</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 border border-dashed border-[#F3E8F0] rounded-3xl p-5 bg-[#FDF6FA]/40">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border border-[#F3E8F0]/20 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className="text-xs text-gray-500">Sube imágenes en formato JPG, PNG, WEBP. Máx 5MB.</span>
                    <input
                      type="file"
                      accept="image/*"
                      id="product-image-upload"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="cursor-pointer bg-white hover:bg-gray-50 border border-[#F3E8F0] text-dark text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm"
                    >
                      Seleccionar Archivo
                    </label>
                  </div>
                </div>
              </div>

              {/* Featured & Active checks */}
              <div className="flex gap-6 mt-2 pb-4 border-b border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-primary border-[#F3E8F0] focus:ring-primary w-4.5 h-4.5"
                  />
                  <span className="text-sm font-semibold text-dark flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent" /> Destacar cosmético en la portada
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded text-primary border-[#F3E8F0] focus:ring-primary w-4.5 h-4.5"
                  />
                  <span className="text-sm font-semibold text-dark">
                    Visible en catálogo de tienda
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3.5 rounded-2xl text-sm transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all duration-300 shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : editingProduct ? (
                    'Guardar Cambios'
                  ) : (
                    'Crear Producto'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
