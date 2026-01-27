import { useEffect, useRef } from 'react';

/**
 * Hook customizado para gerenciar partículas gooey liquid
 * Responsável por criar e animar bolhas dinamicamente
 */
export const useGooeyParticles = (containerRef, config = {}) => {
  const defaultConfig = {
    particlesPerSecond: 3,
    minSize: 8,
    maxSize: 28,
    minDuration: 3.5,
    maxDuration: 5.5,
    minOpacity: 0.25,
    maxOpacity: 0.55,
    maxDrift: 75,
  };

  const configRef = useRef({ ...defaultConfig, ...config });
  const isRunningRef = useRef(false);
  const particleCountRef = useRef(0);
  const intervalIdRef = useRef(null);

  /**
   * Gera um número aleatório entre min e max
   */
  const randomBetween = (min, max, decimals = false) => {
    const value = Math.random() * (max - min) + min;
    return decimals ? Math.round(value * 100) / 100 : Math.floor(value);
  };

  /**
   * Cria uma partícula com propriedades aleatórias
   */
  const createParticle = () => {
    if (!containerRef.current) {
      console.warn('Container ref não está disponível');
      return;
    }

    const particle = document.createElement('div');
    particle.className = 'gooey-particle';

    // Gerar valores aleatórios
    const size = randomBetween(
      configRef.current.minSize,
      configRef.current.maxSize
    );

    const duration = randomBetween(
      configRef.current.minDuration,
      configRef.current.maxDuration,
      true
    );

    const opacity = randomBetween(
      configRef.current.minOpacity,
      configRef.current.maxOpacity
    );

    const leftPosition = Math.random() * 100;
    const delay = Math.random() * 0.5;
    const drift = (Math.random() - 0.5) * configRef.current.maxDrift;

    // Definir CSS variables
    particle.style.setProperty('--particle-size', `${size}px`);
    particle.style.setProperty('--particle-duration', `${duration}s`);
    particle.style.setProperty('--particle-delay', `${delay}s`);
    particle.style.setProperty('--particle-left', `${leftPosition}%`);
    particle.style.setProperty('--particle-opacity', opacity);
    particle.style.setProperty('--particle-drift', `${drift}px`);

    containerRef.current.appendChild(particle);

    // Remover partícula após animação
    const totalDuration = (duration + delay) * 1000;
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, totalDuration);

    particleCountRef.current++;
  };

  /**
   * Ajusta configuração baseado no tamanho da viewport
   */
  const handleWindowResize = () => {
    const width = window.innerWidth;

    if (width < 480) {
      configRef.current.particlesPerSecond = 2;
      configRef.current.maxSize = 20;
      configRef.current.maxDrift = 40;
    } else if (width < 768) {
      configRef.current.particlesPerSecond = 2.5;
      configRef.current.maxSize = 25;
      configRef.current.maxDrift = 60;
    } else {
      configRef.current.particlesPerSecond = 3;
      configRef.current.maxSize = 28;
      configRef.current.maxDrift = 75;
    }
  };

  /**
   * Inicia geração de partículas
   */
  const start = () => {
    if (isRunningRef.current) return;

    isRunningRef.current = true;
    const interval = 1000 / configRef.current.particlesPerSecond;

    intervalIdRef.current = setInterval(() => {
      if (isRunningRef.current) {
        createParticle();
      }
    }, interval);
  };

  /**
   * Pausa geração de partículas
   */
  const pause = () => {
    isRunningRef.current = false;
  };

  /**
   * Retoma geração de partículas
   */
  const resume = () => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
    }
  };

  /**
   * Para completamente e remove todas as partículas
   */
  const stop = () => {
    isRunningRef.current = false;
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  /**
   * Retorna estatísticas
   */
  const getStats = () => ({
    particlesCreated: particleCountRef.current,
    particlesActive: containerRef.current?.children.length || 0,
    isRunning: isRunningRef.current,
  });

  // Inicializar e limpar
  useEffect(() => {
    handleWindowResize();
    console.log('🎨 Gooey Particles iniciando...', containerRef.current);
    start();

    window.addEventListener('resize', handleWindowResize);

    // Parar se aba ficar inativa
    const handleVisibility = () => {
      if (document.hidden) {
        pause();
      } else {
        resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      window.removeEventListener('resize', handleWindowResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return {
    start,
    pause,
    resume,
    stop,
    getStats,
  };
};
