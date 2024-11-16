import { useEffect, useState } from "react";
import { MarksChart } from "../components/charts/MarksChart";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { ExamDataType } from "@/types";

const StudentAnalyticsPage = () => {
  const { currentUser } = useAuth();
  const [examsData, setExamsData] = useState<Array<ExamDataType> | null>(null);

  console.log(examsData);

  useEffect(() => {
    if (currentUser) {
      const collectionRef = query(
        collection(db, "users", currentUser?.uid, "exams"),
        orderBy("createdAt", "asc")
      );
      // const collectionRef = collection(db, "users", currentUser?.uid, "exams");
      const unsubscribe = onSnapshot(collectionRef, (QuerySnapshot) => {
        const examsDataArr = QuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as ExamDataType[];

        // console.log("Sandali", examsDataArr);
        setExamsData(examsDataArr);
      });

      return unsubscribe;
    }
  }, [currentUser]);

  return (
    <div className="w-full h-full flex items-center justify-center p-2 md:p-5">
      {examsData && examsData.length > 0 ? (
        <MarksChart
          chartData={examsData.map(({ examName, examResult }) => ({
            exam: examName,
            Mark: examResult,
          }))}
        />
      ) : (
        <div>No exam data available</div>
      )}
    </div>
  );
};
export default StudentAnalyticsPage;
