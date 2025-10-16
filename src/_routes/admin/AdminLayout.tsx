import ModernAdminHeader from "@/components/header/ModernAdminHeader";
import { ResponsiveContent } from "@/components/layout/ResponsiveContent";
import ModernAdminSidebar from "@/components/sidebar/ModernAdminSidebar";
import {
  CLASSES_TO_YEARS,
  ClassesType as ClassesDataType,
  EXAM_YEARS,
} from "@/constants";
import { SidebarProvider } from "@/context/SidebarContext";
import { db } from "@/firebase/config";
import { useData } from "@/hooks/useData";
import { UserDataType } from "@/types";
import { CircularProgress } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { currentUserData } = useData();
  const [usersData, setUsersData] = useState<UserDataType[] | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(EXAM_YEARS[0].year);
  const [selectedClass, setSecectedClass] = useState<ClassesDataType>(
    CLASSES_TO_YEARS[EXAM_YEARS[0].year][0] as ClassesDataType
  );

  // Reset class when year changes to ensure it's valid for the new year
  useEffect(() => {
    const availableClasses =
      CLASSES_TO_YEARS[selectedYear as keyof typeof CLASSES_TO_YEARS];
    if (!availableClasses.includes(selectedClass)) {
      setSecectedClass(availableClasses[0] as ClassesDataType);
    }
  }, [selectedYear, selectedClass]);

  useEffect(() => {
    const collectionRef = collection(db, "users");
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const usersDataArr = (
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as UserDataType[]
      ).filter(
        (user) =>
          user.regNo &&
          user.examYear == selectedYear &&
          user.classes.includes(selectedClass)
      ); // Ensure regNo exists

      setUsersData(usersDataArr);
    });

    return unsubscribe;
  }, [selectedClass, selectedYear]);

  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  if (!currentUserData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        {/* Loading... */}
        <CircularProgress size="60px" color="success" />
      </div>
    );
  }

  return currentUserData.roles == "ADMIN" ? (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <ModernAdminSidebar />
        <ResponsiveContent>
          <ModernAdminHeader
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedClass={selectedClass}
            setSelectedClass={setSecectedClass}
          />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet
                context={{
                  usersData,
                  setSelectedYear,
                  selectedYear,
                  selectedClass,
                }}
              />
            </div>
          </main>
        </ResponsiveContent>
      </div>
    </SidebarProvider>
  ) : (
    <Navigate to="/" />
  );
};

export default AdminLayout;
