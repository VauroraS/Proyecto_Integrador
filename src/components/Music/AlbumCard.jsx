import React, { useState } from 'react';

function AlbumCard({ album }) {
  const [isSelected, setIsSelected] = useState(false);

  const handleCardClick = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white shadow-lg rounded-lg p-6 m-2 cursor-pointer transform transition-transform duration-300 ${
        isSelected ? 'scale-105' : ''
      }`}
    >
      <img
        src={album.cover || 'default-cover.jpg'}
        alt={album.title}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-lg font-bold mt-4">{album.title}</h3>
      <p className="text-gray-600 mt-2">{album.year}</p>
      <p className="text-gray-600 mt-1">Artist ID: {album.artist}</p>
    </div>
  );
}

export default AlbumCard;
