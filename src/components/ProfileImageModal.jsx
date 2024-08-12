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

            try {
                await onUpload.updateProfileImage(formData);
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            } finally {
                onClose();
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4">Actualizar Imagen de Perfil</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-4"
                />
                <button
                    onClick={handleUpload}
                    className="bg-[#5257cd] text-white px-4 py-2 rounded mr-2"
                >
                    {onUpload.isLoadingUpdate ? 'Cargando...' : 'Subir Imagen'}
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default ProfileImageModal;
