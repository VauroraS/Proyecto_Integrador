import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AlbumPage from '../components/Music/AlbumPage';
import SongList from '../components/Music/SongList';
import Navbar from '../components/Navbar';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6 text-yellowgreen">Canciones Disponibles</h1>
        {isAuthenticated ? (
          <AlbumPage />
        ) : (
          <SongList />
        )}
      </div>
    </>
  );
};

export default Home;




