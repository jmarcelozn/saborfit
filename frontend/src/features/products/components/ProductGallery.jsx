import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './css/ProductGallery.css';

function ProductGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="product-gallery product-gallery--empty">
        <div className="product-gallery__placeholder">
          <span>Sem imagem</span>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const showThumbnails = images.length > 1;

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <button
          type="button"
          className="product-gallery__nav product-gallery__nav--prev"
          onClick={handlePrevious}
          disabled={images.length === 1}
          aria-label="Imagem anterior"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="product-gallery__image-wrapper">
          <img
            src={images[currentIndex]}
            alt={`Imagem ${currentIndex + 1} do produto`}
            className="product-gallery__image"
          />
        </div>

        <button
          type="button"
          className="product-gallery__nav product-gallery__nav--next"
          onClick={handleNext}
          disabled={images.length === 1}
          aria-label="Próxima imagem"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {showThumbnails && (
        <div className="product-gallery__thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              className={`product-gallery__thumbnail ${
                index === currentIndex ? 'product-gallery__thumbnail--active' : ''
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`Ver imagem ${index + 1}`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="product-gallery__thumbnail-image"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
