import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Inicializar el estado con el token y userId si están en el localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return token && userId ? { token, userId } : null;
  });

  const navigate = useNavigate();

  const login = (token, userId) => {
    // Guardar el token y userId en el localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);

    // Actualizar el estado del usuario
    setUser({ token, userId });

    // Navegar a la página de perfil
    navigate('/profile');
  };

  const logout = () => {
    // Eliminar el token y userId del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Actualizar el estado del usuario a null
    setUser(null);

    // Navegar a la página de login
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};





