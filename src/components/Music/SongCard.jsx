import React from 'react';

const SongCard = ({ title, artists, genres, songFile }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">
          {artists.length ? `Artist: ${artists.join(', ')}` : 'Unknown Artist'}
        </p>
        <p className="text-gray-700 text-base">
          {genres.length ? `Genre: ${genres.join(', ')}` : 'Unknown Genre'}
        </p>
        {songFile && (
          <audio controls controlsList="nodownload" className="w-full mt-4">
            <source src={songFile} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default SongCard;

