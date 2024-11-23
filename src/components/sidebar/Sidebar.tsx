import SidebarRoutes from "./SidebarRoutes";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full border-r flex flex-col overflow-auto shadow-sm relative">
      <div className="p-6 h-20 flex items-center justify-center">
        <span
          className="cursor-pointer text-[#E2F1E7] text-[40px]"
          onClick={() => navigate("/")}
        >
          PHY6LK
        </span>
      </div>

      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>

      <div className="area h-full w-full">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
