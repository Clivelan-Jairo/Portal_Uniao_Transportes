import { useRef, useState, useEffect } from 'react';
import cidadesPA from './data/cidades_pa.json';
import cidadesMT from './data/cidades_mt.json';
import './CidadesAtendidas.css';

// remove duplicates that can appear in the source JSON files
const uniqueCidadesPA = Array.from(new Set(cidadesPA));
const uniqueCidadesMT = Array.from(new Set(cidadesMT));

function CidadesAtendidas() {
  const [active, setActive] = useState(null); // 'PA' | 'MT' | null
  const [switching, setSwitching] = useState(false);
  const [prevActive, setPrevActive] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null); // {name, x, y}
  const [paFilter, setPaFilter] = useState('');
  const [mtFilter, setMtFilter] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const paRef = useRef(null);
  const mtRef = useRef(null);
  const svgRef = useRef(null);
  const cityRefs = useRef({});
  const listsRef = useRef(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const container = svgRef.current;
    if (!container) return;

    let mounted = true;
    let paNode = null;
    let mtNode = null;
    const handlers = {};

    // Load the SVG from public and inject into the container
    fetch('/img/mapa-brasil.svg')
      .then((r) => r.text())
      .then((svgText) => {
        if (!mounted) return;
        // Remove XML prolog and comments, strip inline fill attributes/styles
        // We'll also add a viewBox if the SVG has width/height but no viewBox
        // so the injected SVG scales responsively.
        let cleaned = svgText.replace(/<\?xml[^>]*>/g, '');
        cleaned = cleaned.replace(/<!--([\s\S]*?)-->/g, '');
        // Extract the original <svg ...> tag so we can capture width/height
        const svgTagMatch = cleaned.match(/<svg[^>]*>/i);
        if (svgTagMatch) {
          let svgTag = svgTagMatch[0];
          const widthMatch = svgTag.match(/\swidth=(?:"|')?([0-9.]+)(?:"|')?/i);
          const heightMatch = svgTag.match(/\sheight=(?:"|')?([0-9.]+)(?:"|')?/i);
          const hasViewBox = /viewBox\s*=/.test(svgTag);
          // remove width/height attributes from the svg tag
          svgTag = svgTag.replace(/\s(width|height)=("|'|)[^"'\s>]+("|'|)/gi, '');
          if (!hasViewBox && widthMatch && heightMatch) {
            const w = widthMatch[1];
            const h = heightMatch[1];
            // add a viewBox so the SVG becomes scalable
            svgTag = svgTag.replace(/>$/, ` viewBox=\"0 0 ${w} ${h}\" preserveAspectRatio=\"xMidYMid meet\">`);
          }
          // replace the original tag with the cleaned one
          cleaned = cleaned.replace(svgTagMatch[0], svgTag);
        }
        // remove fill="..." occurrences on paths and shapes
        cleaned = cleaned.replace(/\sfill=("|')[^"']*("|')/g, '');
        // remove inline style fill declarations
        cleaned = cleaned.replace(/style=("|')([^"']*)("|')/g, (m, q, content) => {
          const cleanedContent = content.replace(/fill:[^;]+;?/g, '');
          return `style=${q}${cleanedContent}${q}`;
        });

        container.innerHTML = cleaned;
        // Force a small delay and then add class to trigger CSS transition
        setTimeout(() => {
          try { container.classList.add('visible'); } catch (e) { /* ignore */ }
        }, 40);
        const svgRoot = container.querySelector('svg');
        if (!svgRoot) return;

        paNode = svgRoot.querySelector('#BR-PA');
        mtNode = svgRoot.querySelector('#BR-MT');

        handlers.onEnterPA = (ev) => {
          try {
            setHoverInfo({ name: 'Pará', x: ev.clientX, y: ev.clientY });
            (ev.currentTarget || ev.target)?.classList?.add('hover');
          } catch (e) {
            console.error('enter PA handler error', e);
          }
        };
        handlers.onEnterMT = (ev) => {
          try {
            setHoverInfo({ name: 'Mato Grosso', x: ev.clientX, y: ev.clientY });
            (ev.currentTarget || ev.target)?.classList?.add('hover');
          } catch (e) {
            console.error('enter MT handler error', e);
          }
        };
        handlers.onMove = (ev) => {
          try {
            setHoverInfo((s) => (s ? { ...s, x: ev.clientX, y: ev.clientY } : null));
          } catch (e) {
            console.error('move handler error', e);
          }
        };
        handlers.onLeave = (ev) => {
          try {
            setHoverInfo(null);
            (ev.currentTarget || ev.target)?.classList?.remove('hover');
          } catch (e) {
            console.error('leave handler error', e);
          }
        };
        handlers.onClickPA = (ev) => {
          try {
            ev?.preventDefault?.();
            ev?.stopPropagation?.();
            console.log('[Cidades] click PA handler, activeRef:', activeRef.current);
            // Show the list immediately. If switching from another state, record previous active
            if (activeRef.current && activeRef.current !== 'PA') {
              setPrevActive(activeRef.current);
              setSwitching(true);
              setActive('PA');
              setTimeout(() => {
                setSwitching(false);
                setPrevActive(null);
              }, 350);
            } else {
              setActive('PA');
            }
          } catch (e) {
            console.error('click PA handler error', e);
          }
        };
        handlers.onClickMT = (ev) => {
          try {
            ev?.preventDefault?.();
            ev?.stopPropagation?.();
            console.log('[Cidades] click MT handler, activeRef:', activeRef.current);
            // Show the list immediately. If switching from another state, record previous active
            if (activeRef.current && activeRef.current !== 'MT') {
              setPrevActive(activeRef.current);
              setSwitching(true);
              setActive('MT');
              setTimeout(() => {
                setSwitching(false);
                setPrevActive(null);
              }, 350);
            } else {
              setActive('MT');
            }
          } catch (e) {
            console.error('click MT handler error', e);
          }
        };

        if (paNode) {
          paNode.addEventListener('mouseenter', handlers.onEnterPA);
          paNode.addEventListener('mousemove', handlers.onMove);
          paNode.addEventListener('mouseleave', handlers.onLeave);
          paNode.addEventListener('click', handlers.onClickPA);
        }

        if (mtNode) {
          mtNode.addEventListener('mouseenter', handlers.onEnterMT);
          mtNode.addEventListener('mousemove', handlers.onMove);
          mtNode.addEventListener('mouseleave', handlers.onLeave);
          mtNode.addEventListener('click', handlers.onClickMT);
        }
      })
      .catch((err) => console.error('Erro ao carregar SVG:', err));

    return () => {
      mounted = false;
      try {
        if (paNode) {
          paNode.removeEventListener('mouseenter', handlers.onEnterPA);
          paNode.removeEventListener('mousemove', handlers.onMove);
          paNode.removeEventListener('mouseleave', handlers.onLeave);
          paNode.removeEventListener('click', handlers.onClickPA);
        }
        if (mtNode) {
          mtNode.removeEventListener('mouseenter', handlers.onEnterMT);
          mtNode.removeEventListener('mousemove', handlers.onMove);
          mtNode.removeEventListener('mouseleave', handlers.onLeave);
          mtNode.removeEventListener('click', handlers.onClickMT);
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    const svgRoot = svgRef.current;
    if (!svgRoot) return;
    const paNode = svgRoot.querySelector('#BR-PA');
    const mtNode = svgRoot.querySelector('#BR-MT');
    if (paNode) {
      if (active === 'PA') paNode.classList.add('is-active'); else paNode.classList.remove('is-active');
    }
    if (mtNode) {
      if (active === 'MT') mtNode.classList.add('is-active'); else mtNode.classList.remove('is-active');
    }
    // debug log when active changes
    try {
      const listEl = listsRef.current;
      const cs = listEl ? window.getComputedStyle(listEl) : null;
      console.log('[Cidades] active effect -> active:', active, 'listsRef present:', !!listEl, 'computed:', cs ? { display: cs.display, opacity: cs.opacity, transform: cs.transform, position: cs.position } : null);
    } catch (e) {
      console.error('[Cidades] error reading computed style', e);
    }
  }, [active]);

  // When `active` changes, scroll the corresponding block into view inside the lists container.
  useEffect(() => {
    const listContainer = listsRef.current;
    if (!listContainer || !active) return;
    const target = active === 'PA' ? paRef.current : active === 'MT' ? mtRef.current : null;
    if (!target) return;

    const doScroll = () => {
      try {
        console.log('[Cidades] doScroll start, active:', active, 'listContainer present:', !!listContainer, 'target present:', !!target);
        const offset = target.offsetTop - listContainer.offsetTop - (listContainer.clientHeight / 2) + (target.clientHeight / 2);
        listContainer.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
        console.log('[Cidades] doScroll finished');
      } catch (e) {
        console.error('scroll-on-active error', e);
      }
    };

    if (switching) {
      const id = setTimeout(doScroll, 350);
      return () => clearTimeout(id);
    }
    const id = setTimeout(doScroll, 50);
    return () => clearTimeout(id);
  }, [active, switching]);

  function openInMaps(city) {
    const q = encodeURIComponent(city + ' Brasil');
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  }

  return (
    <section id="cidades" className={`cidades-section fade-up ${active ? 'active' : ''}`}>
      <div className="cidades-bg" aria-hidden="true" />
      <div className="cidades-noise" aria-hidden="true" />
      
      <div className="container cidades-shell">
        <div className="cidades-header">
          <span className="cidades-eyebrow">Cobertura Operacional</span>
          <h2>Cidades atendidas</h2>
          <p className="cidades-desc">Clique nos estados para visualizar todas as cidades onde operamos.</p>
        </div>

        <div className="cidades-content">
        <div className="cidades-map" aria-hidden="false">
          <div className="svg-map" ref={svgRef}></div>

          {hoverInfo && (
            <div className="svg-tooltip" style={{ left: `${hoverInfo.x + 8}px`, top: `${hoverInfo.y - 24}px` }}>
              {hoverInfo.name}
            </div>
          )}

          {/* legend intentionally removed: map is shown centered initially */}
        </div>

        <div className="cidades-lists" ref={listsRef} aria-hidden={active ? 'false' : 'true'}>

          {active === 'PA' && (
            <div className={`city-block ${active === 'PA' ? 'highlight' : ''} ${switching && active === 'PA' ? 'entering' : ''} ${prevActive === 'PA' ? 'leaving' : ''}`} ref={paRef}>
              <h3>Pará (PA)</h3>
              <div className="cidades-search">
                <input
                  type="search"
                  placeholder="Buscar cidade no Pará..."
                  value={paFilter}
                  onChange={(e) => setPaFilter(e.target.value)}
                  aria-label="Buscar cidade"
                />
              </div>
              <ul>
                {uniqueCidadesPA
                  .filter((c) => c.toLowerCase().includes(paFilter.trim().toLowerCase()))
                  .map((c) => (
                    <li
                      key={`PA:${c}`}
                      ref={(el) => (cityRefs.current[`PA:${c}`] = el)}
                      className={selectedCity === `PA:${c}` ? 'selected' : ''}
                      onClick={(ev) => {
                        try {
                          ev?.preventDefault?.();
                          setSelectedCity(`PA:${c}`);
                          const el = cityRefs.current[`PA:${c}`];
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          openInMaps(c);
                        } catch (e) {
                          console.error('click city error', e);
                        }
                      }}
                    >
                      {c}
                    </li>
                  ))}
              </ul>
            </div>
          )}
          

          {active === 'MT' && (
            <div className={`city-block ${active === 'MT' ? 'highlight' : ''} ${switching && active === 'MT' ? 'entering' : ''} ${prevActive === 'MT' ? 'leaving' : ''}`} ref={mtRef}>
              <h3>Mato Grosso (MT)</h3>
              <div className="cidades-search">
                <input
                  type="search"
                  placeholder="Buscar cidade no Mato Grosso..."
                  value={mtFilter}
                  onChange={(e) => setMtFilter(e.target.value)}
                  aria-label="Buscar cidade MT"
                />
              </div>
              <ul>
                {uniqueCidadesMT
                  .filter((c) => c.toLowerCase().includes(mtFilter.trim().toLowerCase()))
                  .map((c) => (
                    <li
                      key={`MT:${c}`}
                      ref={(el) => (cityRefs.current[`MT:${c}`] = el)}
                      className={selectedCity === `MT:${c}` ? 'selected' : ''}
                      onClick={(ev) => {
                        try {
                          ev?.preventDefault?.();
                          setSelectedCity(`MT:${c}`);
                          const el = cityRefs.current[`MT:${c}`];
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          openInMaps(c);
                        } catch (e) {
                          console.error('click MT city error', e);
                        }
                      }}
                    >{c}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}

export default CidadesAtendidas;
