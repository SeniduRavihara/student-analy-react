import { columns } from "@/_routes/admin/components/student-data/Coloumns";
import { ExamDataType, UserDataType } from "@/types";
import { DataTable } from "../components/student-data/DataTable";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Tabs } from "../components/Tabs";
import MarksTab from "../components/tabs/MarksTab";
import InfoTab from "../components/tabs/InfoTab";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";

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
      content: <InfoTab />,
    },
  ];

  return (
    <div className="p-2 md:p-5 w-full h-full overflow-auto">
      <Card>
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
        <DrawerContent className="w-full h-[80%] p-10">
          <Tabs tabs={tabs} selectedUser={selectedUser} />
        </DrawerContent>
      </Drawer>
    </div>
  );
};
export default StudentDetailsPage;
