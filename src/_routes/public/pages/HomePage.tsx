// import Background from "@/components/background/Background";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CardsSection from "../components/CardsSection";
import Footer from "../components/Footer";
// import { EarthCanvas, StarsCanvas } from "@/components/canvas";
import GraphAnalysisSection from "../components/GraphAnalysisSection";
import { useRef } from "react";
// import { StarsCanvas } from "@/components/canvas";
// import BlogSlider from "../components/BlogSlider";

const HomePage = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full bg-[#ffffff]">
      <Header footerRef={footerRef} cardsRef={cardsRef} />
      <HeroSection />
      <CardsSection ref={cardsRef} />
      {/* <BlogSlider /> */}
      {/* <Background /> */}

      {/* <ComputerCanvas /> */}
      {/* <EarthCanvas /> */}
      {/* <RoverCanvas /> */}
      {/* <BallCanvas /> */}

      <GraphAnalysisSection />

      {/* <StarsCanvas /> */}

      <Footer ref={footerRef} />
    </div>
  );
};
export default HomePage;
