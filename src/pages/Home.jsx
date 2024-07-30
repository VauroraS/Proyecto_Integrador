import React from 'react';
import SongList from '../components/Music/SongList';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-yellow-700">Home</h1>
      <SongList />
    </div>
  );
};

export default Home;


