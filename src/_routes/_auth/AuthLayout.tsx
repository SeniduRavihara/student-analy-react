import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {!token ? <Outlet /> : <Navigate to="/" />}
    </div>
  );
};
export default AuthLayout;
