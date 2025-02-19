import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { ClassesType as ClassesDataType, EXAM_YEARS } from "@/constants";
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
  const [selectedYear, setSelectedYear] = useState<string>(EXAM_YEARS[0].year);
  const [selectedClass, setSecectedClass] = useState<ClassesDataType>("THEORY");

  useEffect(() => {
    const collectionRef = collection(db, "users");
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const usersDataArr = (
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as UserDataType[]
      ).filter((user) => user.regNo && user.examYear == selectedYear && user.classes.includes(selectedClass)); // Ensure regNo exists

      setUsersData(usersDataArr);
    });

    return unsubscribe;
  }, [selectedClass, selectedYear]);

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
      <div className="hidden md:flex h-screen w-56 flex-col inset-y-0 fixed left-0 top-0 z-50">
        <Sidebar />
      </div>
      <div className="min-h-screen flex flex-col md:ml-56">
        <div className="h-[80px] inset-y-0 w-full  fixed top-0 left-0 z-10">
          <Navbar
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedClass={selectedClass}
            setSelectedClass={setSecectedClass}
          />
        </div>
        <div className="w-full min-h-screen bg-[#ededed] mt-[80px]">
          {/* <div className="w-full h-[2000px]"></div> */}
          <Outlet context={{ usersData, setSelectedYear, selectedYear, selectedClass }} />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default AdminLayout;
