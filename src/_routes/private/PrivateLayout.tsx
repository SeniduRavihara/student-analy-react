import { Navigate, Outlet } from "react-router-dom";

const PrivateLayout = () => {
  const token = localStorage.getItem("token");
  // const { currentUserData } = useData();

  if (!token) return <Navigate to="/" />;

  // if (currentUserData?.registered) {
  //   return <Navigate to="/dashboard" />;
  // }

  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
};
export default PrivateLayout;
