import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/pez.png'; // Importa la imagen

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 p-4 shadow-lg border-b-2 border-[#4a92de]">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="navbar-brand navbar-logo flex items-center" to="/">
          <img
            src={logo} // Usa la variable `logo` en lugar de la ruta
            alt="Logo"
            className="w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18"
          />
          <span className="ml-2 text-[#5257cd] text-base md:text-xl lg:text-2xl font-semibold">
            Melody
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link 
                to="/album" 
                className="text-white text-sm md:text-base lg:text-lg hover:text-gray-300 transition duration-300"
              >
                Álbumes
              </Link>
              <Link 
                to="/profile" 
                className="text-white text-sm md:text-base lg:text-lg hover:text-gray-300 transition duration-300"
              >
                Perfil
              </Link>
            </>
          ) : (
            <span className="text-red-500 text-sm md:text-base lg:text-lg">
            </span>
          )}
          {user ? (
            <button 
              onClick={logout} 
              className="bg-[#5257cd] text-white text-sm md:text-base lg:text-lg py-2 px-4 rounded hover:bg-[#357abd] transition duration-300"
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link 
              to="/login" 
              className="bg-[#5257cd] text-white text-sm md:text-base lg:text-lg py-2 px-4 rounded hover:bg-[#357abd] transition duration-300"
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





