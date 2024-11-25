import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const Header = ({
  footerRef,
  cardsRef,
}: {
  footerRef: React.RefObject<HTMLDivElement>;
  cardsRef: React.RefObject<HTMLDivElement>;
}) => {
  const navigate = useNavigate();

  const handleScrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const headerHeight = 70; // Adjust this to your actual header height
      const scrollPosition =
        ref.current.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  };

  return (
    <ul className="border ml-auto mr-auto text-white bg-[#ffffff] h-[70px] flex justify-between items-center fixed top-0 backdrop-blur-xl left-0 right-0 z-50">
      <li
        onClick={() => navigate("/")}
        className="text-[30px] sm:text-[45px] font-extrabold cursor-pointer text-[#243642]"
      >
        PHY6LK
        {/* <img src="/PHY6LK.png" alt="" className="w-[150px] h-[50px] md:w-[200px] md:h-[80px]" /> */}
      </li>

      <li className="hidden md:flex text-white">
        <ul className="flex space-x-5 items-center justify-center h-[70px] text-black">
          <li className="cursor-pointer hover:bg-accent px-3 py-2 rounded-lg duration-500">
            About
          </li>
          <li
            onClick={() => handleScrollToRef(cardsRef)}
            className="cursor-pointer hover:bg-accent px-3 py-2 rounded-lg duration-500"
          >
            Classes
          </li>
          <li
            onClick={() => handleScrollToRef(footerRef)}
            className="cursor-pointer hover:bg-accent px-3 py-2 rounded-lg duration-500"
          >
            Contact
          </li>
        </ul>
      </li>

      <li className="mr-10">
        <ProfileDropdown />
      </li>
    </ul>
  );
};

export default Header;
