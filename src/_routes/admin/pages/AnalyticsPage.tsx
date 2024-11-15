import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { AvgChart } from "../components/charts/AvgChart";
import { useEffect, useState } from "react";
import { ExamDataType } from "@/types";
import { db } from "@/firebase/config";
import { useOutletContext } from "react-router-dom";

type OutletContextType = {
  selectedYear: string;
};

const AnalyticsPage = () => {
  const [examsData, setExamsData] = useState<Array<ExamDataType> | null>(null);
  const { selectedYear } = useOutletContext<OutletContextType>();

  useEffect(() => {
    if (!selectedYear) return;

    const collectionRef = query(
      collection(db, "exams"),
      where("examYear", "==", selectedYear),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const examsDataArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as ExamDataType[];

      console.log(examsDataArr);

      setExamsData(examsDataArr);
    });

    return unsubscribe;
  }, [selectedYear]); // Re-fetch only when selectedYear changes

  return (
    <div className="bg-[#ededed] w-full h-full overflow-auto">
      {examsData && examsData.length > 0 ? (
        <AvgChart
          chartData={examsData.map(({ examName, avgResult }) => ({
            exam: examName,
            avgMark: avgResult ?? 0,
          }))}
        />
      ) : (
        <div>No exam data available</div>
      )}
    </div>
  );
};
export default AnalyticsPage;
