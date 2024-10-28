import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  return (
    <div className="w-full h-full flex items-center justify-between">
      <div className="hidden md:flex h-full w-56 flex-col inset-y-0 z-50">
        <Sidebar />
      </div>
      <div className="w-full h-full flex flex-col">
        <div className="h-[80px] inset-y-0 w-full">
          <Navbar />
        </div>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
