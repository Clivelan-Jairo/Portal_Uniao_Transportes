import React, { useEffect, useRef } from 'react';
import './ClientCarousel.css';

// Logos reais colocadas em `public/img/clientes/` (adicionados pelo usuário)
const logos = [
  '/img/clientes/logo1.png',
  '/img/clientes/logo2.png',
  '/img/clientes/logo3.png',
  '/img/clientes/logo4.png',
  '/img/clientes/logo5.png',
  '/img/clientes/logo6.png',
  '/img/clientes/logo7.png',
  '/img/clientes/logo8.png',
  '/img/clientes/logo9.png',
  '/img/clientes/logo10.png',
  '/img/clientes/logo11.png',
];

export default function ClientCarousel({ items = logos, speed = 60 }) {
  // speed: pixels per second
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);

  const allItems = [...items, ...items]; // duplicate for seamless loop

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let lastTime = performance.now();
    let offset = 0;

    const getSingleWidth = () => track.scrollWidth / 2 || 0;

    const step = (time) => {
      const singleWidth = getSingleWidth();
      if (!singleWidth) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const delta = time - lastTime;
      lastTime = time;
      // always advance (no pause on hover) so loop is smooth
      offset += (speed * delta) / 1000;
      if (offset >= singleWidth) offset = offset - singleWidth;
      track.style.transform = `translateX(${-offset}px)`;
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    const onResize = () => {
      // re-evaluate immediately to avoid jumps
      lastTime = performance.now();
      // no need to adjust offset; the logic wraps by singleWidth
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [items, speed]);

  return (
    <section className="clients-carousel" aria-label="Logos de clientes" ref={containerRef}>
      <div className="carousel-track" ref={trackRef}>
        {allItems.map((src, i) => (
          <div className="carousel-item" key={`${src}:${i}`}>
            <img src={src} alt={`Cliente ${i % items.length + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
