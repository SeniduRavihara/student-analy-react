import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { db } from "@/firebase/config";
import { useData } from "@/hooks/useData";
import { CurrentUserDataType } from "@/types";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
// import { CircularProgress } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { currentUserData } = useData();
  const [usersData, setUsersData] = useState<CurrentUserDataType[] | null>(
    null
  );

  useEffect(() => {
    const collectionRef = collection(db, "users");
    const unsubscribe = onSnapshot(collectionRef, (QuerySnapshot) => {
      const usersDataArr = QuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      })) as CurrentUserDataType[];

      setUsersData(usersDataArr);
    });

    return unsubscribe;
  }, []);

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
          <Navbar />
        </div>
        <div className="w-full h-full">
          {/* <div className="w-full h-[2000px]"></div> */}
          <Outlet context={{ usersData }} />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default AdminLayout;
