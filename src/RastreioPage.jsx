import { useState, useRef } from 'react'; // Mantemos o useState para controlar os inputs
import './RastreioPage.css';

function RastreioPage() {
  const [cnpjdest, setCnpjdest] = useState('');
  const [numeroNota, setNumeroNota] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLimpar = () => {
    setCnpjdest('');
    setNumeroNota('');
  };

  const handleSubmit = (e) => {
    if (cnpjdest.trim() === '') {
      e.preventDefault();
      alert('Informe o CNPJ do destinatário.');
    } else if (numeroNota.trim() === '') {
      e.preventDefault();
      alert('Informe pelo menos uma Nota Fiscal.');
    } else {
      // permite o envio do form via POST em nova aba (comportamento anterior)
      setLoading(true);
    }
  };

  return (
    <div className="container rastreio-page-container fade-up">
      <div className="rastreio-image-container">
        <img src="/img/rastreio.png" alt="Nova ilustração para a página de rastreamento" />
      </div>
      <div className="rastreio-form-container">
        <div className="page-title-container">
          <h2>Rastreio de Encomendas</h2>
        </div>
        <p>Digite o CNPJ do destinatário e o número da nota fiscal para acompanhar sua entrega.</p>
        
        <form 
          className="rastreio-form" 
          name="form1"
          action="https://ssw.inf.br/2/ssw_resultSSW_dest_nro" 
          method="post"
          target="ssw_iframe" // envia o resultado para o iframe embutido
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="cnpjdest">CNPJ do destinatário:</label>
            <input type="text" id="cnpjdest" name="cnpjdest" maxLength="14" value={cnpjdest} onChange={(e) => setCnpjdest(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="numeroNota">Notas Fiscais (uma por linha)</label>
            <textarea id="numeroNota" name="NR" rows="5" value={numeroNota} onChange={(e) => setNumeroNota(e.target.value)} required></textarea>
          </div>
          
          <input type="hidden" name="urlori" value="https://ssw.inf.br/ajuda/rastreamentodestnf.html" />
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">Rastrear</button>
            <button type="button" className="btn-secondary" onClick={handleLimpar}>Limpar</button>
          </div>
        </form>

        {/* volta ao comportamento anterior: abre em nova aba */}
        {/* nada a renderizar aqui */}
      </div>
    </div>
  );
}

export default RastreioPage;