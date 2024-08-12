import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProfileImageModal from '../components/ProfileImageModal';

function Profile() {
    const { user, logout } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingState, setIsEditingState] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userStates, setUserStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const dobRef = useRef(null);
    const bioRef = useRef(null);
    const userStateRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/users/profiles/profile_data/`,
                    { headers: { Authorization: `Token ${user.token}` } }
                );
                setUserData(response.data);
            } catch (err) {
                setError('Error al cargar el perfil');
                if (err.response?.status === 401) {
                    logout();
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchUserStates = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/users/user-states/`,
                    { headers: { Authorization: `Token ${user.token}` } }
                );
                setUserStates(response.data.results || []);
            } catch (err) {
                setError('Error al cargar los estados de usuario');
            }
        };

        fetchProfile();
        fetchUserStates();
    }, [user.token, logout]);

    const handleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!userData || !user.token) return;
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/users/profiles/${userData.user__id}/`,
                {
                    first_name: firstNameRef.current.value,
                    last_name: lastNameRef.current.value,
                    email: emailRef.current.value,
                    dob: dobRef.current.value,
                    bio: bioRef.current.value,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${user.token}`,
                    },
                }
            );
            setEditMode(false);
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/users/profiles/profile_data/`,
                { headers: { Authorization: `Token ${user.token}` } }
            );
            setUserData(response.data);
        } catch (err) {
            setError('Error al actualizar el perfil');
        }
    };

    const handleStateChange = async (event) => {
        const newUserStateID = event.target.value;
        if (!userData || !user.token) return;
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/users/profiles/${userData.user__id}/`,
                { state: newUserStateID },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${user.token}`,
                    },
                }
            );
            setUserData(prev => ({ ...prev, state: userStates.find(state => state.id === newUserStateID) }));
            setIsEditingState(false);
        } catch (err) {
            setError('Error al actualizar el estado');
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleImageUpload = async (formData) => {
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/users/profiles/${userData.user__id}/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Token ${user.token}`,
                    },
                }
            );
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/users/profiles/profile_data/`,
                { headers: { Authorization: `Token ${user.token}` } }
            );
            setUserData(response.data);
        } catch (err) {
            setError('Error al actualizar la imagen de perfil');
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-semibold mb-4">Perfil</h1>
            {userData && (
                <div>
                    <div className="flex items-center mb-4">
                        <img
                            src={userData.profile_image || 'default-profile.png'}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mr-4"
                        />
                        <button
                            onClick={handleOpenModal}
                            className="bg-[#5257cd] text-white px-4 py-2 rounded hover:bg-[#4349a1]"
                        >
                            Cambiar Imagen
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre:</label>
                            <input
                                type="text"
                                id="first_name"
                                ref={firstNameRef}
                                defaultValue={userData.first_name}
                                disabled={!editMode}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido:</label>
                            <input
                                type="text"
                                id="last_name"
                                ref={lastNameRef}
                                defaultValue={userData.last_name}
                                disabled={!editMode}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico:</label>
                            <input
                                type="email"
                                id="email"
                                ref={emailRef}
                                defaultValue={userData.email}
                                disabled={!editMode}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Fecha de nacimiento:</label>
                            <input
                                type="date"
                                id="dob"
                                ref={dobRef}
                                defaultValue={userData.dob}
                                disabled={!editMode}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biografía:</label>
                            <textarea
                                id="bio"
                                ref={bioRef}
                                defaultValue={userData.bio}
                                disabled={!editMode}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado:</label>
                            <select
                                id="state"
                                ref={userStateRef}
                                value={userData.state?.id || ''}
                                onChange={handleStateChange}
                                disabled={!isEditingState}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                {userStates.map(state => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => setIsEditingState(!isEditingState)}
                                className="bg-[#5257cd] text-white px-4 py-2 rounded hover:bg-[#4349a1] mt-2"
                            >
                                {isEditingState ? 'Guardar' : 'Editar Estado'}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleEditMode}
                                className="bg-[#5257cd] text-white px-4 py-2 rounded hover:bg-[#4349a1] mr-2"
                            >
                                {editMode ? 'Cancelar' : 'Editar'}
                            </button>
                            {editMode && (
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
                                >
                                    Guardar Cambios
                                </button>
                            )}
                        </div>
                    </form>
                    <button
                        onClick={logout}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
            <ProfileImageModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                userId={user.userId}
                onUpload={{ updateProfileImage: handleImageUpload }}
            />
        </div>
    );
}

export default Profile;

