import React from 'react';
import SongList from '../components/Music/SongList';
import Navbar from '../components/Navbar';


const Home = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        
        <h1 className="text-2xl font-bold text-center mb-6 text-yellow-700">Canciones Disponibles</h1>
        <SongList />
      </div>
    </>
  );
};

export default Home;


