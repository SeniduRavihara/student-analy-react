import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { ExamDataType } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { MarksChart } from "../components/charts/MarksChart";
import StudentMarksCard from "../components/StudentMarksCard";

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs  p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Analytics</h1>
        <p className="text-gray-600">
          Track your exam performance and progress over time
        </p>
      </div>

      {/* Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Container */}
        <div className="lg:col-span-2">
          {examsData && examsData.length > 0 ? (
            <MarksChart
              chartData={examsData
                .filter((exam) => exam.examStatus === "completed")
                .map(({ examName, examResult, avgResult, isAbsent }) => ({
                  exam: examName,
                  Mark: isAbsent ? null : examResult ?? null,
                  avgResult: avgResult ?? null,
                  isAbsent,
                }))}
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs  p-12">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium">No exam data available</p>
                <p className="text-sm">
                  Complete some exams to see your analytics
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Exam Results Table */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs  overflow-hidden">
            <StudentMarksCard examsData={examsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalyticsPage;
