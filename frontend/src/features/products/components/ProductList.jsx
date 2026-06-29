import { useNavigate } from 'react-router-dom';
import { useCart } from '@/app/contexts/useCart';
import { useAuth } from '@/app/contexts/useAuth';
import { ROUTES } from '@/app/config/routes';
import ProductCard from '@/shared/components/ProductCard';

export default function ProductList({ products }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isUpdating } = useCart();

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    await addToCart(product.id, 1);
  };

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          isAdding={isUpdating}
        />
      ))}
    </div>
  );
}
