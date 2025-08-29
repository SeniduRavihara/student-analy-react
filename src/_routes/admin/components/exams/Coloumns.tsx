import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExamTable } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const columns = (
  navigate: ReturnType<typeof useNavigate>,
  setConfirmDialog: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      examId: string;
    }>
  >
): ColumnDef<ExamTable>[] => {
  return [
    {
      accessorKey: "examName", // Updated from "name" to "examName"
      header: "Exam Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("examName")}</div>
      ),
    },
    {
      accessorKey: "examDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Exam Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("examDate")).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "examStatus",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("examStatus")}</div>
      ),
    },
    {
      accessorKey: "avgResult",
      header: () => <div className="text-right">Average Result</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue("avgResult") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "classType",
      header: "Class Type",
      cell: ({ row }) => {
        const classType = row.getValue("classType");
        const displayValue = Array.isArray(classType)
          ? classType.join(", ")
          : String(classType || "");

        return (
          <div className="capitalize">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {displayValue}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const exam = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(exam.examName)}
                >
                  Copy Exam Name
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setConfirmDialog({ isOpen: true, examId: exam.examId })
                  }
                >
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    navigate(
                      `/admin/exams/add-results/${exam.examId}-${exam.examName}`
                    );
                  }}
                >
                  Add Results
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];
};
