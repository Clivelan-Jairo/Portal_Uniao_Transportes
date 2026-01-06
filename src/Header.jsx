import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  // Atualiza a variável CSS --header-height com base na altura real da pill
  useEffect(() => {
    const updateHeaderHeight = () => {
      const pill = document.querySelector('.header-pill');
      if (!pill) return;
      const rect = pill.getBoundingClientRect();
      const headerHeight = Math.ceil(rect.top + rect.height);
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <div id="header" className="header-wrapper">
      {/* Cabeçalho flutuante estilo 'pill' */}
      <div className="header-pill">
        <div className="pill-left logo">
          <img src="/img/logo.png" alt="União Transportes" />
        </div>

        <nav className="pill-nav">
          <ul>
            <li><HashLink to="/#inicio" onClick={closeMenu}>Início</HashLink></li>
            <li><HashLink to="/#servicos" onClick={closeMenu}>Serviços</HashLink></li>
            <li><HashLink to="/#unidades" onClick={closeMenu}>Unidades</HashLink></li>
            <li><HashLink to="/#cidades" onClick={closeMenu}>Cidades atendidas</HashLink></li>
            <li><Link to="/sobre" onClick={closeMenu}>Sobre</Link></li>
            <li><Link to="/contato" onClick={closeMenu}>Contato</Link></li>
          </ul>
        </nav>

        <div className="pill-right">
          <Link to="/perfil" className="pill-profile" onClick={closeMenu} aria-label="Perfil">
            <FaUser />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="menu-toggle"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile menu dropdown */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-profile">
            <Link to="/perfil" onClick={closeMenu} aria-label="Ir para perfil">
              <FaUser />
              <span>Perfil</span>
            </Link>
          </div>
          <ul className="mobile-menu-links">
            <li><HashLink to="/#inicio" onClick={closeMenu}>Início</HashLink></li>
            <li><HashLink to="/#servicos" onClick={closeMenu}>Serviços</HashLink></li>
            <li><HashLink to="/#unidades" onClick={closeMenu}>Unidades</HashLink></li>
            <li><HashLink to="/#cidades" onClick={closeMenu}>Cidades atendidas</HashLink></li>
            <li><Link to="/sobre" onClick={closeMenu}>Sobre</Link></li>
            <li><Link to="/contato" onClick={closeMenu}>Contato</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;