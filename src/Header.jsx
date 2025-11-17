import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaEnvelope, FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header id="header">
      {/* Linha superior com contatos e rastreio */}
      <div className="header-top-bar">
        <div className="contact-info">
          <span>
            <FaEnvelope /> santarem@uniaotransportesstm.com.br
          </span>
          <span>
            <FaPhoneAlt /> (93) 99204-7404
          </span>
        </div>
        <div className="header-top-links">
          <Link to="/rastreio">Rastreamento</Link>
        </div>
      </div>

      {/* Linha principal com logo e navegação */}
      <div className="header-main">
        <div className="container header-main-container">
          <div className="logo">
            <img src="/img/logo.png" alt="União Transportes" />
          </div>

          {/* Botão de menu (visível em telas pequenas) */}
          <button
            className="menu-toggle"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <nav className={menuOpen ? 'open' : ''}>
            <ul className={menuOpen ? 'open' : ''}>
              <li><HashLink to="/#inicio" onClick={closeMenu}>Início</HashLink></li>
              <li><HashLink to="/#servicos" onClick={closeMenu}>Serviços</HashLink></li>
              <li><HashLink to="/#unidades" onClick={closeMenu}>Unidades</HashLink></li>
              <li><Link to="/sobre" onClick={closeMenu}>Sobre</Link></li>
              <li><Link to="/contato" onClick={closeMenu}>Contato</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;