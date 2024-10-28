import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-700 text-white py-4 px-6 flex justify-between items-center">
      <div onClick={() => navigate("/")} className="text-xl font-bold cursor-pointer">
        EduAnalytics
      </div>
      <nav className="space-x-4">
        <ProfileDropdown />
      </nav>
    </header>
  );
};

export default Header;
