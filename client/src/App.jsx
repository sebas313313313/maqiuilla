import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Toaster } from 'react-hot-toast';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';

// Páginas de Administrador
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import OrderManager from './pages/admin/OrderManager';
import AnnouncementManager from './pages/admin/AnnouncementManager';

// Componente para hacer scroll hacia arriba en cada navegación
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

// Middleware / Componente de Ruta Protegida
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest animate-pulse">Verificando Credenciales...</span>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Componente para manejar layouts estructurados
const MainLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  if (isAdminRoute) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-[#FDF6FA]/40 text-[#1A1A2E]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-6 sm:p-10 md:p-12 overflow-y-auto max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/admin/products" element={<PrivateRoute><ProductManager /></PrivateRoute>} />
              <Route path="/admin/orders" element={<PrivateRoute><OrderManager /></PrivateRoute>} />
              <Route path="/admin/announcements" element={<PrivateRoute><AnnouncementManager /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen justify-between bg-[#FDF6FA] text-[#1A1A2E]">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin/login" element={<Login />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            {/* Alertas Premium de react-hot-toast */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '20px',
                  background: '#FDF6FA',
                  color: '#1A1A2E',
                  border: '1px solid #F3E8F0',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '16px 24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                },
              }}
            />
            <MainLayout />
          </Router>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
