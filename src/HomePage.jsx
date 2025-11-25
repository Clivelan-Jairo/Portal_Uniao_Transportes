import HeroSection from "./HeroSection";
import Services from "./Services";
import Unidades from "./Unidades";
import CidadesAtendidas from "./CidadesAtendidas";
import ClientCarousel from "./ClientCarousel";

function HomePage() {
  return (
    <>
      <HeroSection />
      <ClientCarousel />
      <Services />
      <Unidades />
      <CidadesAtendidas />
    </>
  );
}

export default HomePage;