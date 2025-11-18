import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaEnvelope, FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // Define uma variável CSS com a altura do header para ajustar o offset de scroll
  useEffect(() => {
    function setHeaderHeight() {
      const el = headerRef.current;
      if (!el) return;
      const h = el.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${h}px`);
    }

    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    // caso o header mude após imagens carregarem
    window.addEventListener('load', setHeaderHeight);

    // Observe mudanças de tamanho do header (ex.: imagens, mudanças dinâmicas)
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => setHeaderHeight());
      if (headerRef.current) ro.observe(headerRef.current);
    }

    return () => {
      window.removeEventListener('resize', setHeaderHeight);
      window.removeEventListener('load', setHeaderHeight);
      if (ro) ro.disconnect();
    };
  }, []);

  // Helper para rolar até um elemento considerando a altura do header
  function scrollToWithOffset(el) {
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <header id="header" ref={headerRef}>
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
                  <li>
                    <HashLink to="/#inicio" onClick={closeMenu} scroll={scrollToWithOffset}>
                      Início
                      </HashLink>
                  </li>
                  <li>
                      <HashLink to="/#servicos" onClick={closeMenu} scroll={scrollToWithOffset}>
                        Serviços
                      </HashLink>
                  </li>
                  <li>
                      <HashLink to="/#unidades" onClick={closeMenu} scroll={scrollToWithOffset}>
                        Unidades
                      </HashLink>
                  </li>
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