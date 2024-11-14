import YearSelect from "@/_routes/admin/components/YearSelect";
import NavbarRoutes from "./NavbarRoutes";
import MobileSidebar from "./sidebar/MobileSidebar";
import { useData } from "@/hooks/useData";

type NavbarProps = {
  selectedYear?: string;
  setSelectedYear?: (year: string) => void;
};

function Navbar({ selectedYear, setSelectedYear }: NavbarProps) {
  const { currentUserData } = useData();

  return (
    <div className="p-4 border-b h-full flex items-center bg-[#ededed] shadow-sm">
      <MobileSidebar />

      {currentUserData?.roles == "ADMIN" && selectedYear && setSelectedYear ? (
        <div className="ml-5 md:flex items-center gap-x-2">
          <YearSelect
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </div>
      ) : null}

      <NavbarRoutes />
    </div>
  );
}
export default Navbar;
