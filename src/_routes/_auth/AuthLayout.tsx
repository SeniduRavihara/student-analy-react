import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {!token ? <Outlet /> : <Navigate to="/" />}

      <div className="w-screen h-screen absolute top-0 left-0 z-[-1]">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
};
export default AuthLayout;
