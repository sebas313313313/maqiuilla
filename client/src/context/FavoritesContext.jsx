import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('lirioFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('lirioFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const toggleFavorite = (product) => {
    if (isFavorite(product._id)) {
      setFavorites(prev => prev.filter(id => id !== product._id));
      toast.success('Eliminado de tus favoritos', {
        style: {
          border: '1px solid #F3E8F0',
          padding: '16px',
          color: '#1A1A2E',
          background: '#FFFFFF',
        },
        icon: '💔',
      });
    } else {
      setFavorites(prev => [...prev, product._id]);
      toast.success(`¡${product.name} agregado a favoritos!`, {
        style: {
          border: '1px solid #ef4444',
          padding: '16px',
          color: '#1A1A2E',
          background: '#FEF2F2',
        },
        icon: '❤️',
      });
    }
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, getFavoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  );
};
