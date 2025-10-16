import UpcomingExamCalendar from "@/components/UpcomingExamCalendar";

const CalendarPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Exam Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">
          View upcoming exams and important dates
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <UpcomingExamCalendar />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
