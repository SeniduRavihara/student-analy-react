import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}
export default PublicLayout