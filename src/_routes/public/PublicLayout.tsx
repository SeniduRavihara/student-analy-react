import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="">
      <Outlet />
    </div>
  );
}
export default PublicLayout