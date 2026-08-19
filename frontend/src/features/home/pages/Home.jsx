import Banner from '@/shared/components/Banner';
import ProductList from '@/features/products/components/ProductList';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useStoreSettings } from '@/features/settings/hooks/useStoreSettings';
import '../css/Home.css';

import WhatsappIcon from '@/assets/svgs/WhatsApp.svg';

function Home() {
  const { products, loading, error } = useProducts();
  const { settings } = useStoreSettings();

  const whatsappNumber = settings?.whatsapp
    ? settings.whatsapp.replace(/\D/g, '')
    : '';

  const message = encodeURIComponent(
    'Olá! Gostaria de solicitar um orçamento.'
  );

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${message}`
    : '#';

  return (
    <main className="home-container">
      <Banner />

      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Nossos Produtos</h2>
          <p className="section-subtitle">
            Seleção de receitas artesanais preparadas com ingredientes premium
          </p>
        </div>

        {loading && (
          <p className="products-status">
            Carregando produtos...
          </p>
        )}

        {error && !loading && (
          <p className="products-status products-status--error">
            Não foi possível carregar os produtos. Tente novamente mais tarde.
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="products-status">
            Nenhum produto disponível no momento.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductList products={products} />
        )}
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h3>Encomendas Personalizadas</h3>
          <p>
            Crie seu doce perfeito. Consultoria gratuita para eventos especiais.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
          >
            Solicitar Orçamento
          </a>
        </div>
      </section>

      {whatsappNumber && (
        <a
          href={whatsappUrl}
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
        >
          <img
            src={WhatsappIcon}
            alt=""
            className="whatsapp-icon"
          />
        </a>
      )}
    </main>
  );
}

export default Home;