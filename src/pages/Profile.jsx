import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext'; 
import axios from 'axios';
import ProfileImageModal from '../components/ProfileImageModal';

function Profile() {
    const { user, logout } = useAuth(); // Desestructur user y logout desde el contexto de autenticación
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
                    `${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`,
                    { headers: { Authorization: `Token ${user.token}` } }
                );
                setUserData(response.data);
            } catch (err) {
                setError('Error al cargar el perfil');
                if (err.response?.status === 401) {
                    logout(); // Si el error es 401, se cierra sesión
                    window.location.href = '/login'; // Redirige al login
                }
            } finally {
                setLoading(false);
            }
        };

        const fetchUserStates = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}users/user-states/`,
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
        if (!userData || !user.token) return; // Asegurarse de que userData y user.token estén definidos
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}users/profiles/${userData.user__id}/`,
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
            // Refrescar el perfil
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`,
                { headers: { Authorization: `Token ${user.token}` } }
            );
            setUserData(response.data);
        } catch (err) {
            setError('Error al actualizar el perfil');
        }
    };

    const handleStateChange = async (event) => {
        const newUserStateID = event.target.value;
        if (!userData || !user.token) return; // Asegurarse de que userData y user.token estén definidos
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}users/profiles/${userData.user__id}/`,
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

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow-md">
            {userData ? (
                <>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex items-center space-x-4">
                            <figure className="w-24 h-24">
                                <img
                                    src={
                                        `${import.meta.env.VITE_API_BASE_URL}${userData.image}` ||
                                        "https://via.placeholder.com/96"
                                    }
                                    alt="Profile"
                                    className="w-full h-full rounded-full cursor-pointer"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            </figure>
                            <div className="flex-1">
                                {editMode ? (
                                    <div className="flex space-x-2 mb-2">
                                        <input
                                            type="text"
                                            className="border p-2 rounded"
                                            ref={firstNameRef}
                                            defaultValue={userData.first_name}
                                        />
                                        <input
                                            type="text"
                                            className="border p-2 rounded"
                                            ref={lastNameRef}
                                            defaultValue={userData.last_name}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-2xl font-bold">
                                        {userData.first_name} {userData.last_name}
                                    </p>
                                )}
                                {isEditingState ? (
                                    <div className="mt-2">
                                        <select
                                            className="border p-2 rounded"
                                            ref={userStateRef}
                                            value={userData.state?.id || ''}
                                            onChange={handleStateChange}
                                        >
                                            {userStates.map(state => (
                                                <option key={state.id} value={state.id}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="flex items-center mt-2 cursor-pointer" onClick={() => setIsEditingState(true)}>
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE_URL}${userData.state?.icon}`}
                                            alt="State icon"
                                            className="w-6 h-6 mr-2 rounded-full"
                                        />
                                        <span>{userData.state?.name}</span>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleEditMode}
                            >
                                {editMode ? 'Guardar' : 'Editar'}
                            </button>
                        </div>
                        {editMode && (
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Email:</label>
                                    <input
                                        type="email"
                                        className="border p-2 rounded w-full"
                                        ref={emailRef}
                                        defaultValue={userData.email}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Fecha de Nacimiento:</label>
                                    <input
                                        type="date"
                                        className="border p-2 rounded w-full"
                                        ref={dobRef}
                                        defaultValue={userData.dob}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Biografía:</label>
                                    <textarea
                                        className="border p-2 rounded w-full"
                                        ref={bioRef}
                                        defaultValue={userData.bio || 'No disponible'}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        )}
                    </form>
                    <ProfileImageModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        userId={userData.user__id}
                        onUpload={{
                            updateProfileImage: async (file) => {
                                try {
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    await axios.patch(
                                        `${import.meta.env.VITE_API_BASE_URL}users/profiles/${userData.user__id}/`,
                                        formData,
                                        {
                                            headers: {
                                                'Content-Type': 'multipart/form-data',
                                                Authorization: `Token ${user.token}`,
                                            },
                                        }
                                    );
                                    const response = await axios.get(
                                        `${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`,
                                        { headers: { Authorization: `Token ${user.token}` } }
                                    );
                                    setUserData(response.data);
                                } catch (err) {
                                    setError('Error al actualizar la imagen de perfil');
                                }
                            },
                            isLoadingUpdate: false,
                        }}
                    />
                </>
            ) : (
                <p>No se pudo cargar la información del perfil.</p>
            )}
        </div>
    );
}

export default Profile;
