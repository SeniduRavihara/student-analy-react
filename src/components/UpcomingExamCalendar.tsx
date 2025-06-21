import { db } from "@/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import "@/styles/Calendar.css";
import { ExamDataType } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

// Initialize moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const CustomToolbar = ({
  date,
  onNavigate,
}: {
  date: Date;
  onNavigate: (
    navigate: "PREV" | "NEXT" | "TODAY" | "DATE",
    date?: Date
  ) => void;
}) => {
  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  return (
    <div className="flex justify-between items-center mb-4 p-2 rounded">
      <Button onClick={goToBack}>
        <MdNavigateBefore />
      </Button>

      <h2 className="text-lg font-semibold">
        {moment(date).format("MMMM YYYY")}
      </h2>

      <Button onClick={goToNext}>
        <MdNavigateNext />
      </Button>
    </div>
  );
};

const ExamCalendar = () => {
  const { currentUser } = useAuth();
  const [examsData, setExamsData] = useState<Array<ExamDataType> | null>(null);

  useEffect(() => {
    if (currentUser) {
      const collectionRef = query(
        collection(db, "users", currentUser?.uid, "exams"),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(collectionRef, (QuerySnapshot) => {
        const examsDataArr = QuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as ExamDataType[];

        setExamsData(examsDataArr);
      });

      return unsubscribe;
    }
  }, [currentUser]);

  // Map Firestore exam data to the format used by react-big-calendar
  const events = examsData?.map((exam) => ({
    title: exam.examName,
    start: new Date(exam.examDate),
    end: new Date(exam.examDate),
    examData: exam, // Store the whole exam data for later use
  }));

  return (
    <Card className="w-full">
      <CardContent className="p-2">
        {examsData ? (
          <Calendar
            localizer={localizer}
            events={events || []}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            views={["month", "agenda"]}
            components={{
              toolbar: CustomToolbar, // Use the custom toolbar
            }}
            onSelectEvent={(event) => console.log(event)} // Optional: To handle clicking events
          />
        ) : (
          <div className="text-center text-gray-500">Loading exams...</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamCalendar;
