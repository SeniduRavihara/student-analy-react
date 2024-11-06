import NavbarRoutes from "./NavbarRoutes";
import MobileSidebar from "./sidebar/MobileSidebar";

function Navbar() {
  return (
    <div className="p-4 border-b h-full flex items-center bg-[#ededed] shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
}
export default Navbar;
