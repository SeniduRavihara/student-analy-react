import { collection, onSnapshot } from "firebase/firestore";
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
    const collectionRef = collection(db, "exams");
    const unsubscribe = onSnapshot(collectionRef, (QuerySnapshot) => {
      const examsDataArr = (
        QuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as ExamDataType[]
      ).filter((exam) => exam.examYear === selectedYear);

      console.log("Sandali", examsDataArr);
      setExamsData(examsDataArr);
    });

    return unsubscribe;
  }, [selectedYear]);

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
