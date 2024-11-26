import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { AvgChart } from "../components/charts/AvgChart";
import { useEffect, useState } from "react";
import { ExamDataType, UserDataType } from "@/types";
import { db } from "@/firebase/config";
import { useOutletContext } from "react-router-dom";
import RankingCard from "../components/RankingCard";

type OutletContextType = {
  selectedYear: string;
  usersData: UserDataType[] | null;
};

const AnalyticsPage = () => {
  const [examsData, setExamsData] = useState<Array<ExamDataType> | null>(null);
  const [loading, setLoading] = useState(true); // Loader state
  const { selectedYear, usersData } = useOutletContext<OutletContextType>();

  useEffect(() => {
    if (!selectedYear) return;

    setLoading(true); // Set loading before fetching data

    const collectionRef = query(
      collection(db, "exams"),
      where("examYear", "==", selectedYear),
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
  }, [selectedYear]);

  // Filter, validate, and sort usersData
  const filteredUsersData = usersData
    ? usersData
        .filter(
          (student) =>
            student.lastResult !== null &&
            student.lastResult !== undefined &&
            student.lastRank !== null &&
            student.lastRank !== undefined &&
            student.regNo !== null // Ensure regNo is not null
        )
        .map((student) => ({
          ...student,
          marks: student.lastResult ?? 0, // Default to 0 if marks are null
          regNo: student.regNo as string, // Cast regNo to string since nulls are filtered out
        }))
        .sort((a, b) => a.lastRank - b.lastRank)
    : [];

  return (
    <div className="p-2 md:p-5 bg-[#ededed] w-full h-full overflow-auto flex flex-col gap-5">
      {/* Chart Section */}
      <div className="flex justify-center items-center">
        {loading ? (
          <div className="text-gray-500">Loading exam data...</div>
        ) : examsData && examsData.length > 0 ? (
          <AvgChart
            chartData={examsData
              .filter((exam) => exam.examStatus === "completed")
              .map(({ examName, avgResult }) => ({
                exam: examName,
                avgMark: avgResult ?? 0,
              }))}
          />
        ) : (
          <div className="text-gray-500">No exam data available</div>
        )}
      </div>

      {/* Ranking Section */}
      <div className="flex justify-center items-center">
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
      </div>
    </div>
  );
};

export default AnalyticsPage;
