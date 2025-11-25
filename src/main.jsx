import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './styles.css'

// Logger cliente para debug: salva erros e rejections em localStorage (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  ;(function() {
    function pushEntry(entry) {
      try {
        const arr = JSON.parse(localStorage.getItem('dev_client_errors') || '[]');
        arr.push(entry);
        localStorage.setItem('dev_client_errors', JSON.stringify(arr.slice(-200)));
      } catch (e) { /* ignore */ }
    }

    window.addEventListener('error', function(e) {
      pushEntry({
        type: 'error',
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error && e.error.stack ? e.error.stack : null,
        href: location.href,
        time: Date.now()
      });
    }, true);

    window.addEventListener('unhandledrejection', function(e) {
      const reason = e.reason;
      pushEntry({
        type: 'unhandledrejection',
        message: reason && reason.message ? reason.message : String(reason),
        stack: reason && reason.stack ? reason.stack : null,
        href: location.href,
        time: Date.now()
      });
    }, true);

    // expor helper rápido para inspecionar no console
    window.__getDevClientErrors = function() {
      try { return JSON.parse(localStorage.getItem('dev_client_errors') || '[]'); } catch(e) { return []; }
    };
  })();
}

// Definir variável CSS --vh baseada na altura da viewport
function setVhVariable() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhVariable();
window.addEventListener('resize', setVhVariable);

// Corrige scroll para âncoras considerando header sticky
function scrollToHashWithOffset(delay = 60) {
  if (!window.location.hash) return;
  const hash = window.location.hash;
  // espera um pouco para garantir que o conteúdo foi renderizado
  const el = () => document.querySelector(hash);

  // tenta obter altura do header (a partir da var CSS ou elemento header)
  const getHeaderOffset = () => {
    const headerHeightVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
    let offset = 0;
    if (headerHeightVar) {
      const parsed = parseFloat(headerHeightVar);
      if (!isNaN(parsed)) offset = parsed;
    }
    if (!offset) {
      const hdr = document.querySelector('header');
      if (hdr) offset = hdr.offsetHeight || 0;
    }
    return offset;
  };

  const start = performance.now();
  const maxWait = delay;

  // polling via rAF até encontrar o elemento e o header ter altura razoável
  function tryScroll() {
    const node = el();
    const elapsed = performance.now() - start;
    const offset = getHeaderOffset();
    if (node && (offset > 0 || elapsed > 200 || node.getBoundingClientRect().height > 0)) {
      const rectTop = node.getBoundingClientRect().top;
      // Se já estiver alinhado com o header (diferença pequena), não faz nada.
      const delta = rectTop - offset;
      if (Math.abs(delta) <= 2) {
        return; // já posicionado corretamente
      }
      const top = window.pageYOffset + rectTop - offset;
      // usar comportamento instantâneo para evitar sensação de "travamento"
      window.scrollTo({ top, behavior: 'auto' });
      return;
    }
    if (elapsed < maxWait) {
      requestAnimationFrame(tryScroll);
    } else {
      // timeout: tenta uma vez com o que tiver
      const node2 = el();
      if (node2) {
        const rectTop2 = node2.getBoundingClientRect().top;
        const top2 = window.pageYOffset + rectTop2 - getHeaderOffset();
        window.scrollTo({ top: top2, behavior: 'auto' });
      }
    }
  }

  requestAnimationFrame(tryScroll);
}

// Ao mudar o hash via navegação interna, aumentar um pouco o delay
// pois o conteúdo pode levar para renderizar dentro da SPA.
window.addEventListener('hashchange', () => scrollToHashWithOffset(300));
window.addEventListener('load', () => scrollToHashWithOffset(120));

// Também lida com cliques em links âncora dentro da página (HashLink etc.).
// Algumas bibliotecas fazem navegação SPA que podem não disparar hashchange
// imediatamente ou o layout ainda não estar pronto — então chamamos a correção
// após um pequeno atraso quando um link com hash é clicado.
document.addEventListener('click', (e) => {
  const a = (e.target && e.target.closest) ? e.target.closest('a[href*="#"]') : null;
  if (!a) return;
  try {
    const url = new URL(a.href);
    if (url.pathname !== window.location.pathname) return;
  } catch (err) {
    // não é URL absoluta — prosseguir
  }
  setTimeout(() => scrollToHashWithOffset(300), 40);
});
// Criar um router e ativar as future flags do React Router v7 (opt-in)
function RootError() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Oops — página não encontrada (404)</h2>
      <p>Desculpe, não encontramos esta rota. Volte para a <a href="/">página inicial</a>.</p>
    </div>
  );
}

const router = createBrowserRouter(
  [
    { path: '/*', element: <App />, errorElement: <RootError /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
