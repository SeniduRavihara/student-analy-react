import YearSelect from "@/_routes/admin/components/YearSelect";
import NavbarRoutes from "./NavbarRoutes";
import MobileSidebar from "./sidebar/MobileSidebar";
import { useData } from "@/hooks/useData";
import { toRoundLettersAndNumbers } from "@/lib/utils";
import { useLocation } from "react-router-dom";

type NavbarProps = {
  selectedYear?: string;
  setSelectedYear?: (year: string) => void;
};

function Navbar({ selectedYear, setSelectedYear }: NavbarProps) {
  const { currentUserData } = useData();
  const location = useLocation();

  const locationtext = location.pathname;
  let headerText;

  if (locationtext.includes("/profile")) {
    headerText = "PROFILE";
  } else if (locationtext.includes("/dashboard")) {
    headerText = "DASHBOARD";
  }

  return (
    <div className="p-4 md:ml-56 border-b h-full flex items-center bg-[#ededed] shadow-sm">
      <MobileSidebar />

      <h1 className="text-[#00A6ED]">
        {toRoundLettersAndNumbers(headerText ?? "")}
      </h1>

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
