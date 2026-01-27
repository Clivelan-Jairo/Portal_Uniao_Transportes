import { FaRoute, FaTruck, FaWarehouse, FaAnchor } from 'react-icons/fa';
import './SobrePage.css';

function SobrePage() {
  return (
    <section className="about-page">
      <div className="about-bg" aria-hidden="true" />
      <div className="about-noise" aria-hidden="true" />

      <div className="container about-shell fade-up">
        <div className="about-header">
          <span className="about-eyebrow">Nossa História</span>
          <h2>Servir o Pará,Promover resultados</h2>
          <p>Desde Santarém, crescemos para atender todas as cidades do Pará. Com presença em pontos estratégicos, priorizamos a cobertura completa do estado, com foco em segurança, eficiência e transparência — do rodoviário ao apoio multimodal.</p>
        </div>

        <div className="about-grid">
          <div className="about-panel about-story">
            <div className="story-hero">
              <div className="story-hero-text">
                <h3>De origem amazônica ao corredor logístico</h3>
                <p>Operamos rotas estratégicas, integrando cidades-chave e reduzindo prazos com planejamento, tecnologia e gente experiente.</p>
              </div>
              <div className="story-hero-badge">BR-163</div>
            </div>

            <div className="story-chapters">
              <div className="chapter">
                <h4>Missão</h4>
                <p>Atender todas as cidades do Pará com logística confiável, humana e transparente — unindo planejamento, tecnologia e raízes amazônicas.</p>
              </div>
              <div className="chapter">
                <h4>Visão</h4>
                <p>Ser referência em operações ágeis no corredor PA–MT, reconhecida pela segurança das cargas e excelência de atendimento.</p>
              </div>
              <div className="chapter">
                <h4>Compromisso com a região</h4>
                <p>Respeito às rotas, cuidado com pessoas e parceria com clientes locais. Atuamos onde é preciso, do asfalto ao fluvial.</p>
              </div>
              <div className="chapter">
                <h4>Hoje</h4>
                <p>Operação robusta, monitorada e próxima do cliente. Respondemos rápido, planejamos cada trecho e entregamos com consistência.</p>
              </div>
            </div>
          </div>

          <div className="about-panel about-values">
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon"><FaRoute /></div>
                <div>
                  <h4>DNA de rota</h4>
                  <p>Domínio dos corredores PA–MT, leitura de risco e planejamento sob medida.</p>
                </div>
              </div>
              <div className="value-card">
                <div className="value-icon"><FaTruck /></div>
                <div>
                  <h4>Operação que não para</h4>
                  <p>Frota preparada, monitoramento ativo e equipes prontas para reagir rápido.</p>
                </div>
              </div>
              <div className="value-card">
                <div className="value-icon"><FaWarehouse /></div>
                <div>
                  <h4>Transparência e proximidade</h4>
                  <p>Informação clara, acompanhamento contínuo e atendimento próximo ao cliente.</p>
                </div>
              </div>
              <div className="value-card">
                <div className="value-icon"><FaAnchor /></div>
                <div>
                  <h4>Resiliência multimodal</h4>
                  <p>Alternativas fluviais e suporte em áreas remotas para manter a rota viva.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SobrePage;