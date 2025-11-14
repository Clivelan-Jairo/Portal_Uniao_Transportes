import './ContatoPage.css';

function ContatoPage() {
  return (
    <div className="container contato-container fade-up">
      <div className="page-title-container">
        <h2>Entre em Contato</h2>
      </div>
      <p>Tem alguma dúvida ou precisa de uma cotação? Preencha o formulário abaixo.</p>
      <form className="contato-form">
        <div className="form-group">
          <label htmlFor="name">Nome</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Mensagem</label>
          <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button type="submit" className="btn-primary">Enviar Mensagem</button>
      </form>
    </div>
  );
}

export default ContatoPage;