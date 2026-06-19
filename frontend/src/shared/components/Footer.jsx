import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Footer.css';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">

        {/* Sobre */}
        <div className="footer-section brand-info">
          <strong className="footer-logo">SaborFit</strong>

          <p className="footer-description">
            Marmitas saudáveis e práticas para o seu dia a dia.
            Sabor e saúde em perfeito equilíbrio.
          </p>
        </div>

        {/* Navegação */}
        <div className="footer-section">
          <h4 className="footer-title">Navegação</h4>

          <ul className="footer-links">
            <li>
              <Link to="/">Início</Link>
            </li>

            <li>
              <Link to="/cardapio">Cardápio</Link>
            </li>

            <li>
              <Link to="/sobre">Sobre Nós</Link>
            </li>

            <li>
              <Link to="/faq">Dúvidas Frequentes</Link>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div className="footer-section">
          <h4 className="footer-title">Contato</h4>

          <ul className="footer-contact">
            <li>(11) 99999-9999</li>
            <li>suporte@saborfit.com.br</li>
            <li>São Paulo, SP</li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div className="footer-section">
          <h4 className="footer-title">Siga-nos</h4>

          <div className="footer-socials">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>

      </div>

      {/* Direitos Autorais */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} SaborFit - Marmitas Saudáveis.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;