import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { useData } from "@/hooks/useData";
// import { CircularProgress } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { currentUserData } = useData();

  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  if (!currentUserData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
        {/* <CircularProgress size="60px" isIndeterminate color="green.300" /> */}
      </div>
    );
  }

  return currentUserData.roles == "ADMIN" ? (
    <div className="w-screen h-screen bg-[#fff]">
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
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default AdminLayout;
