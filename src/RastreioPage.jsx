import { useState, useRef } from 'react'; // Mantemos o useState para controlar os inputs
import './RastreioPage.css';

function RastreioPage() {
  const [cnpjdest, setCnpjdest] = useState('');
  const [numeroNota, setNumeroNota] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultHtml, setResultHtml] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [resultSuccess, setResultSuccess] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
  const iframeRef = useRef(null);

  const handleLimpar = () => {
    setCnpjdest('');
    setNumeroNota('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cnpjdest.trim() === '') {
      alert('Informe o CNPJ do destinatário.');
      return;
    }

    if (numeroNota.trim() === '') {
      alert('Informe pelo menos uma Nota Fiscal.');
      return;
    }

    // Sanitiza CNPJ (somente dígitos) e valida comprimento
    const cnpjClean = cnpjdest.replace(/\D/g, '');
    if (cnpjClean.length !== 14) {
      alert('Informe um CNPJ válido com 14 dígitos (somente números).');
      return;
    }

    // Normaliza o campo de notas: remove linhas vazias e trims
    const nrClean = numeroNota
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .join('\n');
    if (nrClean === '') {
      alert('Informe pelo menos uma Nota Fiscal.');
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setResultHtml(null);

        // Constrói o endpoint de forma segura:
        // - Se `VITE_API_BASE` estiver definido explicitamente, usa-o (útil para testar apontando diretamente a outro host).
        // - Caso contrário, usa caminho relativo `/api/trackingdest` para que plataformas como Vercel apliquem a rewrite/proxy
        //   definida em `vercel.json` e assim evitar bloqueio CORS ao chamar o backend remoto.
        const API_BASE = import.meta.env.VITE_API_BASE || '';
        let endpoint = '/api/trackingdest';
        if (API_BASE) {
          const base = String(API_BASE).replace(/\/$/, '');
          // Se API_BASE for um caminho relativo ou absoluto, montamos o endpoint com ele.
          endpoint = `${base}/api/trackingdest`;
        }
        const body = new URLSearchParams();
        body.append('cnpjdest', cnpjClean);
        // Alguns endpoints aceitam o nome 'cnpj' em vez de 'cnpjdest'.
        // Enviamos também para compatibilidade com variações do backend.
        body.append('cnpj', cnpjClean);
        // Enviar cada nota como parâmetro 'nro_nf' (muitos backends esperam esse nome)
        const nrLines = nrClean.split('\n').filter(Boolean);
        // mantém compatibilidade com o campo antigo
        body.append('NR', nrClean);
        nrLines.forEach((line) => body.append('nro_nf', line));
        body.append('urlori', 'https://ssw.inf.br/ajuda/rastreamentodestnf.html');

        // Log do payload que será enviado (apenas para depuração local)
        console.log('Rastreio: payload', body.toString());

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Accept': 'application/xml, text/xml, */*'
          },
          body: body.toString()
        });

        if (!res.ok) throw new Error(`Erro na API: ${res.status} ${res.statusText}`);

        const text = await res.text();
        // Log da resposta bruta do servidor para depuração
        console.log('Rastreio: resposta bruta da API:', text);

        // Se a resposta for XML do tipo <tracking>, converte para HTML legível
        let htmlResult = text;
        const trimmed = text.trim();
        if (trimmed.startsWith('<?xml') || trimmed.startsWith('<tracking')) {
          try {
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'application/xml');
            const msg = xml.querySelector('message')?.textContent || '';
            const successText = xml.querySelector('success')?.textContent || '';
            const successFlag = String(successText).toLowerCase() === 'true';
            setResultSuccess(successFlag);
            setResultMessage(msg || '');
            const remetente = xml.querySelector('header > remetente')?.textContent || '';
            const destinatario = xml.querySelector('header > destinatario')?.textContent || '';

            const items = xml.querySelectorAll('items > item');
            let itemsHtml = '';

            // Escolhe um SVG inline apropriado para o tipo/ocorrência
            function pickIconSvg(ocorrenciaText) {
              const oc = String(ocorrenciaText || '').toUpperCase();
              if (oc.includes('DOCUMENTO') || oc.includes('EMITIDO')) {
                // document / emission icon
                return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fill="#0b4ea2" d="M6 2h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/>
                    <path fill="#fff" d="M8 9h8v1H8zM8 12h8v1H8z"/>
                  </svg>`;
              }
              if (oc.includes('SAIDA') || oc.includes('SAÍDA') || oc.includes('SAI')) {
                // truck / departure icon
                return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fill="#0b4ea2" d="M3 6h13v7h3l3 3v1h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3V6z"/>
                  </svg>`;
              }
              if (oc.includes('CHEGADA') || oc.includes('CHEGOU') || oc.includes('ENTRADA')) {
                // arrival / location icon
                return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fill="#0b4ea2" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z"/>
                    <circle cx="12" cy="9" r="2.2" fill="#fff"/>
                  </svg>`;
              }
              if (oc.includes('ENTREG') || oc.includes('ENTREGUE')) {
                // delivered / box icon
                return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path fill="#0b4ea2" d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/>
                    <path fill="#fff" d="M9.5 12.5l2 2 4-4" stroke="#fff" stroke-width="0.8" fill="none"/>
                  </svg>`;
              }
              // default info icon
              return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle cx="12" cy="12" r="10" fill="#0b4ea2" />
                  <rect x="11" y="10" width="2" height="6" fill="#fff" />
                  <rect x="11" y="7" width="2" height="2" fill="#fff" />
                </svg>`;
            }

            items.forEach((it, idx) => {
              const data = it.querySelector('data_hora')?.textContent || '';
              const cidade = it.querySelector('cidade')?.textContent || '';
              const ocorrencia = it.querySelector('ocorrencia')?.textContent || '';
              const descricao = it.querySelector('descricao')?.textContent || '';
              const tipo = it.querySelector('tipo')?.textContent || '';
              const iconSvg = pickIconSvg(ocorrencia || tipo);
              itemsHtml += `
                <div class="rastreio-item">
                  <div class="rastreio-item-icon">${iconSvg}</div>
                  <div class="rastreio-item-body">
                    <div class="rastreio-item-head">${escapeHtml(data)} — ${escapeHtml(ocorrencia)}</div>
                    <div class="rastreio-item-desc">${escapeHtml(descricao)}</div>
                    <div class="rastreio-item-meta">${escapeHtml(cidade)} • ${escapeHtml(tipo)}</div>
                  </div>
                </div>
                <div class="rastreio-route-line" aria-hidden></div>
              `;
            });

            // helper para escapar texto
            function escapeHtml(s) {
              return String(s)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
            }

            // Detecta situação de 'não encontrado': success=false ou sem items ou mensagem indicando "nenhum"
            const isNotFound = (!successFlag) || (items.length === 0) || (/nenhum|nao encontrado|n[oã]o encontrado/i.test(msg));

            if (isNotFound) {
              // Para não duplicar mensagens, limpamos resultMessage (o componente exibirá o HTML que geramos)
              setResultSuccess(false);
              setResultMessage('');

              // SVG de X vermelho e mensagem simples; não mostramos remetente/destinatário
              htmlResult = `
                <div class="rastreio-notfound">
                  <div class="rastreio-notfound-icon" aria-hidden>
                    <svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <circle cx="12" cy="12" r="10" fill="#f8d7da" />
                      <path d="M7 7 L17 17 M17 7 L7 17" stroke="#c0392b" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="rastreio-notfound-text">Nenhum documento localizado</div>
                </div>
              `;
            } else {
              // Resultado normal: mostramos mensagem, remetente/destinatário e eventos
              htmlResult = `
                <div class="rastreio-result-inner">
                  <div class="rastreio-result-header">
                    <h3 class="rastreio-result-title">${escapeHtml(msg)}</h3>
                    <p class="rastreio-result-meta"><strong>Remetente:</strong> ${escapeHtml(remetente)}<br/><strong>Destinatário:</strong> ${escapeHtml(destinatario)}</p>
                  </div>
                  <div class="rastreio-items">${itemsHtml}</div>
                </div>
              `;
            }
          } catch (parseErr) {
            console.error('Erro ao parsear XML de rastreio:', parseErr);
            htmlResult = text; // fallback: mostra o raw
          }
        }

        setResultHtml(htmlResult);
        setShowResult(true);
        // rolar para o resultado
        setTimeout(() => { if (iframeRef.current) iframeRef.current.scrollIntoView({ behavior: 'smooth' }); }, 50);
      } catch (err) {
        console.error(err);
        const msg = (err && err.message) ? String(err.message) : String(err);
        // Detecta falhas típicas de CORS / network e provê instruções úteis ao usuário/admin
        if (/failed to fetch|networkerror|cors/i.test(msg)) {
          alert('Erro de rede/CORS ao consultar API. Verifique se o site aplica uma reescrita/proxy para `/api/*` apontando para o backend (ex.: `https://ssw.inf.br`) ou se o backend permite a origem desta página. Detalhe: ' + msg);
        } else {
          alert('Erro ao consultar API: ' + msg);
        }
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <div className="container rastreio-page-container fade-up">
      <div className="rastreio-image-container">
        <img src="/img/rastreio.png" alt="Nova ilustração para a página de rastreamento" />
      </div>
      <div className="rastreio-form-container">
        {!showResult && (
          <>
            <div className="page-title-container">
              <h2>Rastreio de Encomendas</h2>
            </div>
            <p>Digite o CNPJ do destinatário e o número da nota fiscal para acompanhar sua entrega.</p>
          </>
        )}
        
        {!showResult && (
        <form 
          className="rastreio-form" 
          name="form1"
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
        )}
        {/* Resultado retornado pela API renderizado (substitui o formulário quando showResult=true) */}
        <div className="rastreio-result" style={{ marginTop: '1rem' }}>
          {loading && <p>Carregando resultados...</p>}

          {!loading && showResult && (
            <div>
              {/* aviso de sucesso/erro */}
              {resultSuccess ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <div className="found-animation" aria-hidden>
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                      <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="#0a7a2a" strokeWidth="2" />
                      <path className="checkmark__check" fill="none" stroke="#0a7a2a" strokeWidth="4" d="M14 27l7 7 17-17" />
                    </svg>
                  </div>
                </div>
              ) : (
                // Só mostra o aviso laranja se houver uma mensagem explícita para exibir.
                resultMessage ? (
                  <div style={{ background: '#fff4e5', color: '#7a520a', border: '1px solid #f0d9b5', padding: '10px 12px', borderRadius: 6, marginBottom: 12 }}>
                    {resultMessage}
                  </div>
                ) : null
              )}

              {/* Conteúdo formatado do rastreio */}
              <div ref={iframeRef} className="rastreio-result-box" dangerouslySetInnerHTML={{ __html: resultHtml }} />

              {/* botão para nova consulta (centralizado) */}
              <div className="rastreio-new-btn-wrap">
                <button className="btn-secondary rastreio-new-btn" onClick={() => {
                  setShowResult(false);
                  setResultHtml(null);
                  setResultSuccess(false);
                  setResultMessage('');
                  setCnpjdest('');
                  setNumeroNota('');
                }}>Fazer nova consulta</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RastreioPage;