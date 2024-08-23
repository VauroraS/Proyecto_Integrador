import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AlbumCard from './AlbumCard';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../Navbar';

// Componente para mostrar cada canción
function SongCard({ song }) {
  return (
    <div className="max-w-sm p-6 rounded-lg overflow-hidden shadow-lg m-4 bg-gradient-to-r from-white via-gray-100 to-gray-200 border border-[#4a92de] border-t-[#034f74] border-r-[#034f74] border-b-[#5257cd] transition-transform transform hover:scale-105">
      <h3 className="text-xl font-bold text-[#034f74] mb-2">{song.title}</h3>
      <p className="text-gray-800 text-base mb-1">
        <span className="font-semibold">Año:</span> {song.year}
      </p>
      <p className="text-gray-800 text-base mb-2">
        <span className="font-semibold">Duración:</span> {song.duration} segundos
      </p>
      <audio controls className="w-full bg-gray-100 rounded-lg p-2 mt-4">
        <source src={song.song_file} type="audio/mpeg" />
        Tu navegador no soporta el elemento de audio.
      </audio>
    </div>
  );
}

// Componente para mostrar las canciones de un álbum
function AlbumSongs({ albumId }) {
  const [songs, setSongs] = useState([]);
  const [filters, setFilters] = useState({ title: '' });

  useEffect(() => {
    fetchSongs();
  }, [albumId, filters]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/harmonyhub/albums/${albumId}/songs/`,
        { params: filters }
      );
      setSongs(response.data.results);
    } catch (error) {
      console.error('Error al obtener las canciones:', error);
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
      <h2 className="text-xl font-bold mb-4">Canciones</h2>
      <form className="mb-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={filters.title}
          onChange={handleInputChange}
          placeholder="Buscar por título"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="mt-4 ml-2 p-2 bg-[#5257cd] text-white rounded"
        >
          Buscar
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
  const [artists, setArtists] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [title, setTitle] = useState('');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext); // Usar el contexto de autenticación

  useEffect(() => {
    fetchAlbums();
    fetchArtists(); // Cargar la lista de artistas cuando el componente se monta
  }, [user.token]); // Dependencia añadida para actualizar si el token cambia

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/harmonyhub/albums/`,
        {
          params: { title },
          headers: { Authorization: `Token ${user.token}` },
        }
      );
      setAlbums(response.data.results);
    } catch (error) {
      console.error('Error al obtener los álbumes:', error);
      setError('Error al obtener los álbumes. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/harmonyhub/artists/`,
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );
      setArtists(response.data.results);
    } catch (error) {
      console.error('Error al obtener los artistas:', error);
    }
  };

  const createAlbum = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/harmonyhub/albums/`,
        {
          title: newAlbumTitle,
          artist: selectedArtist,
          release_year: releaseYear,
        },
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );
      setAlbums([...albums, response.data]);
      setNewAlbumTitle('');
      setSelectedArtist('');
      setReleaseYear('');
    } catch (error) {
      console.error('Error al crear el álbum:', error);
      setError('Error al crear el álbum. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  const deleteAlbum = async (albumId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/harmonyhub/albums/${albumId}/`,
        {
          headers: { Authorization: `Token ${user.token}` },
        }
      );
      setAlbums(albums.filter((album) => album.id !== albumId));
    } catch (error) {
      console.error('Error al eliminar el álbum:', error);
      setError('Error al eliminar el álbum. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        
        <h1 className="text-2xl font-bold mb-4">Álbumes</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Buscar por título"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={fetchAlbums}
            className="ml-2 p-2 bg-[#5257cd] text-white rounded"
          >
            Buscar
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
            placeholder="Título del nuevo álbum"
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={selectedArtist}
            onChange={(e) => setSelectedArtist(e.target.value)}
            className="p-2 border border-gray-300 rounded ml-2"
          >
            <option value="">Seleccionar artista</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            placeholder="Año de lanzamiento"
            className="p-2 border border-gray-300 rounded ml-2"
          />
          <button
            onClick={createAlbum}
            className="ml-2 p-2 bg-[#5257cd] text-white rounded"
          >
            Crear álbum
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {albums.map((album) => (
            <div key={album.id} className="relative">
              <AlbumCard
                album={album}
                onClick={() => setSelectedAlbum(album)}
              />
              <button
                onClick={() => deleteAlbum(album.id)}
                className="absolute top-0 right-0 mt-2 mr-2 p-2 bg-red-500 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
        {selectedAlbum && <AlbumSongs albumId={selectedAlbum.id} />}
      </div>
    </div>
  );
}

export default AlbumsPage;













