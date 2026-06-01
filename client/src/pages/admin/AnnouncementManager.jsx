import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Bell, X, Check, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/announcements/admin/all');
      setAnnouncements(res.data);
    } catch (error) {
      console.error('Error fetching admin announcements:', error);
      toast.error('Error al cargar anuncios de la tienda');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setTitle('');
    setDescription('');
    setActive(true);
    setExpiresAt('');
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (ann) => {
    setEditingAnnouncement(ann);
    setTitle(ann.title);
    setDescription(ann.description || '');
    setActive(ann.active);
    setExpiresAt(ann.expiresAt ? new Date(ann.expiresAt).toISOString().substring(0, 10) : '');
    setImageFile(null);
    setImagePreview(ann.image || '');
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
    if (!window.confirm('¿Estás segura de que deseas eliminar permanentemente este anuncio promocional?')) return;

    try {
      await axios.delete(`/api/announcements/${id}`);
      toast.success('Anuncio eliminado exitosamente');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('No se pudo eliminar el anuncio');
    }
  };

  const handleToggleActive = async (ann) => {
    try {
      await axios.put(`/api/announcements/${ann._id}`, { active: !ann.active });
      toast.success(`Anuncio ${!ann.active ? 'activado' : 'desactivado'} con éxito`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement active status:', error);
      toast.error('No se pudo actualizar el estado');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      toast.error('Por favor ingresa un título de anuncio');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('active', active);
    if (expiresAt) {
      formData.append('expiresAt', expiresAt);
    }

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingAnnouncement) {
        await axios.put(`/api/announcements/${editingAnnouncement._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('¡Anuncio actualizado exitosamente! 📢');
      } else {
        await axios.post('/api/announcements', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('¡Anuncio promocional creado! 🌟');
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error(error.response?.data?.message || 'Error al guardar el anuncio');
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full text-left">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-dark">Gestión de Anuncios</h1>
          <p className="text-gray-500 text-sm">Crea promociones y alertas en banner que los compradores verán en la portada de Lirio Store.</p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-md shadow-primary/20 flex items-center gap-2 text-sm shrink-0"
        >
          <Plus className="w-5 h-5" /> Publicar Anuncio
        </button>
      </div>

      {/* Grid view of announcements */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 w-full gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-xs font-semibold tracking-wider">Cargando anuncios...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#F3E8F0]/40 rounded-[2rem] p-10 flex flex-col items-center gap-4">
          <span className="text-4xl">📢</span>
          <h3 className="font-serif text-xl font-bold text-dark">No hay anuncios publicados</h3>
          <p className="text-gray-500 text-sm max-w-xs">Comparte códigos de descuento, novedades o avisos de stock.</p>
          <button onClick={openCreateModal} className="bg-primary text-white font-semibold px-6 py-2.5 rounded-full text-sm mt-2">
            Crear mi primer anuncio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className={`bg-white border ${
                ann.active ? 'border-primary/30 shadow-md shadow-primary/5' : 'border-gray-150'
              } rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between gap-6 hover:shadow-md transition-all duration-300 text-left`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ann.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {ann.active ? 'Activo' : 'Inactivo'}
                    </span>
                    {ann.expiresAt && (
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">
                        Expira: {new Date(ann.expiresAt).toLocaleDateString('es-CO')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-dark text-lg sm:text-xl leading-snug">
                    {ann.title}
                  </h3>
                  {ann.description && (
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-1">
                      {ann.description}
                    </p>
                  )}
                </div>

                {/* Banner Thumbnail (optional) */}
                {ann.image && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    <img src={ann.image} alt={ann.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleToggleActive(ann)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-all duration-300 ${
                     ann.active ? 'text-success' : 'text-gray-400 hover:text-primary'
                  }`}
                  title={ann.active ? 'Desactivar anuncio' : 'Activar anuncio'}
                >
                  {ann.active ? (
                    <>
                      <ToggleRight className="w-6 h-6" /> Publicado
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-6 h-6" /> Pausado
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(ann)}
                    className="p-2 bg-gray-50 hover:bg-primary/10 text-gray-500 hover:text-primary rounded-xl transition-all duration-300"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ann._id)}
                    className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-red-500 rounded-xl transition-all duration-300"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Creation / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-[#F3E8F0]/40 w-full max-w-xl p-8 sm:p-10 shadow-2xl flex flex-col gap-6 animate-fade-in text-left">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-serif text-2xl font-bold text-dark">
                {editingAnnouncement ? 'Editar Anuncio' : 'Nuevo Anuncio'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-dark transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Promo title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Título del Anuncio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 🌺 ¡Gran Apertura Lirio Store! 20% de descuento en todo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detalles / Código (Opcional)</label>
                <textarea
                  placeholder="Ej. Celebra con nosotras e ingresa el cupón LIRIO20 en tu checkout..."
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark resize-none"
                />
              </div>

              {/* Expiration date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha de Expiración (Opcional)</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none text-dark"
                />
              </div>

              {/* Image upload (optional) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Imagen del Banner (Opcional)</label>
                <div className="flex items-center gap-4 border border-dashed border-[#F3E8F0] rounded-3xl p-5 bg-[#FDF6FA]/40">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#F3E8F0]/20 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className="text-[10px] text-gray-500">Formato JPG, PNG, WEBP. Máx 5MB.</span>
                    <input
                      type="file"
                      accept="image/*"
                      id="announcement-image-upload"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="announcement-image-upload"
                      className="cursor-pointer bg-white hover:bg-gray-50 border border-[#F3E8F0] text-dark text-xs font-bold px-3 py-2 rounded-lg transition-all duration-300 shadow-sm"
                    >
                      Elegir Imagen
                    </label>
                  </div>
                </div>
              </div>

              {/* Active Toggle Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none py-2 border-b border-gray-100">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded text-primary border-[#F3E8F0] focus:ring-primary w-4.5 h-4.5"
                />
                <span className="text-sm font-semibold text-dark">
                  Publicar inmediatamente (Activar)
                </span>
              </label>

              {/* CTAs */}
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
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all duration-300 shadow-md shadow-primary/20"
                >
                  {editingAnnouncement ? 'Guardar Cambios' : 'Publicar Anuncio'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManager;
