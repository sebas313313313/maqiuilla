import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Inbox, TrendingUp, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axios.get('/api/orders/stats/summary');
        setStats(statsRes.data);

        const ordersRes = await axios.get('/api/orders?limit=5');
        setRecentOrders(ordersRes.data.orders);
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] w-full gap-3">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest animate-pulse">Cargando estadísticas...</p>
      </div>
    );
  }

  // Cards layout
  const statCards = [
    {
      label: 'Ingresos Totales',
      value: `$${stats?.totalRevenue?.toLocaleString('es-CO') || 0}`,
      icon: <DollarSign className="w-5 h-5 text-success" />,
      color: 'bg-green-50 border-green-100',
      textColor: 'text-success',
    },
    {
      label: 'Ingresos de Este Mes',
      value: `$${stats?.monthlyRevenue?.toLocaleString('es-CO') || 0}`,
      icon: <TrendingUp className="w-5 h-5 text-accent" />,
      color: 'bg-amber-50 border-amber-100',
      textColor: 'text-accent',
    },
    {
      label: 'Pedidos Pendientes',
      value: stats?.pendingOrders || 0,
      icon: <Clock className="w-5 h-5 text-primary-dark" />,
      color: 'bg-pink-50 border-pink-100',
      textColor: 'text-primary-dark font-black scale-105',
    },
    {
      label: 'Órdenes Completadas',
      value: stats?.deliveredOrders || 0,
      icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-500',
    },
  ];

  return (
    <div className="flex flex-col gap-10 w-full text-left">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-dark">Resumen del Negocio</h1>
        <p className="text-gray-500 text-sm">Control general y rendimiento comercial de Lirio Store Popayán.</p>
      </div>

      {/* Grid statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`border rounded-3xl p-6 flex items-center justify-between shadow-sm bg-white hover:shadow-md transition-all duration-300`}
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {card.label}
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-black text-dark">
                {card.value}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${card.color} border flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Graphical Insights and Quick Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent orders table */}
        <div className="lg:col-span-8 bg-white border border-[#F3E8F0]/40 rounded-[2rem] p-8 shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-xl font-bold text-dark">Órdenes Recientes</h3>
            <Link to="/admin/orders" className="text-primary hover:text-primary-dark font-bold text-xs underline">
              Ver todos los pedidos
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 flex flex-col items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              <p>No se han registrado pedidos aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 font-bold border-b border-gray-100 pb-3 text-xs uppercase tracking-wider">
                    <th className="pb-3 font-semibold text-left">Cliente</th>
                    <th className="pb-3 font-semibold text-left">Barrio</th>
                    <th className="pb-3 font-semibold text-left">Total</th>
                    <th className="pb-3 font-semibold text-left">Estado</th>
                    <th className="pb-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="py-4 font-bold text-dark">{order.customerName}</td>
                      <td className="py-4 text-gray-500">{order.neighborhood}</td>
                      <td className="py-4 font-semibold text-primary-dark">
                        ${order.total.toLocaleString('es-CO')}
                      </td>
                      <td className="py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.status === 'pendiente' ? 'bg-pink-50 text-primary-dark' :
                          order.status === 'confirmado' ? 'bg-blue-50 text-blue-500' :
                          order.status === 'enviado' ? 'bg-amber-50 text-accent' :
                          'bg-green-50 text-success'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          to="/admin/orders"
                          className="bg-primary/10 hover:bg-primary hover:text-white text-primary-dark text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-300"
                        >
                          Revisar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Business Insights */}
        <div className="lg:col-span-4 bg-white border border-[#F3E8F0]/40 rounded-[2rem] p-8 shadow-sm flex flex-col gap-6 text-left">
          <h3 className="font-serif text-xl font-bold text-dark">Estado del Negocio</h3>
          
          <div className="flex flex-col gap-4">
            
            {/* Delivery coverage */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>COBERTURA DE ENTREGA</span>
                <span className="text-primary-dark">100% POPAYÁN</span>
              </div>
              <div className="w-full bg-[#FDF6FA] rounded-full h-2 border border-[#F3E8F0]/50 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Pendings ratio */}
            {stats?.totalOrders > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>PEDIDOS POR ENTREGAR</span>
                  <span className="text-accent">
                    {Math.round(((stats.pendingOrders || 0) / stats.totalOrders) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#FDF6FA] rounded-full h-2 border border-[#F3E8F0]/50 overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full"
                    style={{ width: `${((stats.pendingOrders || 0) / stats.totalOrders) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Store details */}
            <div className="mt-4 pt-6 border-t border-[#F3E8F0]/30 flex flex-col gap-3.5 text-xs font-medium text-gray-500">
              <div className="flex justify-between">
                <span>Catálogo de Cosméticos:</span>
                <span className="font-bold text-dark">{stats?.totalProducts || 0} productos</span>
              </div>
              <div className="flex justify-between">
                <span>Historial de Órdenes:</span>
                <span className="font-bold text-dark">{stats?.totalOrders || 0} pedidos</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
