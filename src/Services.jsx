import './Services.css';

function Services() {
  return (
    <section id="servicos" className="services fade-up">
      <h2>Nossos Serviços</h2>
      <div className="cards">
        <article className="service-card">
          <div className="service-media">
            <img src="/img/transporte_rodoviario.png" alt="Transporte Rodoviário" />
          </div>
          <div className="service-body">
            <h3>Transporte Rodoviário</h3>
            <p>
              A União Transportes é especializada em transporte rodoviário de cargas, oferecendo soluções ágeis, seguras e eficientes para empresas que operam nos estados do Pará e Mato Grosso. Atuamos estrategicamente nas principais rotas da região, incluindo corredores logísticos fundamentais como a BR-163, garantindo rapidez no deslocamento entre as cidades atendidas e maior confiabilidade na entrega.

              Nossa operação conta com uma frota moderna, motoristas experientes e acompanhamento completo das cargas, proporcionando ao cliente transparência e tranquilidade durante todo o processo. Priorizamos a integridade da mercadoria, o cumprimento dos prazos e a excelência no atendimento.

              A União Transportes é a parceira ideal para quem busca um transporte rodoviário eficiente, com cobertura sólida na Amazônia e no Centro-Oeste, unindo qualidade operacional e compromisso com cada entrega.
            </p>
            <a href="/contato" className="card-link">Saiba Mais</a>
          </div>
        </article>

        <article className="service-card reverse">
          <div className="service-media">
            <img src="/img/gestao.png" alt="Gestão de Cargas" />
          </div>
          <div className="service-body">
            <h3>Gestão de Cargas</h3>
            <p>
              A União Transportes oferece um serviço completo de Gestão de Cargas, garantindo controle total, precisão nas informações e eficiência em cada etapa da operação logística. Atuamos desde o recebimento até a entrega final, com processos padronizados e tecnologia integrada para assegurar que cada carga seja monitorada com segurança e transparência.

              Com sistemas atualizados e equipe especializada, acompanhamos o status das mercadorias em tempo real, registramos movimentações, prevenimos atrasos e asseguramos que o cliente tenha sempre acesso às informações essenciais para seu planejamento. Nosso foco é otimizar rotas, reduzir custos e proporcionar uma experiência logística confiável tanto no Pará quanto no Mato Grosso.

              A União Transportes trabalha para que cada carga seja tratada com máxima responsabilidade, eficiência operacional e compromisso com prazos, fortalecendo a relação com nossos clientes e garantindo resultados consistentes.
            </p>
            <a href="/contato" className="card-link">Saiba Mais</a>
          </div>
        </article>

        <article className="service-card">
          <div className="service-media">
            <img src="/img/logistica.png" alt="Logística e Armazenagem" />
          </div>
          <div className="service-body">
            <h3>Logística e Armazenagem</h3>
            <p>
              A União Transportes oferece soluções completas de Logística e Armazenagem, garantindo organização, segurança e eficiência em todas as etapas do fluxo de mercadorias. Nossas estruturas são preparadas para receber, armazenar e distribuir cargas com controle rigoroso, seguindo padrões que asseguram integridade e rastreabilidade total.

              Contamos com processos bem definidos, conferência precisa, gestão de estoque otimizada e movimentação interna organizada, permitindo agilidade nas entradas e saídas. Unimos tecnologia e equipe especializada para oferecer ao cliente máxima visibilidade sobre seus produtos e total confiabilidade na operação.

              Com atuação estratégica no Pará e no Mato Grosso, a União Transportes integra armazenagem e transporte de forma inteligente, reduzindo prazos, diminuindo custos e garantindo que cada carga siga seu destino da maneira mais eficiente possível.
            </p>
            <a href="/contato" className="card-link">Saiba Mais</a>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Services;