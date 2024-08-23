import React, { useRef, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import Navbar from '../Navbar';

function Login() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await api.post('/api-auth/', {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        });

        const responseData = response.data;
        localStorage.setItem('token', responseData.token);
        
        login(responseData.token);

        if (responseData.token) {
          
          const profileResponse = await api.get('/users/profiles/profile_data/', {
            headers: {
              'Authorization': `Token ${responseData.token}`
            }
          });
          const profileData = profileResponse.data;
          login(responseData.token, profileData.userId);
        }
      } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <section className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isError && <p className="text-red-500 text-center">Error al cargar los datos. Por favor, verifica tus credenciales.</p>}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de usuario:</label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  ref={usernameRef}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-user text-gray-400"></i>
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña:</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  ref={passwordRef}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-lock text-gray-400"></i>
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#5257cd] text-white py-2 px-4 rounded hover:bg-[#4349a1] focus:outline-none focus:ring-2 focus:ring-[#5257cd] focus:ring-opacity-50"
            >
              {isLoading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;




