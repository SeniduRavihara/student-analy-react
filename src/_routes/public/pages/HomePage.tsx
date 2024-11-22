import Background from "@/components/background/Background";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CardsSection from "../components/CardsSection";
import BlogSlider from "../components/BlogSlider";

const HomePage = () => {
  return (
    <div className="w-full h-[1000px] bg-white">
      <Header />
      <HeroSection />
      {/* <CardsSection /> */}

      {/* <BlogSlider /> */}
      <Background />
    </div>
  );
};
export default HomePage;
