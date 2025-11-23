import { useRef, useState, useEffect } from 'react';
import cidadesPA from './data/cidades_pa.json';
import cidadesMT from './data/cidades_mt.json';

function CidadesAtendidas() {
  const [active, setActive] = useState(null); // 'PA' | 'MT' | null
  const [hoverInfo, setHoverInfo] = useState(null); // {name, x, y}
  const [paFilter, setPaFilter] = useState('');
  const [mtFilter, setMtFilter] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const paRef = useRef(null);
  const mtRef = useRef(null);
  const svgRef = useRef(null);
  const cityRefs = useRef({});

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
            setActive('PA');
            if (paRef.current) paRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch (e) {
            console.error('click PA handler error', e);
          }
        };
        handlers.onClickMT = (ev) => {
          try {
            ev?.preventDefault?.();
            ev?.stopPropagation?.();
            setActive('MT');
            if (mtRef.current) mtRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  }, [active]);

  function openInMaps(city) {
    const q = encodeURIComponent(city + ' Brasil');
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  }

  return (
    <section id="cidades" className={`cidades-section fade-up ${active ? 'active' : ''}`}>
      <h2>Cidades atendidas</h2>
      <p className="section-subtitle">Lista de cidades atendidas nos estados do Pará e Mato Grosso.</p>

      <div className="cidades-content">
        <div className="cidades-map" aria-hidden="false">
          <div className="svg-map" ref={svgRef}></div>

          {hoverInfo && (
            <div className="svg-tooltip" style={{ left: `${hoverInfo.x + 8}px`, top: `${hoverInfo.y - 24}px` }}>
              {hoverInfo.name}
            </div>
          )}

          <div className="map-legend">
            <span className="legend-item"><strong>PA</strong> — Pará</span>
            <span className="legend-item"><strong>MT</strong> — Mato Grosso</span>
          </div>
        </div>

        <div className="cidades-lists">
          <div className={`city-block ${active === 'PA' ? 'highlight' : ''}`} ref={paRef}>
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
              {cidadesPA
                .filter((c) => c.toLowerCase().includes(paFilter.trim().toLowerCase()))
                .map((c) => (
                  <li
                    key={`PA:${c}`}
                    ref={(el) => (cityRefs.current[`PA:${c}`] = el)}
                    className={selectedCity === `PA:${c}` ? 'selected' : ''}
                    onClick={(ev) => {
                      try {
                        ev?.preventDefault?.();
                        setActive('PA');
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

          <div className={`city-block ${active === 'MT' ? 'highlight' : ''}`} ref={mtRef}>
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
              {cidadesMT
                .filter((c) => c.toLowerCase().includes(mtFilter.trim().toLowerCase()))
                .map((c) => (
                  <li
                    key={`MT:${c}`}
                    ref={(el) => (cityRefs.current[`MT:${c}`] = el)}
                    className={selectedCity === `MT:${c}` ? 'selected' : ''}
                    onClick={(ev) => {
                      try {
                        ev?.preventDefault?.();
                        setActive('MT');
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
        </div>
      </div>
    </section>
  );
}

export default CidadesAtendidas;
