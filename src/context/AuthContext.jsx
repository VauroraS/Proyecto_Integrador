import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log('Inicializando estado con:', { token, userId }); // Debug
    return token && userId ? { token, userId } : null;
  });

  const navigate = useNavigate();

  const login = (token, userId) => {
    console.log('Intentando iniciar sesión con:', { token, userId }); // Debug
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setUser({ token, userId });
    navigate('/profile');
  };

  const logout = () => {
    console.log('Cerrando sesión'); // Debug
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);






