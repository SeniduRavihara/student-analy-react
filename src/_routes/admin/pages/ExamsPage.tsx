import { DataTable } from "../components/exams/DataTable";
import { columns } from "../components/exams/Coloumns";
import { ExamDataType, ExamTable } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createExam, deleteExam } from "@/firebase/api";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXAM_YEARS } from "@/constants";
import UpcomingExamCalendar from "@/components/UpcomingExamCalendar";
import { ConfirmDialog } from "../components/ConfirmDialog";

type OutletContextType = {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
};

const ExamsPage = () => {
  const [examsData, setExamsData] = useState<ExamTable[]>([]);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState<Date>();
  const [examYear, setExamYear] = useState(EXAM_YEARS[0].year);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    examId: "",
  });

  const [loading, setLoading] = useState(false);

  const { selectedYear } = useOutletContext<OutletContextType>();

  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log(examYear);
  // }, [examYear]);

  useEffect(() => {
    const collectionRef = collection(db, "exams");

    // Add query to sort by `createdAt` in ascending order
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const examsDataArr = (
        QuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
          examId: doc.id,
        })) as ExamDataType[]
      ).filter((exam) => exam.examYear === selectedYear);

      console.log("EXAM", examsDataArr);
      setExamsData(examsDataArr);
    });

    return unsubscribe;
  }, [selectedYear]);

  const onClickCreateExam = async () => {
    // console.log(examYear);
    setLoading(true);

    if (!examName || !examDate || !examYear) {
      toast({
        title: "Please fill all the fields",
        variant: "destructive",
      });
      return;
    }

    await createExam(examName, examDate, examYear);

    toast({
      title: "Exam created successfully",
      variant: "default",
    });

    setExamName("");
    setExamDate(undefined);
    setExamYear(EXAM_YEARS[0].year);
    setIsDialogOpen(false);
    setLoading(false);
  };

  return (
    <div className="p-2 md:p-5 w-full h-full bg-[#ededed] overflow-auto flex flex-col gap-5 mb-10">
      <Card>
        <CardContent>
          <DataTable
            columns={columns(navigate, setConfirmDialog)}
            data={examsData}
          />

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

            <Select
              onValueChange={setExamYear}
              defaultValue={EXAM_YEARS[0].year}
              value={examYear}
            >
              <SelectTrigger className="">
                <SelectValue placeholder={EXAM_YEARS[0].year} />
              </SelectTrigger>
              <SelectContent>
                {EXAM_YEARS.map((year) => (
                  <SelectItem key={year.year} value={year.year}>
                    {year.label}
                  </SelectItem>
                ))}
                {/* <SelectItem value="2024">2024 A/L</SelectItem>
                <SelectItem value="2025">2025 A/L</SelectItem>
                <SelectItem value="2026">2026 A/L</SelectItem> */}
              </SelectContent>
            </Select>

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

            <Button onClick={onClickCreateExam} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UpcomingExamCalendar />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this exam? This action cannot be undone."
        onConfirm={() => {
          deleteExam(confirmDialog.examId);
          setConfirmDialog({ isOpen: false, examId: "" });
        }}
        onCancel={() => setConfirmDialog({ isOpen: false, examId: "" })}
      />
    </div>
  );
};
export default ExamsPage;
