// import Background from "@/components/background/Background";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CardsSection from "../components/CardsSection";
import Footer from "../components/Footer";
import { EarthCanvas, StarsCanvas } from "@/components/canvas";
// import BlogSlider from "../components/BlogSlider";

const HomePage = () => {
  return (
    <div className="w-full bg-[#ffffff]">
      <Header />
      <HeroSection />
      <CardsSection />
      {/* <BlogSlider /> */}
      {/* <Background /> */}

      {/* <ComputerCanvas /> */}
      <EarthCanvas />
      {/* <RoverCanvas /> */}
      {/* <BallCanvas /> */}
      <StarsCanvas />

      <Footer />
    </div>
  );
};
export default HomePage;
