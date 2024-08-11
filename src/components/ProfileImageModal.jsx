import React, { useState } from 'react';

function ProfileImageModal({ isOpen, onClose, userId, onUpload }) {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isOpen) return null;

    const handleImageChange = (event) => {
        if (event.target.files.length > 0) {
            setSelectedImage(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage);

            await onUpload.updateProfileImage(formData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4">Actualizar Imagen de Perfil</h2>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button
                    onClick={handleUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    {onUpload.isLoadingUpdate ? 'Cargando...' : 'Subir Imagen'}
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default ProfileImageModal;
