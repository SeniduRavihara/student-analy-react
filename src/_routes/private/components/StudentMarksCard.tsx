import { Card, CardContent } from "@/components/ui/card";
import { ExamDataType } from "@/types";

type StudentMarksCardProps = {
  examsData: Array<ExamDataType> | null;
};

const StudentMarksCard = ({ examsData }: StudentMarksCardProps) => {
  if (!examsData) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <div className="py-4 rounded-md">
          <h2 className="text-lg font-semibold mb-4">Exam Results</h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-2 py-2">
                  Exam Name
                </th>
                <th className="border border-gray-300 px-2 py-2">
                  Marks
                </th>
                <th className="border border-gray-300 px-2 py-2">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {examsData.map((result, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {result.examName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {result.examResult}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {getGrade(result.examResult)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate grade
const getGrade = (marks: number): string => {
  if (marks >= 85) return "A";
  if (marks >= 70) return "B";
  if (marks >= 55) return "C";
  if (marks >= 40) return "D";
  return "F";
};

export default StudentMarksCard;
