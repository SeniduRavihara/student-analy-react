import Background from "@/components/background/Background";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CardsSection from "../components/CardsSection";


const HomePage = () => {
  return (
    <div className="w-full h-[2000px]">
      <Header />
      <HeroSection />
      <CardsSection />

     

      <Background />
    </div>
  );
};
export default HomePage;
