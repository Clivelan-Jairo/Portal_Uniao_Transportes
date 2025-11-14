import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

function Header() {
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
          <nav>
            <ul>
              <li><HashLink to="/#inicio">Início</HashLink></li>
              <li><HashLink to="/#servicos">Serviços</HashLink></li>
              <li><HashLink to="/#unidades">Unidades</HashLink></li>
              <li><Link to="/sobre">Sobre</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;