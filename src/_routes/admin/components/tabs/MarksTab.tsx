import { MarksChart } from "@/_routes/private/components/charts/MarksChart";
import StudentMarksCard from "@/_routes/private/components/StudentMarksCard";
import { ChartSkeleton, StatsCardSkeleton } from "@/components/ui/skeleton";
import { ExamDataType } from "@/types";

const MarksTab = ({
  examsData,
  loading,
}: {
  examsData: Array<ExamDataType> | null;
  loading?: boolean;
}) => {
  if (loading) {
    return (
      <div className="w-full relative z-10 space-y-6">
        <ChartSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative z-10">
      {examsData && examsData.length > 0 ? (
        <div className="z-20">
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

          <div className="z-20 mt-10">
            <StudentMarksCard examsData={examsData} />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No exam data available
        </div>
      )}
    </div>
  );
};
export default MarksTab;
