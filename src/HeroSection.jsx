import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section id="inicio" className="hero" aria-label="Seção inicial">
      <div className="hero-overlay" />
      <div className="hero-inner container">
        <div className="hero-content">
          <h1>Transportando com<br/><strong>Segurança e Responsabilidade</strong></h1>
          <p className="hero-sub">Logística eficiente conectando o Pará ao Brasil</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/rastreio" aria-label="Ir para rastreamento">Rastreamento</Link>
            <Link className="btn btn-ghost" to="/contato" aria-label="Entrar em contato">Contato</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;