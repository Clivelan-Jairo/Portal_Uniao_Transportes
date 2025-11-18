import { useEffect, useRef, useState } from 'react';

function HeroSection() {
  const imgRef = useRef(null);
  const sectionRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const imgEl = imgRef.current;
    const sectionEl = sectionRef.current;
    if (!imgEl || !sectionEl) return;

    // Função para adicionar a classe de animação apenas uma vez
    function runAnimation() {
      if (animated) return;
      imgEl.classList.add('animate');
      setAnimated(true);
    }

    // Observer para animar quando a seção entrar na viewport
    let observer;
    let pendingIntersect = false;

    function tryRunAnimation() {
      // Verifica se a variável --header-height já foi calculada (evita layout shift)
      const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
      const headerIsSet = headerHeight && headerHeight.trim() !== '' && headerHeight.trim() !== '0px';
      const pageLoaded = document.readyState === 'complete';

      if (headerIsSet || pageLoaded) {
        runAnimation();
      } else {
        // espera o evento load para garantir que o header tenha seu tamanho final
        pendingIntersect = true;
        const onLoadThenRun = () => {
          if (pendingIntersect) runAnimation();
          window.removeEventListener('load', onLoadThenRun);
        };
        window.addEventListener('load', onLoadThenRun);
      }
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryRunAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionEl);

    // Se a hash corresponder ao início ao carregar a página, animar também
    if (window.location.hash === '#inicio') {
      // pequena espera para permitir o comportamento nativo de scroll
      setTimeout(() => tryRunAnimation(), 50);
    }

    // Quando a hash mudar (ex.: clicar no menu), garantir mesmo comportamento
    function onHashChange() {
      if (window.location.hash === '#inicio') {
        // garantir que a seção esteja visível (HashLink normalmente rola)
        sectionEl.scrollIntoView({ behavior: 'smooth' });
        // animar apenas se ainda não animou
        setTimeout(() => runAnimation(), 300);
      }
    }

    window.addEventListener('hashchange', onHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [animated]);

  return (
    <section id="inicio" className="hero" aria-label="Seção inicial" ref={sectionRef}>
      <div className="hero-anim-wrapper">
        <div className="hero-title">
          <img ref={imgRef} src="/img/letreiro.png" alt="Letreiro União Transportes" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;