import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  );
}
export default AdminLayout