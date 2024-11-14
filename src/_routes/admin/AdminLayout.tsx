import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { db } from "@/firebase/config";
import { useData } from "@/hooks/useData";
import { UserDataType } from "@/types";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
// import { CircularProgress } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { currentUserData } = useData();
  const [usersData, setUsersData] = useState<UserDataType[] | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("2024");

  useEffect(() => {
    const collectionRef = collection(db, "users");
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const usersDataArr = (
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as UserDataType[]
      ).filter((user) => user.regNo && user.examYear == selectedYear); // Ensure regNo exists

      setUsersData(usersDataArr);
    });

    return unsubscribe;
  }, [selectedYear]);

  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  if (!currentUserData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
        {/* <CircularProgress size="60px" isIndeterminate color="green.300" /> */}
      </div>
    );
  }

  return currentUserData.roles == "ADMIN" ? (
    <div className="">
      <div className="hidden md:flex h-screen w-56 flex-col inset-y-0 fixed left-0 top-0 bg-red-500 z-50">
        <Sidebar />
      </div>
      <div className="h-full flex flex-col md:ml-56 ">
        <div className="h-[80px] inset-y-0 w-full">
          <Navbar
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </div>
        <div className="w-full h-full">
          {/* <div className="w-full h-[2000px]"></div> */}
          <Outlet context={{ usersData, setSelectedYear, selectedYear }} />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default AdminLayout;
