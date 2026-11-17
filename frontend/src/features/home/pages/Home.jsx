import { ArrowRight, CalendarHeart, Check, ClipboardList, MessageCircle, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/app/config/routes';
import Banner from '@/shared/components/Banner';
import ProductList from '@/features/products/components/ProductList';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useStoreSettings } from '@/features/settings/hooks/useStoreSettings';
import WhatsappIcon from '@/assets/svgs/WhatsApp.svg';
import '../css/Home.css';

const steps = [
  { icon: ShoppingBag, number: '01', title: 'Escolha no cardápio', text: 'Explore os sabores e adicione ao carrinho o que deseja encomendar.' },
  { icon: SlidersHorizontal, number: '02', title: 'Monte seu pedido', text: 'Ajuste quantidades e informe a data desejada e os detalhes da encomenda.' },
  { icon: ClipboardList, number: '03', title: 'Revise com calma', text: 'Confira os itens e o resumo do pedido antes de enviar para nossa equipe.' },
  { icon: MessageCircle, number: '04', title: 'Finalize no WhatsApp', text: 'Confirmamos disponibilidade, valor final e pagamento diretamente por lá.' },
];

function Home() {
  const { products, loading, error } = useProducts();
  const { settings } = useStoreSettings();
  const whatsappNumber = settings?.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '';
  const message = encodeURIComponent('Olá! Gostaria de criar um bolo personalizado.');
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${message}` : '#';

  return (
    <main className="home-container" id="main-content">
      <Banner />
      <section className="promise-strip" aria-label="Nossos diferenciais">
        <div className="promise-strip__inner"><span>Ingredientes selecionados</span><i aria-hidden="true">✦</i><span>Produção artesanal</span><i aria-hidden="true">✦</i><span>Design personalizado</span></div>
      </section>
      <section className="products-section" id="cardapio" aria-labelledby="products-title">
        <div className="section-heading-row">
          <div className="section-header"><span className="section-eyebrow">Escolhas queridas</span><h2 className="section-title" id="products-title">Sabores que encantam</h2></div>
          <p className="section-subtitle">Receitas autorais, ingredientes cuidadosos e acabamentos pensados para transformar cada encomenda em uma lembrança bonita.</p>
        </div>
        {loading && <p className="products-status">Preparando nossa vitrine...</p>}
        {error && !loading && <p className="products-status products-status--error">Não foi possível carregar os produtos. Tente novamente mais tarde.</p>}
        {!loading && !error && products.length === 0 && <p className="products-status">Novos sabores estão chegando em breve.</p>}
        {!loading && !error && products.length > 0 && <ProductList products={products} />}
      </section>
      <section className="process-section" id="encomendas" aria-labelledby="process-title">
        <div className="process-section__inner">
          <div className="process-heading">
            <div className="process-intro"><span className="section-eyebrow">Seu pedido, sem complicação</span><h2 id="process-title">Como encomendar</h2></div>
            <p>Organize sua encomenda pelo site e conclua com atendimento pessoal no WhatsApp. É simples, do primeiro clique à confirmação.</p>
          </div>
          <ol className="process-list">
            {steps.map(({ icon: Icon, number, title, text }) => (
              <li className="process-card" key={number}>
                <div className="process-card__top"><span className="process-card__number">{number}</span><span className="process-card__icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span></div>
                <h3>{title}</h3><p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="process-footer">
            <p><span className="process-footer__icon"><Check size={16} aria-hidden="true" /></span>O site organiza seu pedido; disponibilidade, valor final e pagamento são combinados com nossa equipe no WhatsApp.</p>
            <Link className="process-link" to={ROUTES.MENU}>Começar pelo cardápio <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <section className="cta-section" aria-labelledby="cta-title">
        <div className="cta-ornament" aria-hidden="true"><CalendarHeart /></div>
        <div className="cta-content"><span className="section-eyebrow">Vamos celebrar?</span><h2 id="cta-title">Um bolo tão único<br />quanto a sua história.</h2><p>Encontre seus favoritos no cardápio e prepare sua próxima celebração com a gente.</p>
          <Link to={ROUTES.MENU} className="cta-button">Explorar cardápio <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>
      {whatsappNumber && <a href={whatsappUrl} className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp"><img src={WhatsappIcon} alt="" className="whatsapp-icon" /></a>}
    </main>
  );
}

export default Home;
