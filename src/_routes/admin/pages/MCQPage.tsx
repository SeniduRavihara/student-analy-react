import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ModernDataTable } from "@/components/ui/modern-data-table";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { MCQTest } from "@/types";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

type OutletContextType = {
  selectedYear: string;
  selectedClass: string;
};

const MCQPage = () => {
  const { selectedYear, selectedClass } = useOutletContext<OutletContextType>();
  const [mcqTests, setMcqTests] = useState<MCQTest[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingMarks, setPassingMarks] = useState(50);

  useEffect(() => {
    const collectionRef = query(
      collection(db, "mcqTests"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const testsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as MCQTest[];

      // Filter by selected year and class
      const filteredTests = testsData.filter(
        (test) =>
          test.examYear === selectedYear &&
          test.classType.includes(selectedClass)
      );

      setMcqTests(filteredTests);
    });

    return unsubscribe;
  }, [selectedYear, selectedClass]);

  const handleCreateTest = async () => {
    if (!testTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test title",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newTest: Omit<MCQTest, "id"> = {
        title: testTitle,
        description: testDescription,
        examYear: selectedYear,
        classType: [selectedClass],
        questions: [],
        timeLimit,
        totalMarks: 0, // Will be calculated based on questions
        passingMarks,
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin", // You can get this from auth context
      };

      const docRef = await addDoc(collection(db, "mcqTests"), newTest);

      toast({
        title: "Success",
        description: "MCQ test created successfully!",
      });

      // Reset form
      setTestTitle("");
      setTestDescription("");
      setTimeLimit(30);
      setPassingMarks(50);
      setIsCreateDialogOpen(false);

      // Navigate to edit the test
      navigate(`/admin/mcq/${docRef.id}/edit`);
    } catch (error) {
      console.error("Error creating MCQ test:", error);
      toast({
        title: "Error",
        description: "Failed to create MCQ test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Test Title",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <div className="max-w-xs truncate">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "questions",
      header: "Questions",
      cell: ({ row }: any) => (
        <div className="text-center">{row.getValue("questions").length}</div>
      ),
    },
    {
      accessorKey: "timeLimit",
      header: "Time Limit",
      cell: ({ row }: any) => (
        <div className="text-center">{row.getValue("timeLimit")} min</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        const statusColors = {
          draft: "bg-gray-100 text-gray-800",
          published: "bg-green-100 text-green-800",
          archived: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status as keyof typeof statusColors]
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const test = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/mcq/${test.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/mcq/${test.id}/view`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">MCQ Tests</h1>
            <p className="text-gray-600">
              Create and manage multiple choice question tests for{" "}
              {selectedYear} - {selectedClass}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Test
          </Button>
        </div>
      </div>

      {/* MCQ Tests Table */}
      <ModernDataTable
        columns={columns}
        data={mcqTests}
        searchPlaceholder="Search by test title..."
        searchColumn="title"
        pageSize={8}
        title=""
        description=""
      />

      {/* Create Test Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New MCQ Test</DialogTitle>
            <DialogDescription>
              Create a new multiple choice question test for your students.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Test Title *</label>
              <Input
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Enter test title..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
                placeholder="Enter test description..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="mt-1"
                  min="1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Passing Marks (%)</label>
                <Input
                  type="number"
                  value={passingMarks}
                  onChange={(e) => setPassingMarks(Number(e.target.value))}
                  className="mt-1"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Exam Year</label>
                <div className="mt-1 p-2 bg-gray-50 rounded border text-sm text-gray-600">
                  {selectedYear}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Class Type</label>
                <div className="mt-1 p-2 bg-gray-50 rounded border text-sm text-gray-600">
                  {selectedClass}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTest}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Test"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCQPage;
