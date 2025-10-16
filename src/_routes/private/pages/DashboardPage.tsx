import ModernUserHeader from "@/components/header/ModernUserHeader";
import { ResponsiveContent } from "@/components/layout/ResponsiveContent";
import ModernUserSidebar from "@/components/sidebar/ModernUserSidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarProvider } from "@/context/SidebarContext";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

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

  // if (!currentUserData?.regNo) {
  //   return <Navigate to="/register-as-new" />;
  // }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <ModernUserSidebar />
        <ResponsiveContent>
          <ModernUserHeader />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </ResponsiveContent>
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
    </SidebarProvider>
  );
};
export default DashboardPage;
