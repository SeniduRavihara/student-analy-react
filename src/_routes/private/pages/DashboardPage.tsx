import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  const [regNo, setRegNo] = useState("");

  useEffect(() => {
    const regNo = localStorage.getItem("regNo");

    if (regNo) {
      setOpen(true);
      setRegNo(regNo);
      localStorage.removeItem("regNo");
    }
  }, []);

  return (
    <div className="">
      <div className="hidden md:flex h-screen w-56 flex-col inset-y-0 fixed left-0 top-0 z-50">
        <Sidebar />
      </div>
      <div className="min-h-screen flex flex-col md:ml-56">
        <div className="h-[80px] inset-y-0 w-full fixed top-0 left-0 z-10">
          <Navbar />
        </div>
        <div className="w-full min-h-screen bg-[#ededed] mt-[80px]">
          <Outlet />
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Important Information</DialogTitle>
            <DialogDescription>
              Your Index Number for the exam is <strong>{regNo}</strong>. Please
              note it down for future reference.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default DashboardPage;
