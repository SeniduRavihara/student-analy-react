import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}
export default PrivateLayout