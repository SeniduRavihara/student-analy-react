// import { useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css"; // Import default styles

// const mockExamData = [
//   { date: "2024-11-20", name: "Math Exam" },
//   { date: "2024-11-25", name: "Science Exam" },
//   { date: "2024-12-05", name: "History Exam" },
// ];

// const UpcomingExamCalendar = () => {
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   // Function to check if a date has an exam
//   const tileContent = ({ date }: { date: Date }) => {
//     const exam = mockExamData.find(
//       (exam) => exam.date === date.toISOString().split("T")[0]
//     );
//     return exam ? <span className="text-blue-600 font-bold">•</span> : null;
//   };

//   // Function to handle date click
//   const handleDateClick = (value: Date) => {
//     setSelectedDate(value);
//   };

//   return (
//     <div className="flex flex-col items-center p-5">
//       <h2 className="text-lg font-semibold mb-4">Upcoming Exam Calendar</h2>
//       <Calendar
//         onChange={handleDateClick}
//         value={selectedDate}
//         tileContent={tileContent}
//       />
//       {selectedDate && (
//         <div className="mt-5 p-4 bg-white shadow-md rounded text-center">
//           <h3 className="text-lg font-medium">Exam Details</h3>
//           <p className="mt-2">
//             {mockExamData
//               .filter(
//                 (exam) => exam.date === selectedDate.toISOString().split("T")[0]
//               )
//               .map((exam) => <span key={exam.date}>{exam.name}</span>) ||
//               "No exams on this date"}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UpcomingExamCalendar;
