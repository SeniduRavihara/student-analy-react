import { DataTable } from "../components/exams/DataTable";
import { columns } from "../components/exams/Coloumns";
import { ExamTable } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createExam } from "@/firebase/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useNavigate } from "react-router-dom";

// const data: ExamTable[] = [
//   {
//     examId: "E001",
//     name: "Mathematics Final Exam",
//     examDate: new Date("2023-12-15"),
//     lastResult: 85,
//     status: "completed",
//     avgResult: null,
//   },
//   {
//     examId: "E002",
//     name: "Physics Midterm",
//     examDate: new Date("2024-03-22"),
//     lastResult: 90,
//     status: "completed",
//     avgResult: 85,
//   },
//   {
//     examId: "E003",
//     name: "Chemistry Quiz",
//     examDate: new Date("2024-05-10"),
//     lastResult: 78,
//     status: "completed",
//     avgResult: 82,
//   },
//   {
//     examId: "E004",
//     name: "Biology Practical",
//     examDate: new Date("2024-06-05"),
//     lastResult: 92,
//     status: "pending",
//     avgResult: 88,
//   },
//   {
//     examId: "E005",
//     name: "English Literature Exam",
//     examDate: new Date("2024-07-20"),
//     lastResult: 74,
//     status: "completed",
//     avgResult: 79,
//   },
//   {
//     examId: "E006",
//     name: "Computer Science Final",
//     examDate: new Date("2024-09-15"),
//     lastResult: 88,
//     status: "completed",
//     avgResult: 87,
//   },
//   {
//     examId: "E007",
//     name: "History Term Exam",
//     examDate: new Date("2024-10-25"),
//     lastResult: 81,
//     status: "pending",
//     avgResult: 78,
//   },
//   {
//     examId: "E008",
//     name: "Geography Assessment",
//     examDate: new Date("2024-11-10"),
//     lastResult: 95,
//     status: "completed",
//     avgResult: 90,
//   },
//   {
//     examId: "E009",
//     name: "Philosophy Paper",
//     examDate: new Date("2024-11-28"),
//     lastResult: 76,
//     status: "pending",
//     avgResult: 80,
//   },
//   {
//     examId: "E010",
//     name: "Economics Final",
//     examDate: new Date("2024-12-05"),
//     lastResult: 89,
//     status: "completed",
//     avgResult: 85,
//   },
// ];

const ExamsPage = () => {
  const [examsData, setExamsData] = useState<ExamTable[]>([]);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const collectionRef = collection(db, "exams");
    const unsubscribe = onSnapshot(collectionRef, (QuerySnapshot) => {
      const sexamsDataArr = QuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        examId: doc.id,
      })) as ExamTable[];

      console.log("EXAM",sexamsDataArr);
      setExamsData(sexamsDataArr);
    });

    return unsubscribe;
  }, []);

  const onClickCreateExam = async () => {
    if (!examName || !examDate) {
      toast({
        title: "Please fill all the fields",
        variant: "destructive",
      });
      return;
    }
    await createExam(examName, examDate);
    toast({
      title: "Exam created successfully",
      variant: "default",
    });
    setExamName("");
    setIsDialogOpen(false);
  };

  return (
    <div className="p-5 w-full h-full bg-[#ededed] overflow-auto">
      <Card>
        <CardContent>
          <DataTable columns={columns(navigate)} data={examsData} />
          <Button className="" onClick={() => setIsDialogOpen(true)}>
            Create New Exam
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* <DialogTrigger asChild>
          <Button className="mt-4">Create New Exam</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a New Exam</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Exam Name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    " justify-start text-left font-normal",
                    !examDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {examDate ? (
                    format(examDate, "PPP")
                  ) : (
                    <span>Pick a examDate</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={examDate}
                  onSelect={setExamDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button onClick={onClickCreateExam}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ExamsPage;
