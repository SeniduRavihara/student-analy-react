import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExamDataType } from "@/types";

type StudentMarksCardProps = {
  examsData: Array<ExamDataType> | null;
};

const getGrade = (marks: number): string => {
  if (marks >= 85) return "A";
  if (marks >= 70) return "B";
  if (marks >= 55) return "C";
  if (marks >= 40) return "S";
  return "F";
};

const getGradeVariant = (
  grade: string
): "default" | "destructive" | "outline" | "secondary" => {
  switch (grade) {
    case "A":
      return "default";
    case "B":
      return "secondary";
    case "C":
      return "secondary";
    case "S":
      return "outline";
    case "F":
      return "destructive";
    default:
      return "outline";
  }
};

const StudentMarksCard = ({ examsData }: StudentMarksCardProps) => {
  if (!examsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
          <CardDescription>
            A summary of your recent exam performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground p-8">
            Loading results...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Results</CardTitle>
        <CardDescription>
          A summary of your recent exam performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead className="text-center">Marks</TableHead>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead className="text-right">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {examsData
              .filter((exam) => exam.examStatus === "completed")
              .map((result, index) => {
                const grade = getGrade(result.examResult);
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {result.examName}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.examResult}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.rank ?? "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getGradeVariant(grade)}>{grade}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StudentMarksCard;
