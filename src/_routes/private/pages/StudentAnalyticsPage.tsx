import { useEffect, useState } from "react";
import { MarksChart } from "../components/charts/MarksChart";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { ExamDataType } from "@/types";
import UpcomingExamCalendar from "@/components/UpcomingExamCalendar";
// import StudentMarksCard from "../components/StudentMarksCard";

const StudentAnalyticsPage = () => {
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
    <div className="w-full h-full flex flex-col lg:flex-row items-center lg:items-start justify-center p-2 lg:p-5">
      {/* Chart Container */}
      <div className="w-full lg:w-2/3  p-3 rounded-md">
        {examsData && examsData.length > 0 ? (
          <MarksChart
            chartData={examsData
              .filter((exam) => exam.examStatus === "completed")
              .map(({ examName, examResult, avgResult, isAbsent }) => ({
                exam: examName,
                Mark: examResult,
                avgResult: avgResult ?? 0,
                isAbsent,
              }))}
          />
        ) : (
          <div className="text-center text-gray-500">
            No exam data available
          </div>
        )}
      </div>

      {/* TODO: Student Marks Card Container */}
      {/* <div className="w-full lg:w-1/3 p-3  rounded-md">
        {examsData ? (
          <StudentMarksCard examsData={examsData} />
        ) : (
          <div className="text-center text-gray-500">
            Loading student data...
          </div>
        )}
      </div> */}

      <UpcomingExamCalendar />
    </div>
  );
};

export default StudentAnalyticsPage;
