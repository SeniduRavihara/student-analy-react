import TiltCard from "@/components/TiltCard";

const CardsSection = () => {
  return (
    <div className="w-full h-full">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className=""
        >
          <path
            fill="#243642"
            fill-opacity="1"
            d="M0,256L48,250.7C96,245,192,235,288,213.3C384,192,480,160,576,170.7C672,181,768,235,864,245.3C960,256,1056,224,1152,218.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="bg-[#243642] w-full h-[500px] flex justify-around items-center">
        <TiltCard />
        <TiltCard />
        <TiltCard />
        <TiltCard />
      </div>
    </div>
  );
};
export default CardsSection;
