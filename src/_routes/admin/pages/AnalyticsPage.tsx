import { db } from "@/firebase/config";
import { ExamDataType, UserDataType } from "@/types";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { BarChart3, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AvgChart } from "../components/charts/AvgChart";

type OutletContextType = {
  selectedYear: string;
  usersData: UserDataType[] | null;
  selectedClass: string;
};

const AnalyticsPage = () => {
  const [examsData, setExamsData] = useState<Array<ExamDataType> | null>(null);
  const [loading, setLoading] = useState(true); // Loader state
  const { selectedYear, selectedClass } = useOutletContext<OutletContextType>();

  useEffect(() => {
    if (!selectedYear) return;

    setLoading(true); // Set loading before fetching data

    const collectionRef = query(
      collection(db, "exams"),
      where("examYear", "==", selectedYear),
      where("classType", "array-contains", selectedClass),
      orderBy("examDate", "asc")
    );
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const examsDataArr = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as ExamDataType[];

        setExamsData(examsDataArr);
        console.log(examsDataArr);

        setLoading(false); // Data fetched
      },
      (error) => {
        console.error("Error fetching exams data:", error);
        setLoading(false); // Stop loader even if there's an error
      }
    );

    return unsubscribe;
  }, [selectedClass, selectedYear]);

  // Filter, validate, and sort usersData
  // const filteredUsersData = usersData
  //   ? usersData
  //       .filter(
  //         (student) =>
  //           student.lastResult !== null &&
  //           student.lastResult !== undefined &&
  //           student.lastRank !== null &&
  //           student.lastRank !== undefined &&
  //           student.regNo !== null // Ensure regNo is not null
  //       )
  //       .map((student) => ({
  //         ...student,
  //         marks: student.lastResult ?? 0, // Default to 0 if marks are null
  //         regNo: student.regNo as string, // Cast regNo to string since nulls are filtered out
  //       }))
  //       .sort((a, b) => a.lastRank - b.lastRank)
  //   : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          System Analytics
        </h1>
        <p className="text-gray-600">
          Overview of exam performance and system statistics for{" "}
          <span className="font-medium text-blue-600">{selectedYear}</span> -{" "}
          <span className="font-medium text-blue-600">{selectedClass}</span>{" "}
          (includes exams with multiple class types)
        </p>
      </div>

      {/* Analytics Chart */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading exam data...</p>
          </div>
        </div>
      ) : examsData && examsData.length > 0 ? (
        <AvgChart
          chartData={examsData
            .filter((exam) => exam.examStatus === "completed")
            .map(({ examName, avgResult }) => ({
              exam: examName,
              avgMark: avgResult ?? null,
            }))}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium">No exam data available</p>
            <p className="text-sm">Create some exams to see analytics</p>
          </div>
        </div>
      )}

      {/* Ranking Section */}
      {/* <div className="flex justify-center items-center">
        {filteredUsersData && filteredUsersData.length > 0 ? (
          <RankingCard
            usersMarksData={filteredUsersData.map((data) => ({
              rank: data.lastRank,
              marks: data.lastResult,
              name: data.userName,
              regNo: data.regNo, // regNo is guaranteed to be a string now
            }))}
          />
        ) : (
          <div className="text-gray-500">No ranking data available</div>
        )}
      </div> */}
    </div>
  );
};

export default AnalyticsPage;
