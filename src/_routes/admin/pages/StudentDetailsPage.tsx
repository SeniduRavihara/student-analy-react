import { columns } from "@/_routes/admin/components/student-data/Coloumns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { db } from "@/firebase/config";
import { ExamDataType, UserDataType } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { DataTable } from "../components/student-data/DataTable";
import { Tabs } from "../components/Tabs";
import InfoTab from "../components/tabs/InfoTab";
import MarksTab from "../components/tabs/MarksTab";

type OutletContextType = {
  usersData: UserDataType[] | null;
};

const StudentDetailsPage = () => {
  const { usersData } = useOutletContext<OutletContextType>();
  const [openDetailsPopup, setOpenDetailsPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDataType | null>(null);
  const [examsData, setExamsData] = useState<Array<ExamDataType> | null>(null);

  useEffect(() => {
    if (selectedUser) {
      const collectionRef = query(
        collection(db, "users", selectedUser?.uid, "exams"),
        orderBy("examDate", "asc")
      );
      const unsubscribe = onSnapshot(collectionRef, (QuerySnapshot) => {
        const examsDataArr = QuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as ExamDataType[];

        setExamsData(examsDataArr);
      });

      return unsubscribe;
    }
  }, [selectedUser]);

  const tabs = [
    {
      label: "Marks",
      value: "marks",
      content: <MarksTab examsData={examsData} />,
    },
    {
      label: "Info",
      value: "info",
      content: <InfoTab userInfo={selectedUser} examsData={examsData} />,
    },
  ];

  return (
    <div className="p-2 md:p-5 w-full h-full overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          <CardDescription>
            A comprehensive list of all students. Click on a row to view
            detailed information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersData && (
            <DataTable
              columns={columns(setOpenDetailsPopup, setSelectedUser, usersData)}
              data={usersData?.map((user) => ({
                indexNo: user.regNo || "",
                name: user.userName,
                email: user.email,
                lastResult: user.lastResult || 0,
              }))}
            />
          )}
        </CardContent>
      </Card>

      <Drawer open={openDetailsPopup} onOpenChange={setOpenDetailsPopup}>
        <DrawerContent className="w-full h-[90%] p-10 overflow-auto">
          <Tabs tabs={tabs} />
        </DrawerContent>
      </Drawer>
    </div>
  );
};
export default StudentDetailsPage;
