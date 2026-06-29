import { Link } from 'react-router-dom';
import {
  buildInstagramUrl,
  buildMailtoUrl,
  buildWhatsappUrl,
  formatWhatsappDisplay,
} from '@/shared/utils/storeContact';
import '../../styles/components/Footer.css';

function Footer({ settings = null }) {
  const showBrand = settings && (settings.store_name || settings.description);
  const showContact = settings && (settings.whatsapp || settings.email || settings.address);
  const showSocial = settings && settings.instagram;

  const whatsappDisplay = settings ? formatWhatsappDisplay(settings.whatsapp) : null;
  const whatsappUrl = settings ? buildWhatsappUrl(settings.whatsapp) : null;
  const emailUrl = settings ? buildMailtoUrl(settings.email) : null;
  const instagramUrl = settings ? buildInstagramUrl(settings.instagram) : null;

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {showBrand && (
          <div className="footer-section brand-info">
            {settings.store_name && (
              <strong className="footer-logo">{settings.store_name}</strong>
            )}

            {settings.description && (
              <p className="footer-description">{settings.description}</p>
            )}
          </div>
        )}

        <div className="footer-section">
          <h4 className="footer-title">Navegação</h4>

          <ul className="footer-links">
            <li>
              <Link to="/">Início</Link>
            </li>
          </ul>
        </div>

        {showContact && (
          <div className="footer-section">
            <h4 className="footer-title">Contato</h4>

            <ul className="footer-contact">
              {settings.whatsapp && whatsappDisplay && (
                <li>
                  {whatsappUrl ? (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {whatsappDisplay}
                    </a>
                  ) : (
                    whatsappDisplay
                  )}
                </li>
              )}

              {settings.email && (
                <li>
                  {emailUrl ? (
                    <a href={emailUrl}>{settings.email}</a>
                  ) : (
                    settings.email
                  )}
                </li>
              )}

              {settings.address && <li>{settings.address}</li>}
            </ul>
          </div>
        )}

        {showSocial && (
          <div className="footer-section">
            <h4 className="footer-title">Siga-nos</h4>

            <div className="footer-socials">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()}
          {settings?.store_name ? ` ${settings.store_name}.` : ''}
          {' '}Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
