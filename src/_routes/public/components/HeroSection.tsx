import { TypeAnimation } from "react-type-animation";

const HeroSection = () => {
  return (
    <div className="w-full h-[200px] mt-[70px] flex flex-col justify-center items-center ">
      {/* <img src="/PHY6LK.png" alt="" className="w-[500px] h-[100px]" /> */}

      <h2 className="text-blue-600 ml-1 font-doto font-extrabold text-5xl">
        Smart
        {/* <span className="font-extrabold">+</span> */}
        <span className="text-blue-600 ml-1 font-doto font-extrabold text-5xl">
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              " THINK",
              3000, // wait 1s before replacing "Mice" with "Hamsters"
              " PHYSICS",
              3000,
            ]}
            wrapper="span"
            speed={1}
            cursor={false}
            deletionSpeed={1}
            // style={{display: "inline-block" }}
            repeat={Infinity}
          />
        </span>
      </h2>
    </div>
  );
};
export default HeroSection;
