import { MarksChart } from "@/_routes/private/components/charts/MarksChart";
import { ExamDataType } from "@/types";

const MarksTab = ({ examsData }: { examsData: Array<ExamDataType> | null }) => {
  return (
    <div>
      {examsData && examsData.length > 0 ? (
        <MarksChart
          chartData={examsData
            .filter((exam) => exam.examStatus === "completed")
            .map(({ examName, examResult, avgResult }) => ({
              exam: examName,
              Mark: examResult,
              avgResult: avgResult ?? 0,
            }))}
        />
      ) : (
        <div className="text-center text-gray-500">No exam data available</div>
      )}
    </div>
  );
};
export default MarksTab;