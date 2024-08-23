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
        console.log(`Fetching page: ${currentPage}`); // Verificar la página actual
        const response = await api.get(`/harmonyhub/songs/?page=${currentPage}&page_size=${songsPerPage}`);
        console.log('API Response:', response.data); // Verificar la respuesta de la API

        if (response.data && response.data.results) {
          setSongs(response.data.results);
          setTotalPages(Math.ceil(response.data.count / songsPerPage)); // Calcular el número total de páginas
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => {
        console.log(`Navigating to next page: ${prevPage + 1}`); // Verificar la página siguiente
        return prevPage + 1;
      });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => {
        console.log(`Navigating to previous page: ${prevPage - 1}`); // Verificar la página anterior
        return prevPage - 1;
      });
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
          className="px-4 py-2 mx-2 bg-[#5257cd] text-white rounded-lg hover:bg-[#034f74] disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-[#5257cd] text-white rounded-lg hover:bg-[#034f74] disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default SongList;

