function HeroSection() {
  return (
    <section id="inicio" className="hero" aria-label="Seção inicial">
      <div className="hero-overlay" />
      <div className="hero-inner container">
        <div className="hero-content">
          <h1>Transporte Rodoviário com<br/><strong>Segurança e Confiabilidade</strong></h1>
          <p className="hero-sub">Logística eficiente ligando o Norte ao Brasil</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="/rastreio" aria-label="Ir para rastreamento">Rastreamento</a>
            <a className="btn btn-ghost" href="/contato" aria-label="Entrar em contato">Contato</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;