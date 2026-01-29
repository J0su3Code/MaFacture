import React, { useRef } from 'react';
import { Icons } from '../ui/Icons';
import { imageToBase64 } from '../../utils/formatters';
import './ImageUploader.css';

const ImageUploader = ({ images = [], onAdd, onRemove, maxImages = 6 }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      if (images.length >= maxImages) break;
      
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        alert('Seules les images sont acceptées');
        continue;
      }

      // Vérifier la taille (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image trop volumineuse (max 2MB)');
        continue;
      }

      try {
        const base64 = await imageToBase64(file);
        onAdd({
          name: file.name,
          data: base64,
          size: file.size
        });
      } catch (error) {
        console.error('Erreur upload:', error);
      }
    }

    // Reset input
    e.target.value = '';
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div className="images-grid">
        {/* Images existantes */}
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image.data} alt={image.name || `Image ${index + 1}`} />
            <button
              type="button"
              className="image-remove"
              onClick={() => onRemove(index)}
            >
              <Icons.x width={14} height={14} />
            </button>
          </div>
        ))}

        {/* Bouton ajouter */}
        {images.length < maxImages && (
          <button
            type="button"
            className="image-add"
            onClick={openFilePicker}
          >
            <Icons.image width={24} height={24} />
            <span>Ajouter</span>
          </button>
        )}
      </div>

      <p className="upload-hint">
        {images.length}/{maxImages} images • JPG, PNG • Max 2MB par image
      </p>
    </div>
  );
};

export default ImageUploader;