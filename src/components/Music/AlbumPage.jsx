import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlbumCard from './AlbumCard';

// Componente para mostrar cada canción
function SongCard({ song }) {
  return (
    <div className="max-w-sm p-6 rounded overflow-hidden shadow-lg m-4 bg-[#5257cd] bg-opacity-15 border-2 border-[#4a92de] border-t-[#034f74] border-r-[#034f74] border-b-[#5257cd]">
      <h3 className="text-lg font-bold mt-2">{song.title}</h3>
      <p className="text-gray-600">Year: {song.year}</p>
      <p className="text-gray-600">Duration: {song.duration} seconds</p>
      <audio controls className="mt-2 w-full">
        <source src={song.song_file} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

// Componente para mostrar las canciones de un álbum
function AlbumSongs({ albumId }) {
  const [songs, setSongs] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
  });

  useEffect(() => {
    fetchSongs();
  }, [albumId]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${albumId}/songs/`, { params: filters });
      setSongs(response.data.results);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
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

// Componente principal que incluye los álbumes y sus canciones
function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get('https://sandbox.academiadevelopers.com/harmonyhub/albums/', { params: { title } });
      setAlbums(response.data.results);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleAlbumClick = (albumId) => {
    setSelectedAlbum(albumId);
  };

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAlbums();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Albums</h1>
      <form className="mb-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleInputChange}
          placeholder="Title"
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="mt-4 ml-2 p-2 bg-[#5257cd] text-white rounded">
          Filter
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {albums.map((album) => (
          <div key={album.id} onClick={() => handleAlbumClick(album.id)}>
            <AlbumCard album={album} />
          </div>
        ))}
      </div>

      {selectedAlbum && (
        <div className="mt-8">
          <AlbumSongs albumId={selectedAlbum} />
        </div>
      )}
    </div>
  );
}

export default AlbumsPage;

