import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Flower2, ShoppingCart } from 'lucide-react';
import { RiWhatsappLine } from 'react-icons/ri';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // WhatsApp de Lirio Store
  const LIRIO_WHATSAPP_NUMBER = "573042862082";

  // Formulario de Envío (Barrio, Dirección y Ciudad Popayán requeridos)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    neighborhood: '',
    address: '',
    notes: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(getCartTotal());

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    if (!formData.customerName || !formData.customerPhone || !formData.neighborhood || !formData.address) {
      toast.error('Por favor completa todos los datos de envío requeridos');
      return;
    }

    setLoading(true);

    try {
      // 1. Guardar la orden en la base de datos de MongoDB (MERN Stack funcional)
      const orderPayload = {
        items: cartItems,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        neighborhood: formData.neighborhood,
        address: formData.address,
        city: 'Popayán',
        total: getCartTotal(),
        notes: formData.notes,
      };

      const res = await axios.post('/api/orders', orderPayload);
      const savedOrder = res.data;

      // 2. Generar el mensaje estilizado de WhatsApp
      const itemsList = cartItems
        .map((item) => `• ${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toLocaleString('es-CO')}`)
        .join('\n');

      const message = `🌺 *NUEVO PEDIDO LIRIO STORE* 🌺\n\n` +
        `*Hola Lirio Store, quiero confirmar mi compra:* \n\n` +
        `*🛍️ DETALLE DEL PEDIDO:*\n${itemsList}\n\n` +
        `*💵 TOTAL COMPRA:* $${getCartTotal().toLocaleString('es-CO')} COP\n\n` +
        `*📍 DATOS DE ENVÍO (POPAYÁN):*\n` +
        `• *Cliente:* ${formData.customerName}\n` +
        `• *Teléfono:* ${formData.customerPhone}\n` +
        `• *Barrio:* ${formData.neighborhood}\n` +
        `• *Dirección:* ${formData.address}\n` +
        `• *Ciudad:* Popayán\n` +
        (formData.notes ? `• *Notas/Indicaciones:* ${formData.notes}\n` : '') +
        `\n_Pedido registrado con código: #${savedOrder._id.substring(18)}_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${LIRIO_WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // 3. Limpiar carrito y redirigir
      clearCart();
      toast.success('¡Pedido registrado! Redirigiendo a WhatsApp...');

      // Abrir WhatsApp en una pestaña nueva
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toast.error('Hubo un error al procesar tu pedido. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col justify-center items-center gap-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-bounce">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-dark">Tu carrito está vacío</h2>
        <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
          ¡Aún no has añadido cosméticos a tu bolsa! Explora nuestra tienda y descubre los mejores labiales, bases y polvos.
        </p>
        <Link
          to="/shop"
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-md shadow-primary/20 text-sm"
        >
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="text-center mb-12 flex flex-col items-center gap-2">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-dark">Mi Carrito de Compras</h1>
        <p className="text-gray-500 text-sm">Verifica tus productos y completa los datos de entrega.</p>
        <div className="w-12 h-[2px] bg-primary rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Cart items list */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] border border-[#F3E8F0]/40 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="flex items-center gap-4 sm:gap-6 pb-6 border-b border-[#F3E8F0]/30 last:border-b-0 last:pb-0"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-[#F3E8F0]/20">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#F3E8F0] to-[#C4638A]/30 flex items-center justify-center">
                      <span className="font-serif text-primary-dark text-lg font-bold">LS</span>
                    </div>
                  )}
                </div>

                {/* Info & Quantity controls */}
                <div className="flex-grow flex flex-col gap-1.5 text-left">
                  <h4 className="font-serif font-bold text-dark text-base sm:text-lg leading-snug line-clamp-1">
                    {item.name}
                  </h4>
                  <span className="text-primary-dark font-semibold text-sm">
                    ${item.price.toLocaleString('es-CO')}
                  </span>

                  {/* Quantity adjustment buttons */}
                  <div className="flex items-center gap-3.5 mt-1.5">
                    <div className="flex items-center border border-[#F3E8F0] rounded-xl bg-[#FDF6FA] p-1">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="p-1.5 text-gray-500 hover:text-primary transition-colors duration-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm text-dark font-bold min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="p-1.5 text-gray-500 hover:text-primary transition-colors duration-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-rose-50 rounded-xl transition-all duration-300"
                  title="Eliminar de la bolsa"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-4">
            <Link to="/shop" className="text-primary hover:text-primary-dark font-semibold text-sm flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" /> Seguir agregando maquillaje
            </Link>
          </div>
        </div>

        {/* Shipment Data Form and WhatsApp Checkout */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <form
            onSubmit={handleCheckout}
            className="bg-white rounded-[2.5rem] border border-[#F3E8F0]/40 p-8 shadow-sm flex flex-col gap-6 text-left sticky top-28"
          >
            <h3 className="font-serif text-xl font-bold text-dark pb-3 border-b border-[#F3E8F0]/30">
              Detalle de Entrega
            </h3>

            {/* Customer name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Completo *</label>
              <input
                type="text"
                name="customerName"
                required
                placeholder="Ej. Isabella Gómez"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
              />
            </div>

            {/* Customer phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfono de contacto *</label>
              <input
                type="tel"
                name="customerPhone"
                required
                placeholder="Ej. 300 123 4567"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
              />
            </div>

            {/* Popayan Shipping inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Barrio en Popayán *</label>
                <input
                  type="text"
                  name="neighborhood"
                  required
                  placeholder="Ej. Campo Real"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ciudad *</label>
                <input
                  type="text"
                  readOnly
                  value="Popayán"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-sm text-gray-500 cursor-not-allowed focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección Exacta *</label>
              <input
                type="text"
                name="address"
                required
                placeholder="Ej. Calle 5 # 10 - 24 Apt 302"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
              />
            </div>

            {/* Delivery Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Indicaciones especiales (Opcional)</label>
              <textarea
                name="notes"
                placeholder="Ej. Casa de rejas blancas, llamar al llegar..."
                rows="2"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FDF6FA] border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark resize-none"
              />
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-3 bg-[#F3E8F0]/20 border border-[#F3E8F0]/40 rounded-3xl p-5 mt-2">
              <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                <span>Subtotal</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium text-success">
                <span>Envío (Popayán)</span>
                <span className="flex items-center gap-1">¡Gratis! <Flower2 className="w-3 h-3" /></span>
              </div>
              <div className="h-[1px] bg-[#F3E8F0]/60 my-1" />
              <div className="flex justify-between items-end">
                <span className="font-serif text-base font-bold text-dark">Total</span>
                <span className="font-serif text-2xl font-black text-primary-dark tracking-tight">
                  {formattedTotal}
                </span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] disabled:bg-gray-300 text-white font-bold py-4 rounded-3xl transition-all duration-300 shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <RiWhatsappLine className="text-2xl" /> Confirmar Pedido por WhatsApp
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;
