import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      {/* Footer Content */}
      <div className="footer-content">
        <div className="footer-section">
          <h3>União Transportes</h3>
          <p>Soluções logísticas integradas para a Amazônia e Centro-Oeste.</p>
        </div>

        <div className="footer-section">
          <h3>Contato</h3>
          <ul>
            <li><a href="https://wa.me/5593992040474" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a></li>
            <li><a href="mailto:santarem@uniaotransportes.com">✉️ E-mail</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Navegação</h3>
          <ul>
            <li><a href="#inicio">Início</a></li>
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#cidades">Cidades Atendidas</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Termos de Uso</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2026 União Transportes. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;