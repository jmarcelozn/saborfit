import Banner from '@/shared/components/Banner';
import ProductList from '@/features/products/components/ProductList';
import { useProducts } from '@/features/products/hooks/useProducts';
import '../css/Home.css';

import WhatsappIcon from '@/assets/svgs/WhatsApp.svg';

function Home() {
  const { products, loading, error } = useProducts();

  const phone = '5511999999999';
  const message = encodeURIComponent('Olá! Gostaria de fazer uma encomenda de doces.');
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    <main className="home-container">
      <Banner />
      
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Nossos Produtos</h2>
          <p className="section-subtitle">Seleção de receitas artesanais preparadas com ingredientes premium</p>
        </div>

        {loading && (
          <p className="products-status">Carregando produtos...</p>
        )}

        {error && !loading && (
          <p className="products-status products-status--error">
            Não foi possível carregar os produtos. Tente novamente mais tarde.
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="products-status">Nenhum produto disponível no momento.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductList products={products} />
        )}
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h3>Encomendas Personalizadas</h3>
          <p>Crie seu doce perfeito. Consultoria gratuita para eventos especiais.</p>
          <button className="cta-button">Solicitar Orçamento</button>
        </div>
      </section>

      {/* Botão Flutuante do WhatsApp */}
      <a 
        href={whatsappUrl} 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
      >
        {/* Renderização do SVG importado como imagem */}
        <img src={WhatsappIcon} alt="" className="whatsapp-icon" />
      </a>
    </main>
  );
}

export default Home;
