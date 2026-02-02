// Proxy simples para /api/trackingdest -> https://ssw.inf.br/api/trackingdest
// Coloque este arquivo em `api/trackingdest.js` para que plataformas como Vercel
// executem como uma Serverless Function e evitem bloqueios CORS do browser.

import { XMLParser } from 'fast-xml-parser';

export default async function handler(req, res) {
  // Permite OPTIONS pré-voo (útil se o browser enviar preflight)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const target = 'https://ssw.inf.br/api/trackingdest';
  const url = new URL(req.url, `http://${req.headers.host}`);
  const wantsHtml = url.searchParams.get('format') === 'html' || String(req.headers['accept'] || '').includes('text/html');

  try {
    // Lê o corpo da requisição como texto (ou monta a partir da query string em GET)
    const bodyText = await new Promise((resolve, reject) => {
      if (req.method === 'GET') {
        const params = new URLSearchParams();
        url.searchParams.forEach((value, key) => {
          if (key !== 'format') params.append(key, value);
        });
        resolve(params.toString());
        return;
      }

      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(data));
      req.on('error', err => reject(err));
    });

    const forwardHeaders = {};
    // Encaminha Content-Type se presente
    if (req.headers['content-type']) forwardHeaders['Content-Type'] = req.headers['content-type'];
    // Encaminha Accept se presente
    if (req.headers['accept']) forwardHeaders['Accept'] = req.headers['accept'];
    // Se GET com query, forçamos urlencoded
    if (req.method === 'GET') forwardHeaders['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

    const upstream = await fetch(target, {
      method: req.method === 'GET' ? 'POST' : req.method,
      headers: forwardHeaders,
      body: bodyText || undefined,
    });

    const respText = await upstream.text();

    if (wantsHtml) {
      const trimmed = respText.trim();
      let htmlBody = '';

      if (trimmed.startsWith('<?xml') || trimmed.startsWith('<tracking')) {
        try {
          const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: true, trimValues: true });
          const data = parser.parse(respText);
          const tracking = data.tracking || data;
          const msg = String(tracking.message || 'Rastreio').trim();
          const successText = String(tracking.success ?? '').toLowerCase();
          const successFlag = successText === 'true';
          const header = tracking.header || {};
          const remetente = String(header.remetente || '').trim();
          const destinatario = String(header.destinatario || '').trim();
          let items = tracking.items?.item || [];
          if (!Array.isArray(items)) items = [items].filter(Boolean);

          const isNotFound = (!successFlag) || items.length === 0 || /nenhum|nao encontrado|n[oã]o encontrado/i.test(msg);

          const pickIconSvg = (ocorrenciaText = '') => {
            const oc = String(ocorrenciaText).toUpperCase();
            if (oc.includes('DOCUMENTO') || oc.includes('EMITIDO')) {
              return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path fill="#0b4ea2" d="M6 2h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/>
                  <path fill="#fff" d="M8 9h8v1H8zM8 12h8v1H8z"/>
                </svg>`;
            }
            if (oc.includes('SAIDA') || oc.includes('SAÍDA') || oc.includes('SAI')) {
              return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path fill="#0b4ea2" d="M3 6h13v7h3l3 3v1h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3V6z"/>
                </svg>`;
            }
            if (oc.includes('CHEGADA') || oc.includes('CHEGOU') || oc.includes('ENTRADA')) {
              return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path fill="#0b4ea2" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z"/>
                  <circle cx="12" cy="9" r="2.2" fill="#fff"/>
                </svg>`;
            }
            if (oc.includes('ENTREG') || oc.includes('ENTREGUE')) {
              return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path fill="#0b4ea2" d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/>
                  <path fill="#fff" d="M9.5 12.5l2 2 4-4" stroke="#fff" stroke-width="0.8" fill="none"/>
                </svg>`;
            }
            return `<svg class="rastreio-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="12" cy="12" r="10" fill="#0b4ea2" />
                <rect x="11" y="10" width="2" height="6" fill="#fff" />
                <rect x="11" y="7" width="2" height="2" fill="#fff" />
              </svg>`;
          };

          if (isNotFound) {
            htmlBody = `
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
            const itemsHtml = items.map((it) => {
              const dataHora = it.data_hora || '';
              const cidade = it.cidade || '';
              const ocorrencia = it.ocorrencia || '';
              const descricao = it.descricao || '';
              const tipo = it.tipo || '';
              const iconSvg = pickIconSvg(ocorrencia || tipo);

              return `
                <div class="rastreio-item">
                  <div class="rastreio-item-icon">${iconSvg}</div>
                  <div class="rastreio-item-body">
                    <div class="rastreio-item-head">${dataHora} — ${ocorrencia}</div>
                    <div class="rastreio-item-desc">${descricao}</div>
                    <div class="rastreio-item-meta">${cidade} • ${tipo}</div>
                  </div>
                </div>
                <div class="rastreio-route-line" aria-hidden></div>
              `;
            }).join('');

            htmlBody = `
              <div class="rastreio-result-inner">
                <div class="rastreio-result-header">
                  <h3 class="rastreio-result-title">${msg}</h3>
                  <p class="rastreio-result-meta"><strong>Remetente:</strong> ${remetente}<br/><strong>Destinatário:</strong> ${destinatario}</p>
                </div>
                <div class="rastreio-items">${itemsHtml}</div>
              </div>
            `;
          }
        } catch (parseErr) {
          htmlBody = `<pre style="white-space: pre-wrap;">${respText}</pre>`;
        }
      } else {
        htmlBody = `<pre style="white-space: pre-wrap;">${respText}</pre>`;
      }

      const html = `<!doctype html>
      <html lang="pt-br">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Rastreio | União Transportes</title>
        <style>
          :root { --cor-primaria: #0b4ea2; }
          body { margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #f6f9ff; color: #0b2a4d; }
          .tracking-page { position: relative; overflow: hidden; padding: 56px 0 72px; }
          .tracking-bg { position: absolute; inset: -20% -10% auto -10%; height: 420px; background: linear-gradient(135deg, rgba(0,74,173,0.12), rgba(93,224,230,0.10)); filter: blur(60px); z-index: 0; animation: floaty 15s ease-in-out infinite alternate; }
          .tracking-noise { position: absolute; inset: 0; background-image: radial-gradient(rgba(0,0,0,0.045) 1px, transparent 0); background-size: 18px 18px; opacity: 0.12; z-index: 0; pointer-events: none; }
          .tracking-shell { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 0 20px; }
          .tracking-panel { background: #fff; border-radius: 18px; box-shadow: 0 18px 40px rgba(2,18,44,0.12); border: 1px solid rgba(0,0,0,0.03); padding: 1.5rem; }
          .rastreio-result-box { width: 100%; border: 1px solid rgba(0,74,173,0.12); border-radius: 12px; background: #fbfdff; padding: 12px; box-shadow: 0 10px 24px rgba(2,18,44,0.08); }
          .rastreio-result-title { margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 700; color: #0b4ea2; }
          .rastreio-result-meta { margin: 0 0 12px 0; color: #333; }
          .rastreio-items { display: flex; flex-direction: column; gap: 10px; }
          .rastreio-item { display:flex; gap:12px; padding: 10px; border: 1px solid #f0f2f5; border-radius: 6px; background: #fbfcfd; align-items:flex-start; }
          .rastreio-item-icon { width:48px; height:48px; flex:0 0 48px; display:flex; align-items:center; justify-content:center; }
          .rastreio-icon-svg { width:36px; height:36px; display:block; }
          .rastreio-item-body { flex:1; }
          .rastreio-item-head { font-weight:700; margin-bottom:6px; color:#0b3f6a; font-size:0.95rem; }
          .rastreio-item-desc { color:#333; margin-bottom:8px; line-height:1.35; }
          .rastreio-item-meta { font-size:12px; color:#6b7280; }
          .rastreio-route-line { height:6px; margin:8px 0 0 60px; border-radius:4px; background: linear-gradient(90deg, rgba(11,78,162,0.15) 0%, rgba(11,78,162,0.06) 50%, rgba(11,78,162,0.12) 100%); }
          .rastreio-notfound { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 18px 14px; margin: 12px auto; }
          .rastreio-notfound-icon svg { width: 64px; height: 64px; display: block; margin-bottom: 10px; }
          .rastreio-notfound-text { color: #c0392b; font-weight: 700; font-size: 1rem; }
          @keyframes floaty { from { transform: translateY(0px) scale(1); } to { transform: translateY(18px) scale(1.02); } }
        </style>
      </head>
      <body>
        <section class="tracking-page">
          <div class="tracking-bg" aria-hidden="true"></div>
          <div class="tracking-noise" aria-hidden="true"></div>
          <div class="tracking-shell">
            <div class="tracking-panel">
              <div class="rastreio-result-box">${htmlBody}</div>
            </div>
          </div>
        </section>
      </body>
      </html>`;

      res.status(200);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
      return;
    }

    // Repassa o status e headers essenciais
    res.status(upstream.status);
    const ct = upstream.headers.get('content-type') || 'text/plain; charset=utf-8';
    res.setHeader('Content-Type', ct);
    // resposta pronta ao navegador (same-origin, sem CORS)
    res.send(respText);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(502).send('Erro ao encaminhar requisição: ' + String(err.message || err));
  }
}
