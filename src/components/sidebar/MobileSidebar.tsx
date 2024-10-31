import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";


function MobileSidebar() {
  return (
    <div>
      <Sheet>
        <SheetTrigger className="md:hidden hover:opacity-75 transition">
          <Menu size={22} className="text-blue-400" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-white">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}
export default MobileSidebar;
