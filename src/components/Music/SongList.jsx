import React, { useState, useEffect } from 'react';
import SongCard from './SongCard';
import api from '../../api/api';

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const songsPerPage = 6; // Número de canciones por página

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Ajusta los parámetros según la API
        const response = await api.get(`/songs/?page=${currentPage}&page_size=${songsPerPage}`);
        if (response.data.results) {
          setSongs(response.data.results); // Asegúrate de que `results` contenga las canciones actuales
          setTotalPages(Math.ceil(response.data.total / songsPerPage)); // Ajusta según cómo se maneja el total en la respuesta
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {songs.map(song => (
            <SongCard
              key={song.id}
              title={song.title}
              artists={song.artists}
              genres={song.genres}
              songFile={song.song_file}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center p-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SongList;
