function Services() {
  return (
    <section id="servicos" className="services fade-up">
      <h2>Nossos Serviços</h2>
      <div className="cards">
        <div className="card">
          <div className="card-icon">🚚</div>
          <h3>Transporte Rodoviário</h3>
          <p>Coleta e entrega em todo o território nacional com frota moderna e rastreada, para cargas fracionadas e lotação.</p>
          <a href="/contato" className="card-link">Saiba Mais</a>
        </div>
        <div className="card">
          <div className="card-icon">📦</div>
          <h3>Gestão de Cargas</h3>
          <p>Plataforma online para rastreamento em tempo real, gestão de entregas e relatórios de desempenho logístico.</p>
          <a href="/contato" className="card-link">Saiba Mais</a>
        </div>
        <div className="card">
          <div className="card-icon">🏭</div>
          <h3>Logística e Armazenagem</h3>
          <p>Soluções completas de armazenagem, separação de pedidos (picking) e distribuição para otimizar sua cadeia de suprimentos.</p>
          <a href="/contato" className="card-link">Saiba Mais</a>
        </div>
      </div>
    </section>
  );
}

export default Services;