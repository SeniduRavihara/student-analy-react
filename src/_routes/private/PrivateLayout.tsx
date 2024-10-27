import { Navigate, Outlet } from "react-router-dom";

const PrivateLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
};
export default PrivateLayout;
