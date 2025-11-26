// Proxy simples para /api/trackingdest -> https://ssw.inf.br/api/trackingdest
// Coloque este arquivo em `api/trackingdest.js` para que plataformas como Vercel
// executem como uma Serverless Function e evitem bloqueios CORS do browser.

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

  try {
    // Lê o corpo da requisição como texto
    const bodyText = await new Promise((resolve, reject) => {
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

    const upstream = await fetch(target, {
      method: req.method,
      headers: forwardHeaders,
      body: bodyText || undefined,
    });

    const respText = await upstream.text();

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
