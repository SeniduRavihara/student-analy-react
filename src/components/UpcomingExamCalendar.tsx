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

// Initialize moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const CustomToolbar = ({
  date,
  onNavigate,
  view,
  onView,
}: {
  date: Date;
  onNavigate: (
    navigate: "PREV" | "NEXT" | "TODAY" | "DATE",
    date?: Date
  ) => void;
  view: string;
  onView: (view: string) => void;
}) => {
  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const goToToday = () => {
    onNavigate("TODAY");
  };

  const getDateLabel = () => {
    switch (view) {
      case "month":
        return moment(date).format("MMMM YYYY");
      case "week":
        const startOfWeek = moment(date).startOf("week");
        const endOfWeek = moment(date).endOf("week");
        if (startOfWeek.month() === endOfWeek.month()) {
          return `${startOfWeek.format("MMM D")} - ${endOfWeek.format(
            "D, YYYY"
          )}`;
        } else {
          return `${startOfWeek.format("MMM D")} - ${endOfWeek.format(
            "MMM D, YYYY"
          )}`;
        }
      case "day":
        return moment(date).format("MMMM D, YYYY");
      default:
        return moment(date).format("MMMM YYYY");
    }
  };

  return (
    <div className="mb-4">
      {/* Navigation and Date */}
      <div className="flex justify-between items-center p-2 rounded">
        <Button onClick={goToBack} variant="outline" size="sm">
          <MdNavigateBefore />
        </Button>

        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">{getDateLabel()}</h2>
          <Button
            onClick={goToToday}
            variant="outline"
            size="sm"
            className="mt-1"
          >
            Today
          </Button>
        </div>

        <Button onClick={goToNext} variant="outline" size="sm">
          <MdNavigateNext />
        </Button>
      </div>

      {/* View Switcher */}
      <div className="flex justify-center gap-2 mt-2">
        {["month", "week", "day"].map((viewName) => (
          <Button
            key={viewName}
            onClick={() => onView(viewName)}
            variant={view === viewName ? "default" : "outline"}
            size="sm"
            className="capitalize"
          >
            {viewName}
          </Button>
        ))}
      </div>
    </div>
  );
};

const ExamCalendar = () => {
  const { currentUser } = useAuth();
  const [examsData, setExamsData] = useState<Array<ExamDataType> | null>(null);
  const [currentView, setCurrentView] = useState("month");

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

  const getCalendarHeight = () => {
    switch (currentView) {
      case "month":
        return 500;
      case "week":
        return 800;
      case "day":
        return 700;
      default:
        return 500;
    }
  };

  return (
    <div className="w-full">
      {examsData ? (
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={events || []}
            startAccessor="start"
            endAccessor="end"
            style={{ height: getCalendarHeight() }}
            views={["month", "week", "day"]}
            view={currentView}
            onView={setCurrentView}
            defaultView="month"
            components={{
              toolbar: CustomToolbar, // Use the custom toolbar
            }}
            onSelectEvent={(event) => console.log(event)} // Optional: To handle clicking events
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: "#3b82f6",
                border: "none",
                borderRadius: "4px",
                color: "white",
                fontSize: "12px",
                padding: "2px 4px",
              },
            })}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">Loading exams...</div>
      )}
    </div>
  );
};

export default ExamCalendar;
