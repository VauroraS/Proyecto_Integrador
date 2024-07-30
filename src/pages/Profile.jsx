import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>No estás autenticado</p>;
  }

  return (
    <div>
      <h1>Perfil de usuario</h1>
      <p>Nombre de usuario: {user.username}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default Profile;


