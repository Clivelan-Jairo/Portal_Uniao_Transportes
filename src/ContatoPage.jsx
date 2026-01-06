import { FaWhatsapp, FaPhoneAlt, FaEnvelopeOpenText, FaMapMarkerAlt, FaClock, FaShieldAlt, FaRoute, FaArrowRight } from 'react-icons/fa';
import { HashLink } from 'react-router-hash-link';
import './ContatoPage.css';

function ContatoPage() {
  return (
    <section className="contact-page">
      <div className="contact-bg" aria-hidden="true" />
      <div className="contact-noise" aria-hidden="true" />

      <div className="container contact-shell fade-up">
        <div className="contact-header">
          <span className="contact-eyebrow">Fale com a União</span>
          <h2>Operação logística com resposta rápida</h2>
          <p>Centralizamos WhatsApp, telefone e e-mail para acelerar cotações, coletas e atendimento a ocorrências. Escolha o canal, envie detalhes e respondemos em minutos.</p>
          <div className="contact-tags">
            <span className="tag chip">Tempo médio: 15 min</span>
            <span className="tag chip">Suporte Norte + Centro-Oeste</span>
            <span className="tag chip">Monitoramento de cargas</span>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-panel contact-brief">
            <div className="contact-cta-card">
              <div className="cta-text">
                <p className="label">Atendimento imediato</p>
                <h3>Conecte com o time agora</h3>
                <p className="muted">Prioridade para coletas urgentes, pendências e ocorrências em rota.</p>
              </div>
              <div className="cta-actions">
                <a className="btn channel whatsapp" href="https://wa.me/5593992040474" target="_blank" rel="noreferrer">
                  <FaWhatsapp /> WhatsApp
                </a>
                <a className="btn channel phone" href="tel:+5593992o40474">
                  <FaPhoneAlt /> Ligar agora
                </a>
                <a className="btn channel mail" href="mailto:santarem@uniaotransportes.com">
                  <FaEnvelopeOpenText /> Enviar e-mail
                </a>
              </div>
            </div>

            <div className="contact-stats">
              <div className="stat">
                <FaClock />
                <div>
                  <p className="label">SALA de resposta</p>
                  <strong>≤ 15 minutos</strong>
                </div>
              </div>
              <div className="stat">
                <FaShieldAlt />
                <div>
                  <p className="label">Seguro & rastreio</p>
                  <strong>Cargas monitoradas</strong>
                </div>
              </div>
              <div className="stat">
                <FaRoute />
                <div>
                  <p className="label">Cobertura</p>
                  <strong>PA • MT • Rotas chave</strong>
                </div>
              </div>
            </div>

            <div className="contact-location">
              <div className="loc-icon"><FaMapMarkerAlt /></div>
              <div>
                <p className="label">Central de atendimento</p>
                <strong>Santarém • Belém • Novo Progresso • Sinop</strong>
                <p className="muted">Coordenação de operações Norte + Centro-Oeste com apoio multimodal.</p>
              </div>
              <HashLink className="loc-cta" to="/#unidades">
                Ver unidades <FaArrowRight />
              </HashLink>
            </div>
          </div>

          <div className="contact-panel contact-form-card">
            <div className="form-head">
              <h3>Envie uma mensagem</h3>
              <p>Conte o que precisa (tipo de carga, origem/destino, prazos). Respondemos rápido.</p>
            </div>

            <form className="contato-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nome</label>
                  <input type="text" id="name" name="name" placeholder="Seu nome completo" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="voce@empresa.com" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Telefone/WhatsApp</label>
                  <input type="tel" id="phone" name="phone" placeholder="(91) 99999-9999" />
                </div>
                <div className="form-group">
                  <label htmlFor="cidade">Cidade</label>
                  <input type="text" id="cidade" name="cidade" placeholder="Ex: Santarém / Sinop" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensagem</label>
                <textarea id="message" name="message" rows="5" placeholder="Ex: Coleta de carga fracionada, origem Belém -> Sinop, urgência para amanhã." required></textarea>
              </div>

              <div className="form-footer">
                <button type="submit" className="btn-primary">Enviar mensagem</button>
                <div className="form-note">Tempo médio de resposta: <strong>15 min</strong></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContatoPage;