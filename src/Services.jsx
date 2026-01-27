import { useEffect, useRef } from 'react';
import { FaTruck, FaBoxes, FaCheckCircle, FaShieldAlt, FaClock, FaArrowRight, FaRoad, FaChartLine } from 'react-icons/fa';
import './Services.css';

function Services() {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const cards = Array.from(root.querySelectorAll('.service-card'));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );

    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  const features = [
    { icon: FaShieldAlt, label: 'Cargas Seguradas' },
    { icon: FaClock, label: 'Prazos Cumpridos' },
    { icon: FaCheckCircle, label: 'Rastreamento 24/7' }
  ];

  return (
    <section id="servicos" className="services">
      <div className="services-bg" aria-hidden="true" />
      <div className="services-noise" aria-hidden="true" />
      
      <div className="container services-shell">
        {/* HEADER */}
        <div className="services-header">
          <div className="header-top">
            <span className="services-eyebrow">Soluções Completas</span>
            <h2>Soluções logísticas integradas</h2>
          </div>
          <p className="header-desc">Da coleta à entrega, nossa operação garante segurança, eficiência e transparência em cada etapa</p>
          
          {/* Features em grid */}
          <div className="features-grid">
            {features.map((Feature, idx) => (
              <div key={idx} className="feature-item">
                <Feature.icon />
                <span>{Feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SERVICES CARDS */}
        <div className="cards" ref={containerRef}>
          {/* CARD 1: Transporte Rodoviário */}
          <article className="service-card primary">
            <div className="card-header">
              <div className="card-icon-circle transport">
                <FaTruck />
              </div>
              <div className="card-title-section">
                <h3>Transporte Rodoviário</h3>
                <p className="card-subtitle">Mobilidade eficiente por toda região</p>
              </div>
            </div>

            <div className="card-content">
              <div className="card-description">
                <p>Operamos uma frota moderna com cobertura estratégica nas principais rotas da Amazônia e Centro-Oeste.</p>
              </div>

              <div className="card-features">
                <div className="feature">
                  <FaRoad className="feature-icon" />
                  <div>
                    <h4>Rotas Otimizadas</h4>
                    <p>BR-163 e corredores logísticos principais</p>
                  </div>
                </div>
                <div className="feature">
                  <FaCheckCircle className="feature-icon" />
                  <div>
                    <h4>Monitoramento Total</h4>
                    <p>Rastreamento em tempo real de sua carga</p>
                  </div>
                </div>
                <div className="feature">
                  <FaTruck className="feature-icon" />
                  <div>
                    <h4>Frota Moderna</h4>
                    <p>Veículos bem mantidos e drivers experientes</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 2: Gestão de Cargas */}
          <article className="service-card secondary">
            <div className="card-header">
              <div className="card-icon-circle control">
                <FaBoxes />
              </div>
              <div className="card-title-section">
                <h3>Gestão de Cargas</h3>
                <p className="card-subtitle">Controle total de sua operação</p>
              </div>
            </div>

            <div className="card-content">
              <div className="card-description">
                <p>Sistema integrado para monitoramento, controle e otimização de todas as suas operações logísticas.</p>
              </div>

              <div className="card-features">
                <div className="feature">
                  <FaChartLine className="feature-icon" />
                  <div>
                    <h4>Relatórios Detalhados</h4>
                    <p>Visibilidade completa de suas operações</p>
                  </div>
                </div>
                <div className="feature">
                  <FaCheckCircle className="feature-icon" />
                  <div>
                    <h4>Controle Preciso</h4>
                    <p>Registro e acompanhamento de movimentações</p>
                  </div>
                </div>
                <div className="feature">
                  <FaClock className="feature-icon" />
                  <div>
                    <h4>Suporte 24/7</h4>
                    <p>Equipe disponível quando você precisar</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 3: Logística */}
          <article className="service-card tertiary">
            <div className="card-header">
              <div className="card-icon-circle storage">
                <FaChartLine />
              </div>
              <div className="card-title-section">
                <h3>Logística</h3>
                <p className="card-subtitle">Soluções logísticas completas</p>
              </div>
            </div>

            <div className="card-content">
              <div className="card-description">
                <p>Infraestrutura moderna com processos padronizados para receber, controlar e distribuir suas cargas com segurança.</p>
              </div>

              <div className="card-features">
                <div className="feature">
                  <FaCheckCircle className="feature-icon" />
                  <div>
                    <h4>Controle Total</h4>
                    <p>Gestão de estoque otimizada</p>
                  </div>
                </div>
                <div className="feature">
                  <FaShieldAlt className="feature-icon" />
                  <div>
                    <h4>Segurança</h4>
                    <p>Estruturas preparadas e monitoradas</p>
                  </div>
                </div>
                <div className="feature">
                  <FaChartLine className="feature-icon" />
                  <div>
                    <h4>Redução de Custos</h4>
                    <p>Operações inteligentes e eficientes</p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* CTA SECTION */}
          <div className="services-cta">
            <h3>Pronto para melhorar sua logística?</h3>
            <p>Solicite uma consultoria gratuita e descubra como podemos otimizar sua operação</p>
            <a href="https://wa.me/5593992040474?text=Gostaria%20de%20solicitar%20uma%20consultoria%20gratuita%20para%20melhorar%20minha%20log%C3%ADstica" target="_blank" rel="noopener noreferrer" className="cta-primary-btn">Solicitar Consultoria</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;