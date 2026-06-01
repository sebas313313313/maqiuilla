import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Inbox, Bell, LogOut, Flower2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminSidebar = () => {
  const { logout, admin } = useContext(AuthContext);

  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/admin/products', icon: <ShoppingBag className="w-5 h-5" />, label: 'Productos' },
    { to: '/admin/orders', icon: <Inbox className="w-5 h-5" />, label: 'Órdenes' },
    { to: '/admin/announcements', icon: <Bell className="w-5 h-5" />, label: 'Anuncios' },
  ];

  const activeStyle = "flex items-center gap-3.5 bg-primary/20 text-primary-dark px-5 py-4 rounded-2xl font-bold transition-all duration-300 shadow-sm border-l-4 border-primary";
  const inactiveStyle = "flex items-center gap-3.5 text-gray-500 hover:text-primary hover:bg-[#FDF6FA] px-5 py-4 rounded-2xl font-medium transition-all duration-300";

  return (
    <aside className="w-64 bg-white border-r border-[#F3E8F0]/40 min-h-screen shrink-0 hidden md:flex flex-col py-8 px-4 justify-between sticky top-0 h-screen">
      <div className="flex flex-col gap-8">
        {/* Profile Card */}
        <div className="bg-[#FDF6FA] border border-[#F3E8F0]/40 rounded-3xl p-5 flex flex-col items-center gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full pointer-events-none" />
          
          <div className="w-14 h-14 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md shadow-primary/20">
            {admin?.name?.substring(0, 2).toUpperCase() || 'LS'}
          </div>
          
          <div className="text-center">
            <h4 className="font-bold text-dark text-sm truncate max-w-[160px]">
              {admin?.name || 'Lirio Admin'}
            </h4>
            <span className="text-xs text-primary font-semibold tracking-wider uppercase mt-0.5 block">
              Propietaria
            </span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 w-full py-4 text-sm font-semibold bg-[#1A1A2E]/5 hover:bg-rose-50 hover:text-red-500 text-gray-500 rounded-2xl transition-all duration-300"
      >
        <LogOut className="w-5 h-5" /> Cerrar Sesión
      </button>
    </aside>
  );
};

export default AdminSidebar;
