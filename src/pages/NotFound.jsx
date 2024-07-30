import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-xl text-gray-700">Página no encontrada</p>
      </div>
    </div>
  );
};

export default NotFound;
