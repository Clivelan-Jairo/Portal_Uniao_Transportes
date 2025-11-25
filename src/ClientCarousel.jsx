import React from 'react';
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
];

export default function ClientCarousel({ items = logos }) {
  // duplicar para loop contínuo
  const track = [...items, ...items];

  return (
    <section className="clients-carousel" aria-label="Logos de clientes">
      <div className="carousel-track">
        {track.map((src, i) => (
          <div className="carousel-item" key={`${src}:${i}`}>
            <img src={src} alt={`Cliente ${i % items.length + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
