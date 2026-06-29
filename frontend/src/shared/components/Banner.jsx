import './css/Banner.css';

const DEFAULT_BANNER =
  'https://i.pinimg.com/736x/85/16/4a/85164a16af7ec9e09ce2a694670e25ae.jpg';

function Banner() {
  return (
    <section className="banner">
      <div className="banner-container">

        <div className="banner-text">
          <span className="banner-tag">
            CONFEITARIA • ARTESANAL
          </span>

          <h1 className="banner-title">
            Bolos e doces artesanais
          </h1>

          <p className="banner-subtitle">
            Receitas feitas com ingredientes selecionados,
            perfeitas para tornar qualquer momento especial.
          </p>

          <div className="banner-actions">
            <button className="banner-primary">
              VER CARDÁPIO
            </button>

            <button className="banner-secondary">
              FAZER PEDIDO
            </button>
          </div>
        </div>

        <div className="banner-card">
          <img
            src={DEFAULT_BANNER}
            alt="Bolo artesanal"
            className="banner-image"
          />

          <div className="banner-card-caption">
            <p>Bolos exclusivos</p>
            <span>SABORFIT</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Banner;