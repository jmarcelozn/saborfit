import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/app/contexts/useCart';
import { useAuth } from '@/app/contexts/useAuth';
import { ROUTES } from '@/app/config/routes';
import ProductCard from '@/shared/components/ProductCard';
import ProductModal from './ProductModal';

export default function ProductList({ products }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isUpdating } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    await addToCart(product.id, 1);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            isAdding={isUpdating}
          />
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
        isAdding={isUpdating}
      />
    </>
  );
}
