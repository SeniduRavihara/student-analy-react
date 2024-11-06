import { DataTable } from "@/_routes/private/components/DataTable";
import { columns } from "@/_routes/admin/components/student-data/Coloumns";
// import { DataTable } from "@/_routes/private/components/student-data/DataTable";
import { StudentTable } from "@/types";

export const data: StudentTable[] = [
  {
    indexNo: "S001",
    name: "John Doe",
    email: "john.doe@example.com",
    lastResult: 85,
  },
  {
    indexNo: "S002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    lastResult: 90,
  },
  {
    indexNo: "S003",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    lastResult: 78,
  },
  {
    indexNo: "S004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    lastResult: 92,
  },
  {
    indexNo: "S005",
    name: "David Wilson",
    email: "david.wilson@example.com",
    lastResult: 74,
  },
  {
    indexNo: "S006",
    name: "Sophia Johnson",
    email: "sophia.johnson@example.com",
    lastResult: 88,
  },
  {
    indexNo: "S007",
    name: "James Garcia",
    email: "james.garcia@example.com",
    lastResult: 81,
  },
  {
    indexNo: "S008",
    name: "Isabella Martinez",
    email: "isabella.martinez@example.com",
    lastResult: 95,
  },
  {
    indexNo: "S009",
    name: "Benjamin Lee",
    email: "benjamin.lee@example.com",
    lastResult: 76,
  },
  {
    indexNo: "S010",
    name: "Mia White",
    email: "mia.white@example.com",
    lastResult: 89,
  },
];

const StudentDetailsPage = () => {
  return (
    <div className="p-5 w-full h-full overflow-auto">
      <DataTable />
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  );
};
export default StudentDetailsPage;
