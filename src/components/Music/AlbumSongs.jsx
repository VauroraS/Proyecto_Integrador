import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongCard from './SongCardAlbum';

// Componente para mostrar las canciones de un álbum
function AlbumSongs({ albumId }) {
  const [songs, setSongs] = useState([]);
  const [filters, setFilters] = useState({ title: '' });

  useEffect(() => {
    fetchSongs();
  }, [albumId, filters]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${albumId}/songs/`, { params: filters });
      setSongs(response.data.results || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSongs();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Songs</h2>
      <form className="mb-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={filters.title}
          onChange={handleInputChange}
          placeholder="Search by title"
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="mt-4 ml-2 p-2 bg-[#5257cd] text-white rounded">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}

export default AlbumSongs;

