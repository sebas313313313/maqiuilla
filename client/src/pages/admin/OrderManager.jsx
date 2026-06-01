import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, Trash2, MapPin, Phone, AlertCircle, X, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 15,
      });
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }

      const res = await axios.get(`/api/orders?${queryParams.toString()}`);
      setOrders(res.data.orders);
      setPages(res.data.pages);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      toast.error('Error al cargar órdenes de la base de datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/orders/${id}`, { status: newStatus });
      toast.success(`Estado de orden actualizado a ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('No se pudo actualizar el estado');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar permanentemente esta orden del historial?')) return;

    try {
      await axios.delete(`/api/orders/${id}`);
      toast.success('Orden eliminada exitosamente');
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('No se pudo eliminar la orden');
    }
  };

  const handleFilterClick = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-8 w-full text-left">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-dark">Historial de Órdenes</h1>
        <p className="text-gray-500 text-sm">Gestiona entregas a domicilio, cambia estados y haz seguimiento a los pedidos en Popayán.</p>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap gap-2.5 items-center bg-white p-3 border border-[#F3E8F0]/40 rounded-[2rem] shadow-sm">
        <span className="text-xs font-bold text-gray-400 pl-3 pr-2 flex items-center gap-1">
          <Filter className="w-4 h-4" /> Filtrar por:
        </span>
        <button
          onClick={() => handleFilterClick('')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
            statusFilter === '' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
        >
          Todos
        </button>
        {['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'].map((status) => (
          <button
            key={status}
            onClick={() => handleFilterClick(status)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all duration-300 ${
              statusFilter === status
                ? status === 'pendiente' ? 'bg-primary text-white' :
                  status === 'confirmado' ? 'bg-blue-500 text-white' :
                  status === 'enviado' ? 'bg-accent text-white' :
                  status === 'entregado' ? 'bg-[#7CB086] text-white' :
                  'bg-gray-600 text-white'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Main grid / lists */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 w-full gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-xs font-semibold tracking-wider">Cargando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#F3E8F0]/40 rounded-[2rem] p-10">
          <span className="text-4xl">🛍️</span>
          <h3 className="font-serif text-xl font-bold text-dark mt-4">No hay órdenes registradas</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mt-2">
            {statusFilter ? `No se encontraron pedidos en estado: ${statusFilter}` : 'Aún no se han registrado compras en el sitio.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#F3E8F0]/40 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FDF6FA]/60 text-gray-400 font-bold border-b border-[#F3E8F0]/20 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Código</th>
                  <th className="px-6 py-4 text-left">Cliente</th>
                  <th className="px-6 py-4 text-left">Contacto</th>
                  <th className="px-6 py-4 text-left">Barrio (Popayán)</th>
                  <th className="px-6 py-4 text-left">Fecha</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors duration-250">
                    <td className="px-6 py-4 font-bold text-gray-400 text-xs">
                      #{order._id.substring(18)}
                    </td>
                    <td className="px-6 py-4 font-bold text-dark">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {order.customerPhone}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {order.neighborhood}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs font-semibold">
                      {new Date(order.createdAt).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary-dark">
                      ${order.total.toLocaleString('es-CO')}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase border-0 focus:ring-2 focus:ring-primary ${
                          order.status === 'pendiente' ? 'bg-pink-50 text-primary-dark font-black' :
                          order.status === 'confirmado' ? 'bg-blue-50 text-blue-500' :
                          order.status === 'enviado' ? 'bg-amber-50 text-accent' :
                          order.status === 'entregado' ? 'bg-green-50 text-success' :
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="pendiente">pendiente</option>
                        <option value="confirmado">confirmado</option>
                        <option value="enviado">enviado</option>
                        <option value="entregado">entregado</option>
                        <option value="cancelado">cancelado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-primary/10 hover:bg-primary hover:text-white text-primary-dark text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all duration-300"
                        >
                          Detalles
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-rose-50 rounded-lg transition-all duration-300"
                          title="Eliminar orden"
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

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 p-6 bg-gray-50/50 border-t border-gray-100">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-300 ${
                    page === i + 1 ? 'bg-primary text-white' : 'border border-gray-200 bg-white text-dark hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-[#F3E8F0]/40 w-full max-w-xl max-h-[90vh] overflow-y-auto p-8 sm:p-10 shadow-2xl flex flex-col gap-6 animate-fade-in text-left">
            
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-serif text-2xl font-bold text-dark">
                  Detalles del Pedido
                </h3>
                <span className="text-xs text-gray-400 font-mono">ID: {selectedOrder._id}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-dark transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer shipping info */}
            <div className="flex flex-col gap-3 bg-[#FDF6FA] border border-[#F3E8F0]/40 rounded-3xl p-5">
              <h4 className="text-xs font-bold text-primary-dark uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Dirección de Entrega
              </h4>
              <div className="text-xs text-gray-600 flex flex-col gap-2 mt-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-dark">Cliente:</span>
                  <span>{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-dark">Teléfono:</span>
                  <a href={`tel:${selectedOrder.customerPhone}`} className="text-primary hover:underline flex items-center gap-1 font-bold">
                    <Phone className="w-3 h-3" /> {selectedOrder.customerPhone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-dark">Barrio en Popayán:</span>
                  <span>{selectedOrder.neighborhood}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-dark">Dirección exacta:</span>
                  <span>{selectedOrder.address}</span>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-2 pt-2 border-t border-[#F3E8F0]/30 text-gray-500">
                    <span className="font-semibold text-dark block mb-0.5">Indicaciones Especiales:</span>
                    <p className="italic">"{selectedOrder.notes}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Productos Pedidos</h4>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-xs pb-2 border-b border-gray-50 last:border-b-0 last:pb-0">
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="font-bold text-dark">{item.name}</span>
                      <span className="text-gray-400 font-semibold">{item.quantity} unidades × ${item.price.toLocaleString('es-CO')}</span>
                    </div>
                    <span className="font-bold text-primary-dark">
                      ${(item.price * item.quantity).toLocaleString('es-CO')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total balance and actions */}
            <div className="border-t border-gray-100 pt-5 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total de Compra</span>
                <span className="font-serif text-2xl font-black text-primary-dark">
                  ${selectedOrder.total.toLocaleString('es-CO')} COP
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold uppercase cursor-pointer"
                >
                  <option value="pendiente">pendiente</option>
                  <option value="confirmado">confirmado</option>
                  <option value="enviado">enviado</option>
                  <option value="entregado">entregado</option>
                  <option value="cancelado">cancelado</option>
                </select>
                
                <button
                  onClick={() => handleDelete(selectedOrder._id)}
                  className="p-2.5 bg-rose-50 hover:bg-rose-100 text-red-500 rounded-xl transition-all duration-300"
                  title="Eliminar orden"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
