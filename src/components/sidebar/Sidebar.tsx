import SidebarRoutes from "./SidebarRoutes";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full border-r flex flex-col overflow-auto bg-[#243642] shadow-sm relative">
      <div className="p-6 font-extrabold text-4xl h-20 flex items-center justify-center">
        <span
          className="cursor-pointer text-[#E2F1E7]"
          onClick={() => navigate("/")}
        >
          PHY6LK
        </span>
      </div>

      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
export default Sidebar;