import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/pez.png'; // Importa la imagen

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="navbar-brand navbar-logo flex items-center" to="/">
          <img
            src={logo} // Usa la variable `logo` en lugar de la ruta
            alt="Logo"
            className="w-14 h-14 md:w-22 md:h-22 lg:w-26 lg:h-26"
          />
        </Link>
        <div>
          {user ? (
            <button 
              onClick={logout} 
              className="bg-[#5257cd] text-white py-2 px-4 rounded hover:bg-[#357abd] transition duration-300"
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-[#5257cd] text-white py-2 px-4 rounded hover:bg-[#357abd] transition duration-300"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


