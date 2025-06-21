import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { ExamDataType } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import StudentInfo from "../components/StudentInfo";
import StudentMarksCard from "../components/StudentMarksCard";

const StudentProfilePage = () => {
  const { currentUser } = useAuth();
  const [examsData, setExamsData] = useState<Array<ExamDataType> | null>(null);

  useEffect(() => {
    if (currentUser) {
      const collectionRef = query(
        collection(db, "users", currentUser?.uid, "exams"),
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
  }, [currentUser]);

  return (
    <div className="w-full h-full flex flex-col gap-5 bg-[#ededed] p-2 md:p-5">
      <ProfileHeader />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <StudentInfo />
        </div>
        <div>
          <StudentMarksCard examsData={examsData} />
        </div>
      </div>
    </div>
  );
};
export default StudentProfilePage;
