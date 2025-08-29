import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UpcomingExamCalendar from "@/components/UpcomingExamCalendar";
import {
  CLASSES_TO_YEARS,
  ClassesType as ClassesDataType,
  EXAM_YEARS,
} from "@/constants";
import { createExam, deleteExam } from "@/firebase/api";
import { db } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ExamDataType, ExamTable } from "@/types";
import { format } from "date-fns";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { CalendarIcon, Loader2, SquareCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { columns } from "../components/exams/Coloumns";
import { DataTable } from "../components/exams/DataTable";

type OutletContextType = {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  selectedClass: ClassesDataType;
};

const ExamsPage = () => {
  const [examsData, setExamsData] = useState<ExamTable[]>([]);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState<Date>();
  const [examYear, setExamYear] = useState(EXAM_YEARS[0].year);
  const [classTypes, setClassTypes] = useState<ClassesDataType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    examId: "",
  });

  const [loading, setLoading] = useState(false);

  const { selectedYear, selectedClass } = useOutletContext<OutletContextType>();

  const navigate = useNavigate();

  // const handleUpdateUsers = async () => {
  //   await addDefaultClassesToUsers();
  //   alert("Users updated successfully!");
  // };

  // useEffect(() => {
  //   console.log(examYear);
  // }, [examYear]);

  // Clear class types when exam year changes
  useEffect(() => {
    setClassTypes([]);
  }, [examYear]);

  useEffect(() => {
    const collectionRef = collection(db, "exams");

    // Add query to sort by `createdAt` in ascending order
    const q = query(collectionRef, orderBy("examDate", "desc"));

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const examsDataArr = (
        QuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
          examId: doc.id,
        })) as ExamDataType[]
      ).filter((exam) => {
        const examClassType = exam.classType;
        const isMatch = Array.isArray(examClassType)
          ? examClassType.includes(selectedClass)
          : examClassType === selectedClass;

        return exam.examYear === selectedYear && isMatch;
      });

      // console.log("EXAM", examsDataArr);
      setExamsData(examsDataArr);
    });

    return unsubscribe;
  }, [selectedClass, selectedYear]);

  const toggleClassType = (classType: ClassesDataType) => {
    setClassTypes((prevClasses) =>
      prevClasses.includes(classType)
        ? prevClasses.filter((c) => c !== classType)
        : [...prevClasses, classType]
    );
  };

  const onClickCreateExam = async () => {
    // console.log(examYear);
    setLoading(true);

    if (!examName || !examDate || !examYear || classTypes.length === 0) {
      toast({
        title: "Please fill all the fields and select at least one class type",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Create multiple exams, one for each selected class type
    // for (const classType of classTypes) {
    // await createExam(examName, examDate, examYear, classType);
    // }

    console.log({ examName, examDate, examYear, classTypes });
    await createExam(examName, examDate, examYear, classTypes);

    toast({
      title: "Exam created successfully",
      variant: "default",
    });

    setExamName("");
    setExamDate(undefined);
    setExamYear(EXAM_YEARS[0].year);
    setClassTypes([]);
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

          {/* <Button
            className="ml-2"
            variant="outline"
            onClick={async () => {
              try {
                await updateExamClassTypeToArray("Cc5BFT9zaOjQR9izxkle");
                toast({
                  title: "Exam classType updated to array format successfully!",
                  variant: "default",
                });
              } catch (error) {
                console.error("Error updating exam classType:", error);
                toast({
                  title: "Error updating exam classType. Please try again.",
                  variant: "destructive",
                });
              }
            }}
          >
            Update Exam ClassType to Array
          </Button> */}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Class Types</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CLASSES_TO_YEARS[
                  examYear as keyof typeof CLASSES_TO_YEARS
                ].map((classItem) => (
                  <Card
                    key={classItem}
                    onClick={() =>
                      toggleClassType(classItem as ClassesDataType)
                    }
                    className={cn(
                      "p-3 flex items-center justify-between cursor-pointer transition-all",
                      classTypes.includes(classItem as ClassesDataType)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <span className="font-medium">{classItem}</span>
                    {classTypes.includes(classItem as ClassesDataType) && (
                      <SquareCheck className="h-5 w-5" />
                    )}
                  </Card>
                ))}
              </div>
            </div>

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

      {/* <Button onClick={updateAllExamCollection}>Fix User Classes</Button> */}

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
