import { useAuth } from "@/hooks/useAuth";
import SidebarRoutes from "./SidebarRoutes";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="h-full border-r flex flex-col overflow-auto bg-white shadow-sm relative">
      <div className="p-6 font-extrabold text-4xl h-20 flex items-center justify-center">
        <span className="cursor-pointer" onClick={() => navigate("/")}>
          LOGO
        </span>
      </div>

      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>

     
    </div>
  );
};
export default Sidebar;
