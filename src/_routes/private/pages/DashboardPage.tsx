import { Outlet } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { useData } from "@/hooks/useData";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DashboardPage = () => {
  const { currentUserData } = useData();
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   const genarateRegNo = async () => {
  //     if (!currentUserData?.regNo && currentUserData) {
  //       const examYear = (await fetchUserInfo(currentUserData?.uid)).examYear;
  //       console.log(examYear);
  //       const regNo = await generateIndexNumber(currentUserData?.uid, examYear);

  //       const userDocRef = doc(db, "users", currentUserData?.uid);
  //       await updateDoc(userDocRef, {
  //         regNo: regNo,
  //       });

  //       setOpen(true);
  //     }
  //   };

  //   genarateRegNo();
  // }, [currentUserData]);

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
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              Your Index Number is {currentUserData?.regNo}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default DashboardPage;
