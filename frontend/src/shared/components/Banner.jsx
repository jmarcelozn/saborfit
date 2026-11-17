import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import './css/Banner.css';

const DEFAULT_BANNER = 'https://i.pinimg.com/736x/85/16/4a/85164a16af7ec9e09ce2a694670e25ae.jpg';

function Banner() {
  return (
    <section className="banner" aria-labelledby="banner-title">
      <div className="banner-decoration banner-decoration--one" aria-hidden="true" />
      <div className="banner-decoration banner-decoration--two" aria-hidden="true" />
      <div className="banner-container">
        <div className="banner-text">
          <span className="banner-tag"><Sparkles size={14} aria-hidden="true" /> Confeitaria artesanal</span>
          <h1 id="banner-title" className="banner-title">Seu momento,<br /><em>do seu jeito.</em></h1>
          <p className="banner-subtitle">Bolos personalizados, feitos à mão para celebrar histórias únicas — com cuidado em cada detalhe e sabor em cada camada.</p>
          <div className="banner-actions">
            <Link className="banner-primary" to="/cardapio">Conhecer sabores <ArrowDown size={17} aria-hidden="true" /></Link>
            <Link className="banner-secondary" to="/#encomendas">
              Como encomendar <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="banner-proof" aria-label="Diferenciais">
            <span><strong>100%</strong> artesanal</span>
            <span><strong>Feito</strong> sob encomenda</span>
          </div>
        </div>
        <div className="banner-visual">
          <div className="banner-card">
            <img src={DEFAULT_BANNER} alt="Bolo artesanal decorado em tons delicados" className="banner-image" />
          </div>
          <div className="banner-card-caption">
            <span className="banner-caption-number">01</span>
            <div><p>Criações exclusivas</p><span>para dias inesquecíveis</span></div>
          </div>
          <span className="banner-handwritten" aria-hidden="true">feito para você</span>
        </div>
      </div>
    </section>
  );
}

export default Banner;
