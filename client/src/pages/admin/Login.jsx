import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Flower2, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está logueado, redirigir directo al dashboard
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor ingresa todos los campos');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      toast.success('¡Bienvenida de vuelta, Administradora! 🌺');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.message || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FDF6FA] via-[#F3E8F0]/30 to-[#C4638A]/25 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Absolute decorative items */}
      <div className="absolute top-10 left-10 w-44 h-44 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border border-[#F3E8F0]/40 p-8 sm:p-12 w-full max-w-md shadow-lg flex flex-col gap-8 relative z-10 text-center">
        
        {/* Brand header */}
        <div className="flex flex-col items-center gap-2">
          <img src="/lirio-logo.png" alt="Lirio Store Logo" className="h-24 w-auto object-contain mb-1 drop-shadow-sm" />
          <h2 className="font-serif text-3xl font-bold text-dark">Lirio Acceso</h2>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Consola de Administradora
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@lirio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#FDF6FA]/70 border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#FDF6FA]/70 border border-[#F3E8F0]/60 rounded-2xl text-sm focus:outline-none focus:border-primary text-dark"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-md shadow-primary/20 flex items-center justify-center gap-2 mt-4 text-sm uppercase tracking-wider"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Ingresar al Panel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
