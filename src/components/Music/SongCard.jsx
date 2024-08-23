import React from 'react';

const SongCard = ({ title, artists, genres, songFile }) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg m-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 border border-[#4a92de] border-t-[#034f74] border-r-[#034f74] border-b-[#5257cd] transition-transform transform hover:scale-105">
      <div className="px-6 py-4">
        <div className="font-bold text-2xl text-[#034f74] mb-2">{title}</div>
        <p className="text-gray-800 text-base mb-1">
          {artists.length ? `Artist: ${artists.join(', ')}` : 'Unknown Artist'}
        </p>
        <p className="text-gray-800 text-base">
          {genres.length ? `Genre: ${genres.join(', ')}` : 'Unknown Genre'}
        </p>
        {songFile && (
          <div className="mt-4">
            <audio controls controlsList="nodownload" className="w-full bg-gray-100 rounded-lg p-2">
              <source src={songFile} type="audio/mp3" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;


