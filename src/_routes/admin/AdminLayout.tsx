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

  return currentUserData.roles == "ADMIN" ? <Outlet /> : <Navigate to="/" />;
};

export default AdminLayout;
