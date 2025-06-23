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
            </TableRow>
          </TableHeader>
          <TableBody>
            {examsData
              .filter((exam) => exam.examStatus === "completed")
              .map((result, index) => {
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
