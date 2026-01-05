import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import "./styles.css";

import Header from "./Header";
import Footer from "./Footer";
import HomePage from './HomePage';
import ContatoPage from './ContatoPage';
import SobrePage from './SobrePage';
import RastreioPage from './RastreioPage';
import ScrollToTop from './ScrollToTop';

function App() {
  const location = useLocation();

  // Lógica para animação e scroll para o topo
  useEffect(() => {
    // Lógica para a animação de fade-up
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, {
      threshold: 0.1
    });

    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [location]); // Re-executa ao mudar de rota

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
