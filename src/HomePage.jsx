import HeroSection from "./HeroSection";
import ClientCarousel from "./ClientCarousel";
import Infraestrutura from "./Infraestrutura";
import Unidades from "./Unidades";
import CidadesAtendidas from "./CidadesAtendidas";
import Services from "./Services";

function HomePage() {
  return (
    <>
      <HeroSection />
      <ClientCarousel />
      <Infraestrutura />
      <Unidades />
      <CidadesAtendidas />
      <Services />
    </>
  );
}

export default HomePage;