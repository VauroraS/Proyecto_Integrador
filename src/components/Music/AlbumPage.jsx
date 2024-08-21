import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlbumCard from './AlbumCard';
import AlbumSongs from './AlbumSongs';
import Navbar from '../Navbar';
import { useAuth } from '../../context/AuthContext';

function AlbumsPage() {
  const { user } = useAuth(); // Obtener el usuario autenticado desde el contexto
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [title, setTitle] = useState('');
  const [newAlbum, setNewAlbum] = useState({ title: '', year: '', artist: '' });

  useEffect(() => {
    if (user) {
      fetchAlbums();
    }
  }, [title, user]);

  const fetchAlbums = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/harmonyhub/albums/`, {
        params: { title },
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });
      setAlbums(response.data.results || []);
    } catch (error) {
      console.error('Error fetching albums:', error.response ? error.response.data : error.message);
    }
  };

  const handleAlbumClick = (albumId) => {
    setSelectedAlbum(albumId); // Establecer el álbum seleccionado
  };

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAlbums();
  };

  const handleNewAlbumChange = (e) => {
    const { name, value } = e.target;
    setNewAlbum((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAlbum = async () => {
    if (!user) return;

    try {
      const { title, year, artist } = newAlbum;

      // Verifica que todos los campos requeridos estén presentes y en el formato correcto
      if (!title || isNaN(parseInt(artist))) {
        console.error('Invalid album data');
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/harmonyhub/albums/`, {
        title,
        year: year ? parseInt(year, 10) : null, // `year` puede ser nulo si no se proporciona
        artist: parseInt(artist, 10), // `artist` debe ser un número entero
      }, {
        headers: {
          Authorization: `Token ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      setAlbums((prev) => [...prev, response.data]);
      setNewAlbum({ title: '', year: '', artist: '' });
    } catch (error) {
      console.error('Error creating album:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!user) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/harmonyhub/albums/${albumId}/`, {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });
      setAlbums((prev) => prev.filter((album) => album.id !== albumId));
    } catch (error) {
      console.error('Error deleting album:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Albumes</h1>

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
            Buscar
          </button>
        </form>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Crear Nuevo Album</h2>
          <input
            type="text"
            name="title"
            value={newAlbum.title}
            onChange={handleNewAlbumChange}
            placeholder="Title"
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="number"
            name="year"
            value={newAlbum.year}
            onChange={handleNewAlbumChange}
            placeholder="Year"
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="number"
            name="artist"
            value={newAlbum.artist}
            onChange={handleNewAlbumChange}
            placeholder="Artist ID"
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <button onClick={handleCreateAlbum} className="p-2 bg-[#5257cd] text-white rounded">
            Crear Album
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {albums.map((album) => (
            <div key={album.id} className="cursor-pointer">
              <AlbumCard album={album} onClick={() => handleAlbumClick(album.id)} />
              <button
                onClick={() => handleDeleteAlbum(album.id)}
                className="mt-2 p-2 bg-red-500 text-white rounded"
              >
                Eliminar Album
              </button>
            </div>
          ))}
        </div>

        {selectedAlbum && (
          <div className="mt-8">
            <AlbumSongs albumId={selectedAlbum} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumsPage;






