// import Background from "@/components/background/Background";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import CardsSection from "../components/CardsSection";
import Footer from "../components/Footer";
// import BlogSlider from "../components/BlogSlider";

const HomePage = () => {
  return (
    <div className="w-full bg-white">
      <Header />
      <HeroSection />
      <CardsSection />
      {/* <BlogSlider /> */}
      {/* <Background /> */}
      <Footer />
    </div>
  );
};
export default HomePage;
