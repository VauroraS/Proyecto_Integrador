import React from 'react';

// Componente para mostrar cada canción
function SongCard({ song }) {
  if (!song) {
    return (
      <div className="max-w-sm p-6 rounded overflow-hidden shadow-lg m-4 bg-[#5257cd] bg-opacity-15 border-2 border-[#4a92de] border-t-[#034f74] border-r-[#034f74] border-b-[#5257cd]">
        Song data is unavailable.
      </div>
    );
  }

  const { title = 'Unknown Title', year = 'Unknown Year', duration = 'Unknown Duration', song_file } = song;

  return (
    <div className="max-w-sm p-6 rounded overflow-hidden shadow-lg m-4 bg-[#5257cd] bg-opacity-15 border-2 border-[#4a92de] border-t-[#034f74] border-r-[#034f74] border-b-[#5257cd]">
      <h3 className="text-lg font-bold mt-2">{title}</h3>
      <p className="text-gray-600">Year: {year}</p>
      <p className="text-gray-600">Duration: {duration} seconds</p>
      {song_file ? (
        <audio controls className="mt-2 w-full">
          <source src={song_file} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p className="text-gray-600">Audio file not available</p>
      )}
    </div>
  );
}

export default SongCard;

