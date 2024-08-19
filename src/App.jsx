import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './components/Auth/Login';
import NotFound from './pages/NotFound';
import AlbumsPage from './components/Music/AlbumPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/album" element={<AlbumsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notfound" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;


