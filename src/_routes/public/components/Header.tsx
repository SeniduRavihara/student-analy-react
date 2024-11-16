import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  const navigate = useNavigate();

  return (
    <ul className="shadow-xl w-[90%] ml-auto mr-auto border-2 rounded-xl bg-[#e2f1e7c5] text-black h-[70px] flex justify-between items-center fixed top-5 backdrop-blur-xl left-0 right-0 z-50">
      <li
        onClick={() => navigate("/")}
        className="text-[40px] font-bold cursor-pointer text-[#243642]"
      >
        🇵​​🇭​​🇾​6️⃣​🇱​​🇰​
      </li>

      <li className="hidden md:flex">
        <ul className="flex space-x-5 items-center justify-center h-[70px] text-[#243642]">
          <li className="cursor-pointer hover:bg-accent px-3 py-2 rounded-lg duration-500">
            About
          </li>
          <li className="cursor-pointer hover:bg-accent px-3 py-2 rounded-lg duration-500">
            Classes
          </li>
          <li className="cursor-pointer hover:bg-accent px-3 py-2 rounded-lg duration-500">
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
