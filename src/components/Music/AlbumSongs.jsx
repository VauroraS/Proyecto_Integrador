import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongCard from './SongCardAlbum';

function AlbumSongs({ albumId }) {
  const [songs, setSongs] = useState([]);
  const [filters, setFilters] = useState({ title: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (albumId) {
      fetchSongs();
    }
  }, [albumId, filters]);

  const fetchSongs = async () => {
    if (!albumId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/harmonyhub/albums/${albumId}/songs/`, {
        params: filters,
      });
      setSongs(response.data.results || []);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
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
          Buscar
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {songs.length > 0 ? (
          songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))
        ) : (
          <p>No songs found</p>
        )}
      </div>
    </div>
  );
}

export default AlbumSongs;

